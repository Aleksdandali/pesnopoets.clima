-- Migration 023: Analytics foundation
--
-- Builds the in-house analytics warehouse that powers the admin "Insights" chat,
-- the /tg/insights manager view, and the daily AI digest. Designed as the
-- authoritative store; PostHog (web/mini-app) + Clarity (web) are secondary
-- forwarders for session-replay/heatmaps only.
--
-- Decisions baked in (2026-05-22 consilium):
--   1b — `revenue_recognized` fires when service_jobs.status = 'completed'
--   4a — ai_insight_logs retained 90 days (delete_after column + nightly cron)
--   5a — mobile session-replay sampling decided client-side (client role only)
--
-- Partition strategy: monthly RANGE on ts. BRIN(ts) for cheap scans, GIN on
-- properties JSONB. ensure_analytics_partitions() pre-creates 6 months ahead;
-- intended to be called from a daily cron.

------------------------------------------------------------------------------
-- 1. analytics_events  (partitioned parent)
------------------------------------------------------------------------------

create table if not exists public.analytics_events (
  id              uuid          not null default gen_random_uuid(),
  ts              timestamptz   not null default now(),
  event_name      text          not null,
  -- Identity columns. anon_id is set from client cookie/storage; user_id is
  -- the canonical profiles.id once resolved via analytics_identity_map.
  anon_id         text,
  user_id         uuid,
  -- Source surface: 'web' | 'tg' | 'mobile' | 'server' | 'admin'.
  source          text          not null,
  -- Optional session grouping; client-rotated.
  session_id      text,
  -- Locale at time of event (bg/en/ru/ua) — for cohort splits.
  locale          text,
  -- Path/route at time of event (web/tg) or screen name (mobile).
  page            text,
  -- Free-form properties (event-specific payload).
  properties      jsonb         not null default '{}'::jsonb,
  -- Pre-extracted revenue in EUR cents, NULL for non-revenue events.
  revenue_eur_cents integer,
  -- IP/UA pulled server-side for /api/track entries; never trusted from client.
  ip_hash         text,
  user_agent      text,
  -- Created-at separate from `ts` so back-dated server reconciliations are auditable.
  inserted_at     timestamptz   not null default now(),
  primary key (id, ts)
) partition by range (ts);

comment on table public.analytics_events is
  'Append-only event log. Monthly partitions. Insert only via service-role /api/track or DB-internal triggers.';

-- Helpful indexes go on the parent so they cascade to new partitions.
create index if not exists analytics_events_ts_brin
  on public.analytics_events using brin (ts) with (pages_per_range = 32);
create index if not exists analytics_events_event_name_ts
  on public.analytics_events (event_name, ts desc);
create index if not exists analytics_events_user_id_ts
  on public.analytics_events (user_id, ts desc) where user_id is not null;
create index if not exists analytics_events_anon_id_ts
  on public.analytics_events (anon_id, ts desc) where anon_id is not null;
create index if not exists analytics_events_properties_gin
  on public.analytics_events using gin (properties jsonb_path_ops);

------------------------------------------------------------------------------
-- 2. Partition management
------------------------------------------------------------------------------

create or replace function public.ensure_analytics_partitions(months_ahead int default 6)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  m int;
  start_ts timestamptz;
  end_ts timestamptz;
  part_name text;
begin
  for m in 0..months_ahead loop
    start_ts := date_trunc('month', now()) + (m || ' months')::interval;
    end_ts   := start_ts + interval '1 month';
    part_name := format('analytics_events_%s', to_char(start_ts, 'YYYY_MM'));
    execute format(
      'create table if not exists public.%I partition of public.analytics_events for values from (%L) to (%L)',
      part_name, start_ts, end_ts
    );
  end loop;
end;
$$;

revoke all on function public.ensure_analytics_partitions(int) from public;
grant execute on function public.ensure_analytics_partitions(int) to service_role;

-- Bootstrap current + next 6 months.
select public.ensure_analytics_partitions(6);

