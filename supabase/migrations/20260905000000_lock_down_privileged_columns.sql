-- Lock down privileged columns and storage buckets.
--
-- Fixes three issues where the client, holding only the public anon key, could
-- write things the app never intended it to write.
--
--   1. profiles.verified          a user could grant themselves a verified badge
--   2. prompts.view_count         a user could inflate their own trending rank
--      prompts.copy_count
--   3. storage buckets            no server side size or MIME limit, so the
--                                 JS checks in services/supabase/storage.ts
--                                 could be skipped entirely
--
-- Safe to run more than once.
--
-- Why this is written as revoke-then-grant rather than a column level revoke:
-- Supabase grants `anon` and `authenticated` table level INSERT and UPDATE on
-- everything in `public` by default. Postgres will not let a column level
-- revoke punch a hole in a table level grant. From the REVOKE docs: "if a role
-- has been granted privileges on a table, then revoking the same privileges
-- from individual columns will have no effect." It does not error, it silently
-- does nothing. The only way to restrict columns is to drop the table level
-- grant and re-grant column by column, which is what happens below.

-- ---------------------------------------------------------------------------
-- profiles.verified
-- ---------------------------------------------------------------------------
--
-- `verified` is now writable only by the service role and by anything running
-- as the table owner. Set a badge from the dashboard:
--   update public.profiles set verified = true where username = 'someone';

revoke insert, update on public.profiles from anon, authenticated;

grant insert (id, username, full_name, avatar_url, cover_url, bio, website,
              created_at, updated_at)
  on public.profiles to anon, authenticated;

-- `id` is deliberately absent. It is the primary key, it references
-- auth.users, and every profiles RLS policy keys off it.
grant update (username, full_name, avatar_url, cover_url, bio, website,
              updated_at)
  on public.profiles to anon, authenticated;

-- ---------------------------------------------------------------------------
-- prompts.view_count and prompts.copy_count
-- ---------------------------------------------------------------------------
--
-- These stay writable through increment_view_count and increment_copy_count,
-- which are security definer and run as the function owner, so they are not
-- affected by the grants below. App code only ever reads these columns.

revoke insert, update on public.prompts from anon, authenticated;

grant insert (id, user_id, title, prompt, image_url, ai_tool, tags,
              created_at, updated_at)
  on public.prompts to anon, authenticated;

-- `user_id` is deliberately absent, so a prompt cannot change hands.
grant update (title, prompt, image_url, ai_tool, tags, updated_at)
  on public.prompts to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Storage limits
-- ---------------------------------------------------------------------------
--
-- These mirror the client side checks in src/services/supabase/storage.ts.
-- The anon key is public, so the client checks are a convenience for honest
-- users, not a control. Keep the two in sync when either changes.

update storage.buckets
   set file_size_limit   = 2097152,  -- 2 MB
       allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
 where id = 'avatars';

update storage.buckets
   set file_size_limit   = 5242880,  -- 5 MB
       allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
 where id = 'banners';

update storage.buckets
   set file_size_limit   = 3145728,  -- 3 MB
       allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
 where id = 'prompt-images';

-- ---------------------------------------------------------------------------
-- Verify
-- ---------------------------------------------------------------------------
--
-- Run this after. Every column in the first row must come back false, and the
-- three buckets must come back with a limit and a MIME list.
--
--   select
--     has_column_privilege('authenticated', 'public.profiles', 'verified',   'INSERT') as ins_verified_auth,
--     has_column_privilege('authenticated', 'public.profiles', 'verified',   'UPDATE') as upd_verified_auth,
--     has_column_privilege('anon',          'public.profiles', 'verified',   'INSERT') as ins_verified_anon,
--     has_column_privilege('authenticated', 'public.prompts',  'view_count', 'UPDATE') as upd_views_auth,
--     has_column_privilege('authenticated', 'public.prompts',  'copy_count', 'UPDATE') as upd_copies_auth;
--
--   select id, file_size_limit, allowed_mime_types from storage.buckets;
--
-- Then smoke test the app, since these are the flows the grants above touch:
--   1. sign in with a brand new account and complete the profile
--   2. edit an existing profile, name, bio, avatar, banner
--   3. create a prompt with an image, then edit it
--   4. copy a prompt, reload, confirm the counter still moved
