-- Migration 025: Extra metadata for ai_insight_runs
--
-- Adds columns the chat backend wants to record per session: who asked
-- (operator), where they asked from (surface), which UI locale, how
-- long it took, and which tool names fired. Tools list is denormalised
-- from ai_insight_logs for quick "what's the model relying on?" admin
-- views without a per-row scan.

alter table public.ai_insight_runs
  add column if not exists surface     text,
  add column if not exists operator_id text,
  add column if not exists locale      text,
  add column if not exists tools_used  text[]    not null default '{}',
  add column if not exists elapsed_ms  integer;

create index if not exists ai_insight_runs_surface_ran_at
  on public.ai_insight_runs (surface, ran_at desc);
