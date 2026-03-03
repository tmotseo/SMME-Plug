create extension if not exists "pgcrypto";

create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  display_name text not null default '',
  passcode text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('smmes', 'professionals', 'jobseekers')),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  display_name text not null,
  email text not null default '',
  phone text not null default '',
  profile_json jsonb not null default '{}'::jsonb,
  admin_note text not null default '',
  messages_json jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  approved_at timestamptz,
  rejected_at timestamptz
);

create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  audience text not null default 'all' check (audience in ('all', 'smmes', 'professionals', 'jobseekers')),
  organization text not null default '',
  location text not null default '',
  deadline text not null default '',
  link text not null default '',
  details text not null default '',
  created_by uuid references public.admins(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists registrations_type_idx on public.registrations (type);
create index if not exists registrations_status_idx on public.registrations (status);
create index if not exists registrations_created_idx on public.registrations (created_at desc);
create index if not exists opportunities_audience_idx on public.opportunities (audience);
create index if not exists opportunities_created_idx on public.opportunities (created_at desc);

insert into public.admins (email, display_name, passcode, is_active)
values ('admin@smmesplug.local', 'Default Admin', 'admin123', true)
on conflict (email) do nothing;

alter table public.admins disable row level security;
alter table public.registrations disable row level security;
alter table public.opportunities disable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'registrations'
  ) then
    alter publication supabase_realtime add table public.registrations;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'opportunities'
  ) then
    alter publication supabase_realtime add table public.opportunities;
  end if;
end $$;
