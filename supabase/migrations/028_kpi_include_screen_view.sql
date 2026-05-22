-- 028: Widen analytics views to count both 'page_view' (web) and 'screen_view'
-- (TG Mini App). Without this fix, dashboards under-report /tg traffic by ~100%.
--
-- We drop + recreate three materialized views: mv_daily_kpi, mv_top_pages,
-- mv_session_metrics. All RPCs in migration 024 read from these views.

drop materialized view if exists public.mv_daily_kpi;
create materialized view public.mv_daily_kpi as
select
  date_trunc('day', ts) as day,
  source,
  count(*)                        filter (where event_name in ('page_view','screen_view'))   as page_views,
  count(distinct anon_id)         filter (where event_name in ('page_view','screen_view'))   as visitors,
  count(*)                        filter (where event_name = 'inquiry_submitted')            as inquiries,
  count(*)                        filter (where event_name = 'phone_click')                  as phone_clicks,
  count(*)                        filter (where event_name = 'whatsapp_click')               as whatsapp_clicks,
  count(*)                        filter (where event_name = 'viber_click')                  as viber_clicks,
  count(*)                        filter (where event_name = 'revenue_recognized')           as wins,
  coalesce(sum(revenue_eur_cents) filter (where event_name = 'revenue_recognized'), 0)       as revenue_eur_cents
from public.analytics_events
where ts >= now() - interval '180 days'
group by 1, 2;
create unique index if not exists mv_daily_kpi_pk on public.mv_daily_kpi (day, source);

drop materialized view if exists public.mv_top_pages;
create materialized view public.mv_top_pages as
select
  page,
  count(*)                filter (where event_name in ('page_view','screen_view'))  as views,
  count(distinct anon_id) filter (where event_name in ('page_view','screen_view'))  as visitors,
  count(*)                filter (where event_name = 'inquiry_submitted')           as inquiries
from public.analytics_events
where ts >= now() - interval '30 days'
  and page is not null
group by 1
order by visitors desc nulls last;
create unique index if not exists mv_top_pages_pk on public.mv_top_pages (page);

drop materialized view if exists public.mv_session_metrics;
create materialized view public.mv_session_metrics as
with bounds as (
  select session_id,
         source,
         min(ts) as started_at,
         max(ts) as ended_at,
         count(*) filter (where event_name in ('page_view','screen_view')) as page_views,
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

-- Initial refresh so dashboards reflect the change immediately.
refresh materialized view public.mv_daily_kpi;
refresh materialized view public.mv_top_pages;
refresh materialized view public.mv_session_metrics;