------------------------------------------------------------------------------
-- 3. Identity stitching
------------------------------------------------------------------------------

create table if not exists public.analytics_identity_map (
  anon_id     text        not null,
  user_id     uuid        not null references public.profiles(id) on delete cascade,
  first_seen  timestamptz not null default now(),
  last_seen   timestamptz not null default now(),
  source      text        not null, -- 'web' | 'tg' | 'mobile'
  primary key (anon_id, user_id)
);

create index if not exists analytics_identity_map_user_id
  on public.analytics_identity_map (user_id);

comment on table public.analytics_identity_map is
  'Stitches anonymous client identifiers to authenticated profile UUIDs. Many-to-many: one user may have multiple anon_ids (devices), and one device may sign in as multiple users (rare).';

------------------------------------------------------------------------------
-- 4. AI insight cache + logs (90-day retention)
------------------------------------------------------------------------------

create table if not exists public.ai_insight_runs (
  id            uuid        primary key default gen_random_uuid(),
  ran_at        timestamptz not null default now(),
  trigger       text        not null,        -- 'cron-daily' | 'admin-chat' | 'tg-chat' | 'reactive'
  prompt        text        not null,
  -- Anthropic response_id + token usage so we can audit cost.
  response_id   text,
  input_tokens  int,
  output_tokens int,
  cost_usd_e6   bigint,                       -- micro-USD (6 decimals) to avoid float drift
  -- Final assistant message after tool-loop.
  answer        text,
  delete_after  timestamptz not null default (now() + interval '90 days')
);

create index if not exists ai_insight_runs_ran_at on public.ai_insight_runs (ran_at desc);
create index if not exists ai_insight_runs_delete_after on public.ai_insight_runs (delete_after);

create table if not exists public.ai_insight_logs (
  id            uuid        primary key default gen_random_uuid(),
  run_id        uuid        not null references public.ai_insight_runs(id) on delete cascade,
  step          int         not null,         -- 0-based ordinal in tool loop
  kind          text        not null,         -- 'tool_call' | 'tool_result' | 'message'
  tool_name     text,
  payload       jsonb       not null default '{}'::jsonb,
  inserted_at   timestamptz not null default now(),
  delete_after  timestamptz not null default (now() + interval '90 days')
);

create index if not exists ai_insight_logs_run_id_step on public.ai_insight_logs (run_id, step);
create index if not exists ai_insight_logs_delete_after on public.ai_insight_logs (delete_after);

create or replace function public.purge_ai_insight_history()
returns int
language sql
security definer
set search_path = public, pg_temp
as $$
  with d_logs as (
    delete from public.ai_insight_logs where delete_after < now() returning 1
  ),
  d_runs as (
    delete from public.ai_insight_runs where delete_after < now() returning 1
  )
  select (select count(*) from d_logs) + (select count(*) from d_runs);
$$;

revoke all on function public.purge_ai_insight_history() from public;
grant execute on function public.purge_ai_insight_history() to service_role;

------------------------------------------------------------------------------
-- 5. Revenue trigger: service_jobs.status -> 'completed' emits event
------------------------------------------------------------------------------
-- Only fires when transitioning INTO 'completed' (not on idempotent updates).

create or replace function public.tg_emit_revenue_on_complete()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_amount integer;
begin
  if (tg_op = 'UPDATE')
     and (new.status = 'completed')
     and (old.status is distinct from 'completed') then

    -- price_eur_cents is the column we store on service_jobs; coerce safely.
    v_amount := coalesce(new.price_eur_cents, 0);

    insert into public.analytics_events
      (ts, event_name, user_id, source, properties, revenue_eur_cents)
    values
      (now(),
       'revenue_recognized',
       new.client_id,
       'server',
       jsonb_build_object(
         'service_job_id', new.id,
         'installer_id',   new.installer_id,
         'kind',           coalesce(new.kind, 'unknown')
       ),
       v_amount);
  end if;
  return new;
end;
$$;

