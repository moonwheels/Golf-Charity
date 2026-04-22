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

create or replace function public.smallint_array_length(
  arr smallint[],
  expected_length integer
)
returns boolean
language sql
immutable
as $$
  select coalesce(array_length(arr, 1), 0) = expected_length;
$$;

create or replace function public.smallint_array_values_between(
  arr smallint[],
  min_value integer,
  max_value integer
)
returns boolean
language sql
immutable
as $$
  select not exists (
    select 1
    from unnest(coalesce(arr, '{}'::smallint[])) as value
    where value < min_value or value > max_value
  );
$$;

create or replace function public.smallint_array_is_unique(arr smallint[])
returns boolean
language sql
immutable
as $$
  select coalesce(array_length(arr, 1), 0) = (
    select count(distinct value)
    from unnest(coalesce(arr, '{}'::smallint[])) as value
  );
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
  add column if not exists account_status text not null default 'inactive';

alter table public.profiles
  alter column subscription_plan set default 'none',
  alter column account_status set default 'inactive';

update public.profiles
set account_status = 'inactive'
where subscription_plan = 'none'
  and account_status <> 'inactive';

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

  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_subscription_state_check'
  ) then
    alter table public.profiles
      add constraint profiles_subscription_state_check
      check (
        (subscription_plan = 'none' and account_status = 'inactive')
        or subscription_plan in ('basic', 'premium')
      );
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
    (select role::public.app_role from public.profiles where id = auth.uid()),
    'member'::public.app_role
  );
$$;

create or replace function public.guard_member_profile_updates()
returns trigger
language plpgsql
as $$
begin
  if auth.uid() is null then
    return new;
  end if;

  if public.get_my_role() = 'admin' then
    return new;
  end if;

  if new.id <> auth.uid() then
    raise exception 'Members can only update their own profile.';
  end if;

  if new.role <> old.role then
    raise exception 'Members cannot edit their role.';
  end if;

  if new.subscription_plan <> old.subscription_plan then
    raise exception 'Members cannot edit subscription plan fields directly.';
  end if;

  if new.account_status <> old.account_status then
    raise exception 'Members cannot edit account status fields directly.';
  end if;

  return new;
end;
$$;

drop trigger if exists guard_member_profile_updates on public.profiles;
create trigger guard_member_profile_updates
before update on public.profiles
for each row
execute function public.guard_member_profile_updates();

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

  if next_subscription_plan = 'none' and next_account_status <> 'inactive' then
    raise exception 'Users without a subscription must be inactive.';
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

drop policy if exists "Anyone can view active charities" on public.charities;
create policy "Anyone can view active charities"
on public.charities
for select
to anon, authenticated
using (
  active = true or public.get_my_role() = 'admin'
);

drop policy if exists "Admins can manage charities" on public.charities;
create policy "Admins can manage charities"
on public.charities
for all
to authenticated
using (public.get_my_role() = 'admin')
with check (public.get_my_role() = 'admin');

create table if not exists public.member_charity_preferences (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  charity_id uuid not null references public.charities(id) on delete restrict,
  contribution_percentage numeric(5, 2) not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint member_charity_preferences_percentage_check
    check (contribution_percentage >= 10 and contribution_percentage <= 100)
);

create index if not exists member_charity_preferences_charity_idx
  on public.member_charity_preferences (charity_id);

drop trigger if exists set_member_charity_preferences_updated_at on public.member_charity_preferences;
create trigger set_member_charity_preferences_updated_at
before update on public.member_charity_preferences
for each row
execute function public.set_updated_at();

alter table public.member_charity_preferences enable row level security;

drop policy if exists "Members can view their charity preference" on public.member_charity_preferences;
create policy "Members can view their charity preference"
on public.member_charity_preferences
for select
to authenticated
using (
  auth.uid() = profile_id or public.get_my_role() = 'admin'
);

drop policy if exists "Members can insert their charity preference" on public.member_charity_preferences;
create policy "Members can insert their charity preference"
on public.member_charity_preferences
for insert
to authenticated
with check (
  auth.uid() = profile_id or public.get_my_role() = 'admin'
);

