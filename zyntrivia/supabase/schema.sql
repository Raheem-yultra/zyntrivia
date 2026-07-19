-- Leads table for the quote form and calculator capture.
-- Run in the Supabase SQL editor before setting SUPABASE_URL /
-- SUPABASE_SERVICE_ROLE_KEY. The API inserts via the service role, so RLS
-- stays enabled with no public policies.

create table if not exists public.leads (
  id            uuid primary key default gen_random_uuid(),
  source        text not null check (source in ('quote', 'calculator', 'contact')),
  services      text[] not null default '{}',
  problem       text,
  timeline      text,
  company_size  text,
  current_state text,
  name          text not null,
  email         text not null,
  company       text,
  country       text,
  website       text,
  wants_call    boolean not null default false,
  calculator    jsonb,
  utm           jsonb,
  status        text not null default 'new' check (status in ('new', 'quoted', 'won', 'lost')),
  created_at    timestamptz not null default now()
);

create index if not exists leads_created_status_idx on public.leads (created_at, status);

alter table public.leads enable row level security;
