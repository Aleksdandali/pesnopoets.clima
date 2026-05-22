-- 027: Employee onboarding via Telegram bot
--
-- New flow:
--   1. New person opens the bot and sends /start
--   2. Bot asks Фамилия → Имя → Должность (3-step conversation)
--   3. Row is inserted into telegram_team_members with status='pending'
--   4. Owner gets a Telegram card with ✅ Принять / ❌ Отклонить
--   5. On approve: status='approved', is_active=true → member can use the bot
--      and the /tg admin Mini App. On reject: status='rejected'.
--   6. Owner manages roster from /admin/team.

-- a) Extend existing telegram_team_members table.
alter table public.telegram_team_members
  add column if not exists first_name   text,
  add column if not exists last_name    text,
  add column if not exists position     text,
  add column if not exists status       text not null default 'approved'
    check (status in ('pending','approved','rejected')),
  add column if not exists requested_at timestamptz default now(),
  add column if not exists decided_at   timestamptz,
  add column if not exists decided_by   bigint;

-- Existing rows pre-date onboarding — they are already members → 'approved'.
update public.telegram_team_members set status = 'approved' where status is null;

create index if not exists tg_team_status_idx
  on public.telegram_team_members (status);

-- b) Per-user conversation state (only one in-flight onboarding per TG user).
create table if not exists public.telegram_onboarding_state (
  telegram_user_id   bigint primary key,
  telegram_username  text,
  step               text not null check (step in ('first_name','last_name','position')),
  data               jsonb not null default '{}',
  updated_at         timestamptz not null default now()
);

alter table public.telegram_onboarding_state enable row level security;
revoke all on public.telegram_onboarding_state from public, anon, authenticated;

comment on table public.telegram_onboarding_state is
  'Ephemeral state for the 3-step Telegram onboarding chat. Deleted after submit. Service role only.';
