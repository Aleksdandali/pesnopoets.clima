-- Banners for homepage grid
create table if not exists public.banners (
  id uuid primary key default gen_random_uuid(),
  title jsonb not null default '{}',       -- {bg, en, ru, ua}
  subtitle jsonb not null default '{}',     -- {bg, en, ru, ua}
  image_desktop text,                        -- Supabase Storage URL
  image_mobile text,                         -- Supabase Storage URL (optional)
  link text not null default '/',
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS: public read, no public write
alter table public.banners enable row level security;

create policy "banners_public_read" on public.banners
  for select using (is_active = true);

-- Index for ordering
create index banners_sort_idx on public.banners (sort_order asc) where is_active = true;
