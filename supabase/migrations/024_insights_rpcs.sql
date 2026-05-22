-- Migration 024: Insights RPCs
--
-- Read-only SECURITY DEFINER wrappers over the materialized views from
-- migration 023. The /api/insights agent calls these via the service-role
-- supabase client; admins never query analytics_events directly.
--
-- Why RPCs not raw SELECTs:
--   - analytics_events has RLS = service-role-only. Direct mat-view reads
--     still need explicit grants; centralising in functions keeps grants
--     tight and adds a single audit point.
--   - Each function clamps arguments (e.g. days_back <= 180) so a runaway
--     model cannot scan the world.
--   - Stable return shapes give the AI a predictable schema to reason over.

------------------------------------------------------------------------------
-- 1. get_daily_kpi(days_back)
------------------------------------------------------------------------------

create or replace function public.get_daily_kpi(p_days_back int default 30)
returns table (
  day              date,
  source           text,
  page_views       bigint,
  visitors         bigint,
  inquiries        bigint,
  phone_clicks     bigint,
  whatsapp_clicks  bigint,
  viber_clicks     bigint,
  wins             bigint,
  revenue_eur_cents bigint
)
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select
    day::date,
    source,
    page_views,
    visitors,
    inquiries,
    phone_clicks,
    whatsapp_clicks,
    viber_clicks,
    wins,
    revenue_eur_cents
  from public.mv_daily_kpi
  where day >= (now() - (least(greatest(p_days_back, 1), 180) || ' days')::interval)
  order by day desc, source;
$$;

------------------------------------------------------------------------------
-- 2. get_funnel_inquiry_to_won()
------------------------------------------------------------------------------

create or replace function public.get_funnel_inquiry_to_won()
returns table (
  source_bucket     text,
  inquiries         bigint,
  wins              bigint,
  revenue_eur_cents bigint,
  avg_cycle_seconds double precision
)
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select source_bucket, inquiries, wins, revenue_eur_cents, avg_cycle_seconds
  from public.mv_funnel_inquiry_to_won
  order by inquiries desc nulls last;
$$;

------------------------------------------------------------------------------
-- 3. get_top_pages(limit)
------------------------------------------------------------------------------

create or replace function public.get_top_pages(p_limit int default 20)
returns table (
  page       text,
  views      bigint,
  visitors   bigint,
  inquiries  bigint,
  conversion_rate numeric
)
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select
    page,
    views,
    visitors,
    inquiries,
    case when visitors > 0
         then round(inquiries::numeric / visitors::numeric, 4)
         else 0::numeric end as conversion_rate
  from public.mv_top_pages
  order by visitors desc nulls last
  limit least(greatest(p_limit, 1), 100);
$$;

------------------------------------------------------------------------------
-- 4. get_mobile_funnel(weeks_back)
------------------------------------------------------------------------------

create or replace function public.get_mobile_funnel(p_weeks_back int default 12)
returns table (
  week                     date,
  app_opens                bigint,
  logins                   bigint,
  installations_created    bigint,
  installations_confirmed  bigint,
  jobs_completed           bigint
)
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select
    week::date,
    app_opens,
    logins,
    installations_created,
    installations_confirmed,
    jobs_completed
  from public.mv_funnel_mobile_install_to_complete
  where week >= (now() - (least(greatest(p_weeks_back, 1), 26) || ' weeks')::interval)
  order by week desc;
$$;

------------------------------------------------------------------------------
-- 5. get_revenue_by_source()
------------------------------------------------------------------------------

create or replace function public.get_revenue_by_source()
returns table (
  utm_source        text,
  utm_medium        text,
  wins              bigint,
  revenue_eur_cents bigint
)
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select utm_source, utm_medium, wins, revenue_eur_cents
  from public.mv_revenue_by_source
  order by revenue_eur_cents desc nulls last;
$$;

------------------------------------------------------------------------------
-- 6. get_session_metrics()
------------------------------------------------------------------------------

create or replace function public.get_session_metrics()
returns table (
  source               text,
  sessions             bigint,
  avg_duration_seconds double precision,
  avg_page_views       double precision,
  inquiry_rate         numeric
)
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select source, sessions, avg_duration_seconds, avg_page_views, inquiry_rate
  from public.mv_session_metrics
  order by sessions desc;
$$;

------------------------------------------------------------------------------
-- 7. get_user_journey(user_id)
------------------------------------------------------------------------------

create or replace function public.get_user_journey(p_user_id uuid)
returns table (
  user_id           uuid,
  first_seen        timestamptz,
  last_seen         timestamptz,
  event_count       bigint,
  inquiries         bigint,
  wins              bigint,
  revenue_eur_cents bigint,
  sources           text[]
)
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select user_id, first_seen, last_seen, event_count, inquiries, wins, revenue_eur_cents, sources
  from public.mv_user_journey
  where user_id = p_user_id;
$$;

------------------------------------------------------------------------------
-- Grants - service_role only. Admin/TG admin reach these via service-key
-- supabase client in /api/insights.
------------------------------------------------------------------------------

revoke all on function public.get_daily_kpi(int) from public;
revoke all on function public.get_funnel_inquiry_to_won() from public;
revoke all on function public.get_top_pages(int) from public;
revoke all on function public.get_mobile_funnel(int) from public;
revoke all on function public.get_revenue_by_source() from public;
revoke all on function public.get_session_metrics() from public;
revoke all on function public.get_user_journey(uuid) from public;

grant execute on function public.get_daily_kpi(int)             to service_role;
grant execute on function public.get_funnel_inquiry_to_won()    to service_role;
grant execute on function public.get_top_pages(int)             to service_role;
grant execute on function public.get_mobile_funnel(int)         to service_role;
grant execute on function public.get_revenue_by_source()        to service_role;
grant execute on function public.get_session_metrics()          to service_role;
grant execute on function public.get_user_journey(uuid)         to service_role;
