-- PARO Studio database schema
--
-- Run this once against a fresh Supabase project to get a working local setup.
-- Supabase dashboard -> SQL Editor -> paste -> Run.
--
-- This creates structure only. It contains no data of any kind.
--
-- Some details below are marked INFERRED. They were reconstructed from
-- src/services/supabase/database.types.ts and the live RLS policies rather
-- than dumped from the database, so defaults and constraints may differ
-- slightly from production. They are correct enough to run the app.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

-- One row per user, created on first sign in. `id` matches auth.users.id.
create table if not exists public.profiles (
  id          uuid        primary key references auth.users (id) on delete cascade,
  username    text        unique,
  full_name   text,
  avatar_url  text,
  cover_url   text,
  bio         text,
  website     text,
  verified    boolean     not null default false,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create table if not exists public.prompts (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users (id) on delete cascade,
  title       text        not null,
  prompt      text        not null,
  image_url   text        not null,
  ai_tool     text        not null,
  tags        text[],
  view_count  integer     not null default 0,
  copy_count  integer     not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.likes (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references public.profiles (id) on delete cascade,
  prompt_id  uuid        not null references public.prompts (id) on delete cascade,
  created_at timestamptz not null default now(),
  -- INFERRED: stops one user liking the same prompt twice.
  unique (user_id, prompt_id)
);

create table if not exists public.saves (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references public.profiles (id) on delete cascade,
  prompt_id  uuid        not null references public.prompts (id) on delete cascade,
  created_at timestamptz not null default now(),
  -- INFERRED: stops one user saving the same prompt twice.
  unique (user_id, prompt_id)
);

create table if not exists public.follows (
  id           uuid        primary key default gen_random_uuid(),
  follower_id  uuid        not null references public.profiles (id) on delete cascade,
  following_id uuid        not null references public.profiles (id) on delete cascade,
  created_at   timestamptz not null default now(),
  -- INFERRED: stops duplicate follows and self-follows.
  unique (follower_id, following_id),
  check (follower_id <> following_id)
);

-- Feedback submitted from /feedback. Write only from the app. You read these
-- in the Supabase dashboard, which is why there is no select policy below.
create table if not exists public.feedback (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references auth.users (id) on delete cascade,
  subject    text        not null,
  message    text        not null,
  created_at timestamptz not null default now()
);

-- Accuracy ratings (1-5 stars) submitted by users for prompts.
create table if not exists public.prompt_ratings (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references public.profiles (id) on delete cascade,
  prompt_id  uuid        not null references public.prompts (id) on delete cascade,
  rating     smallint    not null check (rating >= 1 and rating <= 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- stops one user rating the same prompt twice.
  unique (user_id, prompt_id)
);

-- User reports submitted against prompts. Insert-only from the app; review in
-- the Supabase dashboard. The reason column is an enum-like text column
-- constrained to the values the UI surfaces.
create table if not exists public.prompt_reports (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references auth.users (id) on delete cascade,
  prompt_id  uuid        not null references public.prompts (id) on delete cascade,
  reason     text        not null check (reason in ('spam','misleading','inappropriate','copyright','other')),
  details    text,
  created_at timestamptz not null default now(),
  -- One report per user per prompt. If they already reported it, surface a
  -- friendly "already reported" message instead of a generic error.
  unique (user_id, prompt_id)
);

-- INFERRED indexes. The app filters on these columns constantly.
create index if not exists prompts_user_id_idx          on public.prompts (user_id);
create index if not exists prompts_created_at_idx       on public.prompts (created_at desc);
create index if not exists likes_prompt_id_idx          on public.likes (prompt_id);
create index if not exists saves_user_id_idx            on public.saves (user_id);
create index if not exists follows_following_idx        on public.follows (following_id);
create index if not exists prompt_ratings_prompt_id_idx on public.prompt_ratings (prompt_id);
create index if not exists prompt_reports_prompt_id_idx on public.prompt_reports (prompt_id);

-- ---------------------------------------------------------------------------
-- Functions
-- ---------------------------------------------------------------------------

-- View and copy counts are bumped by any viewer, not just the prompt owner.
-- The UPDATE policy on prompts only allows the owner to write, so these run
-- as security definer to bypass it. Without that, counters never increment.

create or replace function public.increment_view_count(prompt_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.prompts set view_count = view_count + 1 where id = prompt_id;
$$;

create or replace function public.increment_copy_count(prompt_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.prompts set copy_count = copy_count + 1 where id = prompt_id;
$$;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
--
-- RLS is the only thing protecting this data. The anon key is public and ships
-- in the client bundle, so any table without RLS is readable and writable by
-- anyone with a browser. Do not disable these.

alter table public.profiles       enable row level security;
alter table public.prompts        enable row level security;
alter table public.likes          enable row level security;
alter table public.saves          enable row level security;
alter table public.follows        enable row level security;
alter table public.feedback       enable row level security;
alter table public.prompt_ratings enable row level security;
alter table public.prompt_reports enable row level security;

-- profiles -------------------------------------------------------------------
-- Public read is deliberate: profiles are shown to signed-out visitors.
-- Never add a private column (email, phone) to this table.

create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- prompts --------------------------------------------------------------------

create policy "Public can read prompts"
  on public.prompts for select
  to anon, authenticated
  using (true);

create policy "Authenticated users can insert prompts"
  on public.prompts for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own prompts"
  on public.prompts for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own prompts"
  on public.prompts for delete
  to authenticated
  using (auth.uid() = user_id);

-- likes ----------------------------------------------------------------------

create policy "Public can read likes"
  on public.likes for select
  using (true);

create policy "Users can insert their own likes"
  on public.likes for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can delete their own likes"
  on public.likes for delete
  to authenticated
  using (auth.uid() = user_id);

-- saves ----------------------------------------------------------------------
-- Saves are private. A user must not see what anyone else has saved.

create policy "Users can view their own saves"
  on public.saves for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can save prompts"
  on public.saves for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can delete their own saves"
  on public.saves for delete
  to authenticated
  using (auth.uid() = user_id);

-- follows --------------------------------------------------------------------
-- Read must be public. Follower counts are shown on profiles to signed-out
-- visitors, and a count query only sees rows RLS lets through. Scoping this
-- to the two parties made every follower count read 0 on other people's
-- profiles.

create policy "Public can read follows"
  on public.follows for select
  using (true);

create policy "Users can follow others"
  on public.follows for insert
  to authenticated
  with check (auth.uid() = follower_id);

create policy "Users can unfollow others"
  on public.follows for delete
  to authenticated
  using (auth.uid() = follower_id);

-- feedback -------------------------------------------------------------------
-- Insert only, and only for yourself. There is deliberately no select policy,
-- so nobody can read feedback through the API, not even their own. Read it in
-- the dashboard instead. Adding a select policy here would expose every
-- submission to anyone holding the anon key, which is everyone.

create policy "Users can submit feedback"
  on public.feedback for insert
  to authenticated
  with check (auth.uid() = user_id);

-- prompt_ratings -------------------------------------------------------------
-- Anyone can read ratings, but users can only insert, update, or delete their own.

create policy "Public can read prompt ratings"
  on public.prompt_ratings for select
  using (true);

create policy "Users can rate prompts"
  on public.prompt_ratings for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own prompt ratings"
  on public.prompt_ratings for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own prompt ratings"
  on public.prompt_ratings for delete
  to authenticated
  using (auth.uid() = user_id);

-- prompt_reports -------------------------------------------------------------
-- Insert only, same philosophy as feedback: nobody can read reports through the
-- API. Review them in the Supabase dashboard.

create policy "Users can submit reports"
  on public.prompt_reports for insert
  to authenticated
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Storage
-- ---------------------------------------------------------------------------
--
-- All three buckets are public read. Files are laid out as {user_id}/{file},
-- and the policies use the first path segment to decide ownership.

insert into storage.buckets (id, name, public)
values
  ('avatars',       'avatars',       true),
  ('banners',       'banners',       true),
  ('prompt-images', 'prompt-images', true)
on conflict (id) do nothing;

-- avatars --------------------------------------------------------------------

create policy "Public read avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Users can upload own avatar"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (auth.uid())::text = (storage.foldername(name))[1]
  );

create policy "Users can update own avatar"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (auth.uid())::text = (storage.foldername(name))[1]
  );

create policy "Users can delete own avatar"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (auth.uid())::text = (storage.foldername(name))[1]
  );

-- banners --------------------------------------------------------------------

create policy "Public read banners"
  on storage.objects for select
  using (bucket_id = 'banners');

create policy "Users can upload own banner"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'banners'
    and (auth.uid())::text = (storage.foldername(name))[1]
  );

create policy "Users can update own banner"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'banners'
    and (auth.uid())::text = (storage.foldername(name))[1]
  );

create policy "Users can delete own banner"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'banners'
    and (auth.uid())::text = (storage.foldername(name))[1]
  );

-- prompt-images --------------------------------------------------------------
-- The folder check on insert matters. Without it any signed-in user can write
-- arbitrary files anywhere in the bucket, including into another user's folder.

create policy "Users can upload own prompt images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'prompt-images'
    and (storage.foldername(name))[1] = (auth.uid())::text
  );

create policy "Users can view own prompt images"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'prompt-images'
    and (storage.foldername(name))[1] = (auth.uid())::text
  );

create policy "Users can delete own prompt images"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'prompt-images'
    and (storage.foldername(name))[1] = (auth.uid())::text
  );

-- ---------------------------------------------------------------------------
-- After running this
-- ---------------------------------------------------------------------------
--
-- 1. Authentication -> Providers: enable Email. Enable Google if you want to
--    test Google sign in, otherwise email and password is enough.
-- 2. Settings -> API: copy the Project URL and the anon key into .env.local.
-- 3. npm run dev, create an account, and you should land on /complete-profile.
--
-- To set yourself as verified so the badge shows up:
--   update public.profiles set verified = true where username = 'your_username';
