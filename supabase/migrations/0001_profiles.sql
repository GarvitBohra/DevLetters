-- DevLetters: profiles table + security rules.
-- Run in Supabase: SQL Editor -> New query -> paste -> Run. Safe to run more than once.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  handle text unique not null
    check (handle ~ '^[a-z0-9_]{3,30}$'),
  display_name text not null default '' check (char_length(display_name) <= 60),
  bio text not null default '' check (char_length(bio) <= 300),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Anyone can read profiles (they are public author pages).
drop policy if exists "Profiles are public" on public.profiles;
create policy "Profiles are public"
  on public.profiles for select
  using (true);

-- A user can only create/update/delete their own profile.
drop policy if exists "Users insert own profile" on public.profiles;
create policy "Users insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Users delete own profile" on public.profiles;
create policy "Users delete own profile"
  on public.profiles for delete
  using (auth.uid() = id);

-- Create a profile automatically when someone signs up.
-- The handle comes from sign-up metadata, with a safe fallback.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  wanted text := lower(coalesce(new.raw_user_meta_data ->> 'handle', ''));
  final_handle text;
begin
  if wanted ~ '^[a-z0-9_]{3,30}$' and not exists (select 1 from public.profiles where handle = wanted) then
    final_handle := wanted;
  else
    final_handle := 'user_' || substr(replace(new.id::text, '-', ''), 1, 10);
  end if;

  insert into public.profiles (id, handle, display_name)
  values (new.id, final_handle, coalesce(new.raw_user_meta_data ->> 'display_name', ''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Access grants. Row Level Security (above) still limits what each user can do.
-- Newer Supabase projects do not grant these automatically.
grant usage on schema public to anon, authenticated;
grant select on public.profiles to anon, authenticated;
grant insert, update, delete on public.profiles to authenticated;
