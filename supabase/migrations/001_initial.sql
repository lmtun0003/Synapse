-- SYNAPSE initial schema (Supabase / Postgres)
-- Cosmetics-only economy. No gameplay pay-to-win columns.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text not null default 'Player',
  xp integer not null default 0,
  sparks integer not null default 100,
  prisms integer not null default 0,
  elo integer not null default 1000,
  rank text not null default 'Bronze',
  daily_streak integer not null default 0,
  country_code text,
  equipped_theme text not null default 'theme-midnight',
  equipped_board text not null default 'board-default',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.level_progress (
  id bigserial primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  puzzle_id text not null,
  best_rating text not null,
  best_moves integer not null,
  completions integer not null default 1,
  perfect boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (user_id, puzzle_id)
);

create table if not exists public.daily_results (
  id bigserial primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  day date not null,
  moves integer not null,
  elapsed_ms integer not null,
  rating text not null,
  created_at timestamptz not null default now(),
  unique (user_id, day)
);

create table if not exists public.ranked_matches (
  id uuid primary key default gen_random_uuid(),
  puzzle_seed bigint not null,
  player_a uuid not null references public.profiles(id),
  player_b uuid references public.profiles(id),
  score_a numeric,
  score_b numeric,
  elo_delta_a integer,
  elo_delta_b integer,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.community_puzzles (
  id uuid primary key default gen_random_uuid(),
  share_code text not null unique,
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  definition jsonb not null,
  rating_sum integer not null default 0,
  rating_count integer not null default 0,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.cosmetics_inventory (
  user_id uuid not null references public.profiles(id) on delete cascade,
  item_id text not null,
  acquired_at timestamptz not null default now(),
  primary key (user_id, item_id)
);

create index if not exists profiles_elo_idx on public.profiles (elo desc);
create index if not exists daily_results_day_moves_idx on public.daily_results (day, moves asc, elapsed_ms asc);
create index if not exists community_puzzles_featured_idx on public.community_puzzles (featured, created_at desc);

alter table public.profiles enable row level security;
alter table public.level_progress enable row level security;
alter table public.daily_results enable row level security;
alter table public.community_puzzles enable row level security;
alter table public.cosmetics_inventory enable row level security;

create policy "Public profiles are readable" on public.profiles for select using (true);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Users read own progress" on public.level_progress for select using (auth.uid() = user_id);
create policy "Users write own progress" on public.level_progress for insert with check (auth.uid() = user_id);
create policy "Users update own progress" on public.level_progress for update using (auth.uid() = user_id);

create policy "Daily results readable" on public.daily_results for select using (true);
create policy "Users write own daily" on public.daily_results for insert with check (auth.uid() = user_id);

create policy "Community puzzles readable" on public.community_puzzles for select using (true);
create policy "Authors publish puzzles" on public.community_puzzles for insert with check (auth.uid() = author_id);
