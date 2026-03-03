alter table public.admins
  alter column passcode drop not null;

alter table public.admins
  add column if not exists auth_user_id uuid unique;

comment on column public.admins.auth_user_id is 'Optional link to auth.users.id for Supabase Auth based admin sign-in.';