-- Drop+recreate to be safe; service_jobs lives in migration 018.
drop trigger if exists trg_emit_revenue_on_complete on public.service_jobs;
create trigger trg_emit_revenue_on_complete
  after update on public.service_jobs
  for each row
  execute function public.tg_emit_revenue_on_complete();

------------------------------------------------------------------------------
-- 6. Materialized views (refresh nightly via cron)
------------------------------------------------------------------------------

-- 6a. Daily KPI rollup — single source for "How are we doing?" dashboards.
create materialized view if not exists public.mv_daily_kpi as
select
  date_trunc('day', ts) as day,
  source,
  count(*)                                         filter (where event_name = 'page_view')                as page_views,
  count(distinct anon_id)                          filter (where event_name = 'page_view')                as visitors,
  count(*)                                         filter (where event_name = 'inquiry_submitted')        as inquiries,
  count(*)                                         filter (where event_name = 'phone_click')              as phone_clicks,
  count(*)                                         filter (where event_name = 'whatsapp_click')           as whatsapp_clicks,
  count(*)                                         filter (where event_name = 'viber_click')              as viber_clicks,
  count(*)                                         filter (where event_name = 'revenue_recognized')       as wins,
  coalesce(sum(revenue_eur_cents) filter (where event_name = 'revenue_recognized'), 0) as revenue_eur_cents
from public.analytics_events
where ts >= now() - interval '180 days'
group by 1, 2;

create unique index if not exists mv_daily_kpi_pk on public.mv_daily_kpi (day, source);

-- 6b. Inquiry → won funnel (per-source, last 90d).
create materialized view if not exists public.mv_funnel_inquiry_to_won as
with inquiries as (
  select properties->>'inquiry_id' as inquiry_id,
         min(ts) as inquiry_ts,
         coalesce(properties->>'source_page', source) as source_bucket
    from public.analytics_events
   where event_name = 'inquiry_submitted'
     and ts >= now() - interval '90 days'
   group by 1, 3
),
wins as (
  select properties->>'inquiry_id' as inquiry_id,
         min(ts) as won_ts,
         sum(revenue_eur_cents) as revenue
    from public.analytics_events
   where event_name = 'revenue_recognized'
     and properties ? 'inquiry_id'
   group by 1
)
select
  i.source_bucket,
  count(*)                                        as inquiries,
  count(w.inquiry_id)                             as wins,
  coalesce(sum(w.revenue), 0)                     as revenue_eur_cents,
  avg(extract(epoch from (w.won_ts - i.inquiry_ts))) filter (where w.inquiry_id is not null) as avg_cycle_seconds
from inquiries i
left join wins w on w.inquiry_id = i.inquiry_id
group by 1;

create unique index if not exists mv_funnel_inquiry_to_won_pk on public.mv_funnel_inquiry_to_won (source_bucket);

-- 6c. Top pages (last 30d) — by visitors + inquiry-to-visit ratio.
create materialized view if not exists public.mv_top_pages as
select
  page,
  count(*)                                         filter (where event_name = 'page_view')          as views,
  count(distinct anon_id)                          filter (where event_name = 'page_view')          as visitors,
  count(*)                                         filter (where event_name = 'inquiry_submitted')  as inquiries
from public.analytics_events
where ts >= now() - interval '30 days'
  and page is not null
group by 1
order by visitors desc nulls last;

create unique index if not exists mv_top_pages_pk on public.mv_top_pages (page);

-- 6d. Mobile install→complete funnel (last 90d).
create materialized view if not exists public.mv_funnel_mobile_install_to_complete as
select
  date_trunc('week', ts) as week,
  count(*) filter (where event_name = 'mobile_app_open')          as app_opens,
  count(*) filter (where event_name = 'mobile_login_success')     as logins,
  count(*) filter (where event_name = 'mobile_installation_created') as installations_created,
  count(*) filter (where event_name = 'mobile_installation_confirmed') as installations_confirmed,
  count(*) filter (where event_name = 'mobile_job_completed')     as jobs_completed
from public.analytics_events
where ts >= now() - interval '90 days'
  and source = 'mobile'
