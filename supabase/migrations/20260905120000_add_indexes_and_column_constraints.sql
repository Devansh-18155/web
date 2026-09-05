-- Fixes three defects found by diffing production against the migrations on
-- 2026-09-05, plus the two length caps left over from the September audit.
--
-- Nothing here is a schema redesign. Each item is something the database
-- already should have had and did not.

-- ---------------------------------------------------------------------------
-- Missing indexes
-- ---------------------------------------------------------------------------
--
-- The app filters and sorts on these constantly and production has never had
-- an index on any of them. Every one of these queries is a sequential scan
-- today. It does not hurt yet because the tables are small, and it gets
-- linearly worse with every prompt added.
--
-- Plain `create index`, not `concurrently`: concurrently cannot run inside a
-- transaction and these tables are small enough that the lock is momentary.
-- Revisit if the tables ever get large.

-- The feed's main query: order by created_at desc.
create index if not exists prompts_created_at_idx on public.prompts (created_at desc);

-- Profile pages, and "my prompts".
create index if not exists prompts_user_id_idx on public.prompts (user_id);

-- Like counts are read per prompt. This is also the FK target for the cascade
-- when a prompt is deleted, so without it deleting one prompt scans the whole
-- likes table.
create index if not exists likes_prompt_id_idx on public.likes (prompt_id);

-- Follower counts on a profile. The existing follows_unique_user_pair index
-- covers follower_id as its leading column, but nothing covers following_id.
create index if not exists follows_following_id_idx on public.follows (following_id);

-- Deliberately not adding saves (user_id). saves_unique_user_prompt is already
-- (user_id, prompt_id), and Postgres can use a leading column on its own, so a
-- separate index would be dead weight.

-- ---------------------------------------------------------------------------
-- prompts.updated_at: timestamp -> timestamptz
-- ---------------------------------------------------------------------------
--
-- This is the only timestamp column in the database without a timezone. Every
-- other created_at and updated_at is timestamptz.
--
-- The app writes new Date().toISOString(), which ends in Z. Postgres parsed
-- that, discarded the offset and stored the UTC wall clock. So the values are
-- correct UTC readings that are simply not labelled as such, which is why the
-- `using` clause below reads them as UTC. Without it Postgres would interpret
-- them in the server timezone and silently shift every row.

alter table public.prompts
  alter column updated_at type timestamptz
  using updated_at at time zone 'UTC';

-- ---------------------------------------------------------------------------
-- Duplicate unique constraint on profiles.username
-- ---------------------------------------------------------------------------
--
-- Production carries two identical unique constraints on the same column:
-- profiles_username_key, created by the inline `unique` on the table, and
-- profiles_username_unique, added by hand later. Both are enforced on every
-- insert and update, for one rule.
--
-- Dropping the hand added one. profiles_username_key stays, so uniqueness is
-- unchanged.

alter table public.profiles
  drop constraint if exists profiles_username_unique;

-- ---------------------------------------------------------------------------
-- Length caps on free text
-- ---------------------------------------------------------------------------
--
-- feedback.message, feedback.subject and prompt_reports.details had no limit
-- at all. The anon key is public, so the form is not a control: anyone could
-- post a multi-megabyte string straight to the API, repeatedly.
--
-- The limits are set above what the UI allows, so they act as an abuse
-- backstop rather than a second copy of the form's validation. The form caps
-- subject at 200 and message at 5000, and the report dialog caps details at
-- 500.
--
-- `not valid` skips the check against existing rows. New and updated rows are
-- still checked. The tables should have nothing near these limits, but a
-- migration that fails on old data is worse than one that starts from here.

alter table public.feedback
  add constraint feedback_subject_length check (char_length(subject) <= 500) not valid;

alter table public.feedback
  add constraint feedback_message_length check (char_length(message) <= 10000) not valid;

alter table public.prompt_reports
  add constraint prompt_reports_details_length check (char_length(details) <= 2000) not valid;

-- Turn the checks into full constraints if the existing rows pass, which they
-- should. Wrapped so an unexpectedly long historic row leaves the constraint
-- in place for new writes rather than failing the whole migration.
do $$
begin
  alter table public.feedback validate constraint feedback_subject_length;
  alter table public.feedback validate constraint feedback_message_length;
  alter table public.prompt_reports validate constraint prompt_reports_details_length;
exception
  when check_violation then
    raise notice 'Existing rows exceed the new length limits. Constraints are active for new writes but not validated against history.';
end
$$;