drop policy if exists "Members can update their charity preference" on public.member_charity_preferences;
create policy "Members can update their charity preference"
on public.member_charity_preferences
for update
to authenticated
using (
  auth.uid() = profile_id or public.get_my_role() = 'admin'
)
with check (
  auth.uid() = profile_id or public.get_my_role() = 'admin'
);

drop policy if exists "Admins can manage member charity preferences" on public.member_charity_preferences;
create policy "Admins can manage member charity preferences"
on public.member_charity_preferences
for all
to authenticated
using (public.get_my_role() = 'admin')
with check (public.get_my_role() = 'admin');

create table if not exists public.scores (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  score integer not null,
  played_on date not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint scores_score_range_check check (score between 1 and 45)
);

create index if not exists scores_profile_played_on_idx
  on public.scores (profile_id, played_on desc, created_at desc);

drop trigger if exists set_scores_updated_at on public.scores;
create trigger set_scores_updated_at
before update on public.scores
for each row
execute function public.set_updated_at();

create or replace function public.enforce_score_limit()
returns trigger
language plpgsql
as $$
begin
  delete from public.scores
  where id in (
    select score_row.id
    from public.scores as score_row
    where score_row.profile_id = new.profile_id
    order by score_row.played_on desc, score_row.created_at desc, score_row.id desc
    offset 5
  );

  return null;
end;
$$;

drop trigger if exists enforce_score_limit_on_scores on public.scores;
create trigger enforce_score_limit_on_scores
after insert or update on public.scores
for each row
execute function public.enforce_score_limit();

alter table public.scores enable row level security;

drop policy if exists "Members can view their own scores" on public.scores;
create policy "Members can view their own scores"
on public.scores
for select
to authenticated
using (
  auth.uid() = profile_id or public.get_my_role() = 'admin'
);

drop policy if exists "Members can insert their own scores" on public.scores;
create policy "Members can insert their own scores"
on public.scores
for insert
to authenticated
with check (
  auth.uid() = profile_id or public.get_my_role() = 'admin'
);

drop policy if exists "Members can update their own scores" on public.scores;
create policy "Members can update their own scores"
on public.scores
for update
to authenticated
using (
  auth.uid() = profile_id or public.get_my_role() = 'admin'
)
with check (
  auth.uid() = profile_id or public.get_my_role() = 'admin'
);

drop policy if exists "Members can delete their own scores" on public.scores;
create policy "Members can delete their own scores"
on public.scores
for delete
to authenticated
using (
  auth.uid() = profile_id or public.get_my_role() = 'admin'
);

create table if not exists public.draw_periods (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  period_start date not null,
  period_end date not null,
  draw_date date not null,
  status text not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint draw_periods_status_check check (status in ('draft', 'open', 'closed', 'drawn')),
  constraint draw_periods_date_order_check check (
    period_start <= period_end and period_end <= draw_date
  )
);

create index if not exists draw_periods_status_idx
  on public.draw_periods (status, draw_date desc);

drop trigger if exists set_draw_periods_updated_at on public.draw_periods;
create trigger set_draw_periods_updated_at
before update on public.draw_periods
for each row
execute function public.set_updated_at();

alter table public.draw_periods enable row level security;

drop policy if exists "Anyone can view live draw periods" on public.draw_periods;
create policy "Anyone can view live draw periods"
on public.draw_periods
for select
to anon, authenticated
using (
  status <> 'draft' or public.get_my_role() = 'admin'
);

drop policy if exists "Admins can manage draw periods" on public.draw_periods;
create policy "Admins can manage draw periods"
on public.draw_periods
for all
to authenticated
using (public.get_my_role() = 'admin')
with check (public.get_my_role() = 'admin');