group by 1;

create unique index if not exists mv_funnel_mobile_install_to_complete_pk
  on public.mv_funnel_mobile_install_to_complete (week);

-- 6e. Revenue by acquisition source (last 90d).
create materialized view if not exists public.mv_revenue_by_source as
select
  coalesce(properties->>'utm_source', 'direct') as utm_source,
  coalesce(properties->>'utm_medium', '(none)') as utm_medium,
  count(*)                                       as wins,
  sum(revenue_eur_cents)                         as revenue_eur_cents
from public.analytics_events
where event_name = 'revenue_recognized'
  and ts >= now() - interval '90 days'
group by 1, 2;

create unique index if not exists mv_revenue_by_source_pk on public.mv_revenue_by_source (utm_source, utm_medium);

-- 6f. Session-level metrics (avg duration, bounce proxy).
create materialized view if not exists public.mv_session_metrics as
with bounds as (
  select session_id,
         source,
         min(ts) as started_at,
         max(ts) as ended_at,
         count(*) filter (where event_name = 'page_view') as page_views,
         max(case when event_name = 'inquiry_submitted' then 1 else 0 end) as had_inquiry
    from public.analytics_events
   where session_id is not null
     and ts >= now() - interval '30 days'
   group by 1, 2
)
select source,
       count(*)                                                            as sessions,
       avg(extract(epoch from (ended_at - started_at)))                    as avg_duration_seconds,
       avg(page_views)                                                     as avg_page_views,
       avg(had_inquiry)::numeric(6,4)                                      as inquiry_rate
  from bounds
 group by 1;

create unique index if not exists mv_session_metrics_pk on public.mv_session_metrics (source);

-- 6g. Per-user journey aggregate — feeds get_user_journey() tool.
create materialized view if not exists public.mv_user_journey as
select
  user_id,
  min(ts) as first_seen,
  max(ts) as last_seen,
  count(*) as event_count,
  count(*) filter (where event_name = 'inquiry_submitted') as inquiries,
  count(*) filter (where event_name = 'revenue_recognized') as wins,
  coalesce(sum(revenue_eur_cents) filter (where event_name = 'revenue_recognized'), 0) as revenue_eur_cents,
  array_agg(distinct source) as sources
from public.analytics_events
where user_id is not null
  and ts >= now() - interval '180 days'
group by 1;

create unique index if not exists mv_user_journey_pk on public.mv_user_journey (user_id);

------------------------------------------------------------------------------
-- 7. Refresh helper
------------------------------------------------------------------------------

create or replace function public.refresh_analytics_views()
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  refresh materialized view concurrently public.mv_daily_kpi;
  refresh materialized view concurrently public.mv_funnel_inquiry_to_won;
  refresh materialized view concurrently public.mv_top_pages;
  refresh materialized view concurrently public.mv_funnel_mobile_install_to_complete;
  refresh materialized view concurrently public.mv_revenue_by_source;
  refresh materialized view concurrently public.mv_session_metrics;
  refresh materialized view concurrently public.mv_user_journey;
end;
$$;

revoke all on function public.refresh_analytics_views() from public;
grant execute on function public.refresh_analytics_views() to service_role;

------------------------------------------------------------------------------
-- 8. RLS — events table is service-role-only at row level
------------------------------------------------------------------------------

alter table public.analytics_events        enable row level security;
alter table public.analytics_identity_map  enable row level security;
alter table public.ai_insight_runs         enable row level security;
alter table public.ai_insight_logs         enable row level security;

-- No policies = no row access for anon/authenticated. service_role bypasses RLS.
-- Admin reads happen via SECURITY DEFINER functions (see migration 024).

-- Strip default privileges so even direct table grants to authenticated/anon
-- don't accidentally leak data.
revoke all on public.analytics_events       from anon, authenticated;
revoke all on public.analytics_identity_map from anon, authenticated;
revoke all on public.ai_insight_runs        from anon, authenticated;
revoke all on public.ai_insight_logs        from anon, authenticated;
