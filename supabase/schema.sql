create extension if not exists "pgcrypto";

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'app_role'
  ) then
    create type public.app_role as enum ('member', 'admin');
  end if;
end;
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  role public.app_role not null default 'member',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = excluded.full_name;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

insert into public.profiles (id, email, full_name)
select
  users.id,
  users.email,
  coalesce(users.raw_user_meta_data ->> 'full_name', '')
from auth.users as users
on conflict (id) do update
set
  email = excluded.email,
  full_name = excluded.full_name;

create or replace function public.get_my_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select role from public.profiles where id = auth.uid()),
    'member'::public.app_role
  );
$$;

alter table public.profiles enable row level security;

drop policy if exists "Users can view accessible profiles" on public.profiles;
create policy "Users can view accessible profiles"
on public.profiles
for select
to authenticated
using (
  auth.uid() = id or public.get_my_role() = 'admin'
);

drop policy if exists "Users can update their own profile safely" on public.profiles;
create policy "Users can update their own profile safely"
on public.profiles
for update
to authenticated
using (
  auth.uid() = id
)
with check (
  auth.uid() = id
  and role = (
    select profiles.role
    from public.profiles
    where profiles.id = auth.uid()
  )
);

drop policy if exists "Admins can update any profile" on public.profiles;
create policy "Admins can update any profile"
on public.profiles
for update
to authenticated
using (
  public.get_my_role() = 'admin'
)
with check (
  public.get_my_role() = 'admin'
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  status text not null default 'draft' check (status in ('draft', 'active', 'archived')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists projects_user_id_idx on public.projects (user_id);
create index if not exists profiles_role_idx on public.profiles (role);

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
before update on public.projects
for each row
execute function public.set_updated_at();

alter table public.projects enable row level security;

drop policy if exists "Users can view projects they own" on public.projects;
create policy "Users can view projects they own"
on public.projects
for select
to authenticated
using (
  auth.uid() = user_id or public.get_my_role() = 'admin'
);

drop policy if exists "Users can create projects they own" on public.projects;
create policy "Users can create projects they own"
on public.projects
for insert
to authenticated
with check (
  auth.uid() = user_id or public.get_my_role() = 'admin'
);

drop policy if exists "Users can update projects they own" on public.projects;
create policy "Users can update projects they own"
on public.projects
for update
to authenticated
using (
  auth.uid() = user_id or public.get_my_role() = 'admin'
)
with check (
  auth.uid() = user_id or public.get_my_role() = 'admin'
);

drop policy if exists "Users can delete projects they own" on public.projects;
create policy "Users can delete projects they own"
on public.projects
for delete
to authenticated
using (
  auth.uid() = user_id or public.get_my_role() = 'admin'
);

do $$
begin
  alter publication supabase_realtime add table public.projects;
exception
  when duplicate_object then null;
end;
$$;
