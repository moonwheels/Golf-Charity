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

alter table public.profiles
  add column if not exists subscription_plan text not null default 'none',
  add column if not exists account_status text not null default 'active';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_subscription_plan_check'
  ) then
    alter table public.profiles
      add constraint profiles_subscription_plan_check
      check (subscription_plan in ('none', 'basic', 'premium'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_account_status_check'
  ) then
    alter table public.profiles
      add constraint profiles_account_status_check
      check (account_status in ('active', 'inactive'));
  end if;
end;
$$;

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

create or replace function public.admin_delete_user(target_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.get_my_role() <> 'admin' then
    raise exception 'Only admins can delete users.';
  end if;

  if target_user_id = auth.uid() then
    raise exception 'Admins cannot delete their own account from the portal.';
  end if;

  delete from auth.users
  where id = target_user_id;
end;
$$;

grant execute on function public.admin_delete_user(uuid) to authenticated;

create or replace function public.admin_update_user_profile(
  target_user_id uuid,
  next_email text,
  next_full_name text,
  next_account_status text,
  next_subscription_plan text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.get_my_role() <> 'admin' then
    raise exception 'Only admins can update users.';
  end if;

  if next_account_status not in ('active', 'inactive') then
    raise exception 'Invalid account status.';
  end if;

  if next_subscription_plan not in ('none', 'basic', 'premium') then
    raise exception 'Invalid subscription plan.';
  end if;

  update auth.users
  set
    email = next_email,
    raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object(
      'full_name',
      next_full_name
    )
  where id = target_user_id;

  update public.profiles
  set
    email = next_email,
    full_name = nullif(next_full_name, ''),
    account_status = next_account_status,
    subscription_plan = next_subscription_plan
  where id = target_user_id;
end;
$$;

grant execute on function public.admin_update_user_profile(uuid, text, text, text, text) to authenticated;

create table if not exists public.charities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  total_allocated numeric(12, 2) not null default 0,
  featured boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists charities_active_idx on public.charities (active);

drop trigger if exists set_charities_updated_at on public.charities;
create trigger set_charities_updated_at
before update on public.charities
for each row
execute function public.set_updated_at();

alter table public.charities enable row level security;

drop policy if exists "Admins can manage charities" on public.charities;
create policy "Admins can manage charities"
on public.charities
for all
to authenticated
using (public.get_my_role() = 'admin')
with check (public.get_my_role() = 'admin');

create table if not exists public.draw_configurations (
  id text primary key default 'primary',
  draw_date date not null default current_date,
  prize_pool numeric(12, 2) not null default 25000,
  algorithm text not null default 'standard' check (algorithm in ('standard', 'weighted')),
  last_simulation_summary text,
  last_simulated_at timestamptz,
  results_published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

insert into public.draw_configurations (id)
values ('primary')
on conflict (id) do nothing;

drop trigger if exists set_draw_configurations_updated_at on public.draw_configurations;
create trigger set_draw_configurations_updated_at
before update on public.draw_configurations
for each row
execute function public.set_updated_at();

alter table public.draw_configurations enable row level security;

drop policy if exists "Admins can manage draw configurations" on public.draw_configurations;
create policy "Admins can manage draw configurations"
on public.draw_configurations
for all
to authenticated
using (public.get_my_role() = 'admin')
with check (public.get_my_role() = 'admin');

create table if not exists public.winner_claims (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  prize text not null,
  tier text not null,
  proof_status text not null default 'pending' check (proof_status in ('pending', 'approved')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid')),
  scorecard text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists winner_claims_profile_id_idx on public.winner_claims (profile_id);

drop trigger if exists set_winner_claims_updated_at on public.winner_claims;
create trigger set_winner_claims_updated_at
before update on public.winner_claims
for each row
execute function public.set_updated_at();

alter table public.winner_claims enable row level security;

drop policy if exists "Admins can manage winner claims" on public.winner_claims;
create policy "Admins can manage winner claims"
on public.winner_claims
for all
to authenticated
using (public.get_my_role() = 'admin')
with check (public.get_my_role() = 'admin');

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

do $$
begin
  alter publication supabase_realtime add table public.profiles;
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  alter publication supabase_realtime add table public.charities;
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  alter publication supabase_realtime add table public.draw_configurations;
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  alter publication supabase_realtime add table public.winner_claims;
exception
  when duplicate_object then null;
end;
$$;
