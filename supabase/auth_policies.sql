-- ============================================================================
-- PehliPeedhi - Supabase RLS Fix for Sign-up Profile Insertion
-- Run this in Supabase Dashboard -> SQL Editor
-- ============================================================================

-- Allow inserting and updating profiles
create policy "Allow insert on profiles" on public.profiles
  for insert with check (true);

create policy "Allow update on profiles" on public.profiles
  for update using (true);

-- Allow inserting and updating students
create policy "Allow insert on students" on public.students
  for insert with check (true);

create policy "Allow update on students" on public.students
  for update using (true);

-- Allow inserting and updating mentors
create policy "Allow insert on mentors" on public.mentors
  for insert with check (true);

create policy "Allow update on mentors" on public.mentors
  for update using (true);