create table if not exists public.draw_entries (
  id uuid primary key default gen_random_uuid(),
  draw_period_id uuid not null references public.draw_periods(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  entry_scores smallint[] not null,
  entry_score_dates date[] not null,
  match_count integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint draw_entries_unique_member_entry unique (draw_period_id, profile_id),
  constraint draw_entries_score_count_check
    check (coalesce(array_length(entry_scores, 1), 0) between 1 and 5),
  constraint draw_entries_score_date_count_check
    check (coalesce(array_length(entry_score_dates, 1), 0) = coalesce(array_length(entry_scores, 1), 0)),
  constraint draw_entries_score_range_check
    check (public.smallint_array_values_between(entry_scores, 1, 45)),
  constraint draw_entries_match_count_check
    check (match_count between 0 and 5)
);

create index if not exists draw_entries_profile_idx
  on public.draw_entries (profile_id, draw_period_id);

drop trigger if exists set_draw_entries_updated_at on public.draw_entries;
create trigger set_draw_entries_updated_at
before update on public.draw_entries
for each row
execute function public.set_updated_at();

alter table public.draw_entries enable row level security;

drop policy if exists "Members can view their draw entries" on public.draw_entries;
create policy "Members can view their draw entries"
on public.draw_entries
for select
to authenticated
using (
  auth.uid() = profile_id or public.get_my_role() = 'admin'
);

drop policy if exists "Admins can manage draw entries" on public.draw_entries;
create policy "Admins can manage draw entries"
on public.draw_entries
for all
to authenticated
using (public.get_my_role() = 'admin')
with check (public.get_my_role() = 'admin');

create table if not exists public.draw_results (
  id uuid primary key default gen_random_uuid(),
  draw_period_id uuid not null unique references public.draw_periods(id) on delete cascade,
  generated_by uuid references public.profiles(id) on delete set null,
  algorithm text not null default 'random',
  winning_scores smallint[] not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  published_at timestamptz,
  constraint draw_results_algorithm_check check (algorithm in ('random', 'weighted')),
  constraint draw_results_score_count_check
    check (public.smallint_array_length(winning_scores, 5)),
  constraint draw_results_score_range_check
    check (public.smallint_array_values_between(winning_scores, 1, 45)),
  constraint draw_results_unique_scores_check
    check (public.smallint_array_is_unique(winning_scores))
);

drop trigger if exists set_draw_results_updated_at on public.draw_results;
create trigger set_draw_results_updated_at
before update on public.draw_results
for each row
execute function public.set_updated_at();

alter table public.draw_results enable row level security;

drop policy if exists "Anyone can view published draw results" on public.draw_results;
create policy "Anyone can view published draw results"
on public.draw_results
for select
to anon, authenticated
using (
  published_at is not null or public.get_my_role() = 'admin'
);

drop policy if exists "Admins can manage draw results" on public.draw_results;
create policy "Admins can manage draw results"
on public.draw_results
for all
to authenticated
using (public.get_my_role() = 'admin')
with check (public.get_my_role() = 'admin');

create table if not exists public.winnings (
  id uuid primary key default gen_random_uuid(),
  draw_period_id uuid not null references public.draw_periods(id) on delete cascade,
  draw_result_id uuid not null references public.draw_results(id) on delete cascade,
  draw_entry_id uuid not null unique references public.draw_entries(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  tier text not null,
  prize_name text not null,
  prize_amount numeric(12, 2) not null default 0,
  match_count integer not null,
  status text not null default 'pending',
  payout_reference text,
  approved_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint winnings_unique_member_per_draw unique (draw_period_id, profile_id),
  constraint winnings_match_count_check check (match_count between 0 and 5),
  constraint winnings_amount_check check (prize_amount >= 0),
  constraint winnings_status_check check (status in ('pending', 'approved', 'paid')),
  constraint winnings_status_timestamp_check check (
    (approved_at is null or status in ('approved', 'paid'))
    and (paid_at is null or status = 'paid')
  ),
  constraint winnings_id_profile_unique unique (id, profile_id)
);

create index if not exists winnings_profile_idx
  on public.winnings (profile_id, created_at desc);

drop trigger if exists set_winnings_updated_at on public.winnings;
create trigger set_winnings_updated_at
before update on public.winnings
for each row
execute function public.set_updated_at();

alter table public.winnings enable row level security;

drop policy if exists "Members can view their winnings" on public.winnings;
create policy "Members can view their winnings"
on public.winnings
for select
to authenticated
using (
  auth.uid() = profile_id or public.get_my_role() = 'admin'
);

drop policy if exists "Admins can manage winnings" on public.winnings;
create policy "Admins can manage winnings"
on public.winnings
for all
to authenticated
using (public.get_my_role() = 'admin')
with check (public.get_my_role() = 'admin');

create table if not exists public.winner_proof_submissions (
  id uuid primary key default gen_random_uuid(),
  winning_id uuid not null,
  profile_id uuid not null,
  proof_text text,
  proof_url text,
  review_notes text,
  submitted_at timestamptz not null default timezone('utc', now()),
  reviewed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint winner_proof_submissions_unique_winning unique (winning_id),
  constraint winner_proof_submissions_content_check check (
    nullif(btrim(coalesce(proof_text, '')), '') is not null
    or nullif(btrim(coalesce(proof_url, '')), '') is not null
  ),
  constraint winner_proof_submissions_winning_fkey
    foreign key (winning_id, profile_id)
    references public.winnings(id, profile_id)
    on delete cascade
);

create index if not exists winner_proof_submissions_profile_idx
  on public.winner_proof_submissions (profile_id, submitted_at desc);

drop trigger if exists set_winner_proof_submissions_updated_at on public.winner_proof_submissions;
create trigger set_winner_proof_submissions_updated_at
before update on public.winner_proof_submissions
for each row
execute function public.set_updated_at();

alter table public.winner_proof_submissions enable row level security;

drop policy if exists "Members can view their proof submissions" on public.winner_proof_submissions;
create policy "Members can view their proof submissions"
on public.winner_proof_submissions
for select
to authenticated
using (
  exists (
    select 1
    from public.winnings
    where winnings.id = winner_proof_submissions.winning_id
      and winnings.profile_id = auth.uid()
  )
  or public.get_my_role() = 'admin'
);

drop policy if exists "Members can submit proof for pending winnings" on public.winner_proof_submissions;
create policy "Members can submit proof for pending winnings"
on public.winner_proof_submissions
for insert
to authenticated
with check (
  auth.uid() = profile_id
  and exists (
    select 1
    from public.winnings
    where winnings.id = winner_proof_submissions.winning_id
      and winnings.profile_id = auth.uid()
      and winnings.status = 'pending'
  )
);

drop policy if exists "Members can update proof for pending winnings" on public.winner_proof_submissions;
create policy "Members can update proof for pending winnings"
on public.winner_proof_submissions
for update
to authenticated
using (
  exists (
    select 1
    from public.winnings
    where winnings.id = winner_proof_submissions.winning_id
      and winnings.profile_id = auth.uid()
      and winnings.status = 'pending'
  )
  or public.get_my_role() = 'admin'
)
with check (
  (
    auth.uid() = profile_id
    and exists (
      select 1
      from public.winnings
      where winnings.id = winner_proof_submissions.winning_id
        and winnings.profile_id = auth.uid()
        and winnings.status = 'pending'
    )
  )
  or public.get_my_role() = 'admin'
);

drop policy if exists "Admins can manage proof submissions" on public.winner_proof_submissions;
create policy "Admins can manage proof submissions"
on public.winner_proof_submissions
for all
to authenticated
using (public.get_my_role() = 'admin')
with check (public.get_my_role() = 'admin');

-- Legacy compatibility tables retained temporarily while the frontend migrates.

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
  alter publication supabase_realtime add table public.member_charity_preferences;
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  alter publication supabase_realtime add table public.scores;
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  alter publication supabase_realtime add table public.draw_periods;
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  alter publication supabase_realtime add table public.draw_entries;
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  alter publication supabase_realtime add table public.draw_results;
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  alter publication supabase_realtime add table public.winnings;
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  alter publication supabase_realtime add table public.winner_proof_submissions;
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
