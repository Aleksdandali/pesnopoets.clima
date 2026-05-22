-- 026: Passwordless admin login via Telegram bot confirmation
--
-- Flow:
--   1. Visitor on /admin clicks "Войти через Telegram" → POST /api/admin/login/start
--      → server inserts a row here (status='pending'), sends owner an inline-button
--        message in Telegram, returns the code to the browser.
--   2. Browser polls /api/admin/login/poll?code=X every 2s.
--   3. Owner taps "✅ Разрешить" in TG → bot callback updates status='approved'.
--   4. Next poll sees approved → server signs an HttpOnly cookie JWT (90d),
--      browser is logged in.
--
-- Codes are short, single-use, 5-minute expiry. Table is service-role only.

create table if not exists public.admin_login_attempts (
  code         text primary key,
  status       text not null default 'pending'
                 check (status in ('pending','approved','denied','expired','consumed')),
  ip           text,
  user_agent   text,
  created_at   timestamptz not null default now(),
  expires_at   timestamptz not null,
  approved_at  timestamptz,
  approved_by  bigint,         -- telegram user id who tapped Approve
  message_id   bigint          -- TG message id, so we can edit it after decision
);

create index if not exists admin_login_attempts_status_expires_idx
  on public.admin_login_attempts (status, expires_at);

-- Tighten: never expose to anon / authenticated; service role only.
alter table public.admin_login_attempts enable row level security;
revoke all on public.admin_login_attempts from public, anon, authenticated;

comment on table public.admin_login_attempts is
  'Short-lived (5 min) login challenges for passwordless /admin auth via Telegram bot. Service role only.';
