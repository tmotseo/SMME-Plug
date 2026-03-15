-- Add auth_id column to registrations for linking to Supabase Auth users
alter table public.registrations add column if not exists auth_id uuid references auth.users(id) on delete set null;

-- Create index for faster lookups
create index if not exists registrations_auth_id_idx on public.registrations (auth_id);
create index if not exists registrations_email_idx on public.registrations (email);

-- Enable Row Level Security (RLS) for registrations
-- Note: Disable RLS if you want public read access, or configure policies accordingly
alter table public.registrations enable row level security;

-- Create RLS policies for registrations
-- Allow anyone to read registrations (for public directory)
drop policy if exists "Anyone can read registrations" on public.registrations;
create policy "Anyone can read registrations" on public.registrations for select using (status = 'approved');

-- Allow authenticated users to read their own registration
drop policy if exists "Users can read own registration" on public.registrations;
create policy "Users can read own registration" on public.registrations for select using (auth.uid() = auth_id);

-- Allow authenticated users to update their own registration
drop policy if exists "Users can update own registration" on public.registrations;
create policy "Users can update own registration" on public.registrations for update using (auth.uid() = auth_id);

-- Allow admins full access
drop policy if exists "Admins can do everything" on public.registrations;
create policy "Admins can do everything" on public.registrations for all using (
  exists (
    select 1 from public.admins 
    where admins.email = auth.jwt()->>'email' 
    and admins.is_active = true
  )
);
