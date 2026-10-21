-- ============================================================================
-- PehliPeedhi (पहली पीढ़ी) - Supabase / PostgreSQL Database Schema
-- Run this script in the Supabase Dashboard -> SQL Editor
-- ============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES (Extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  email text not null unique,
  role text not null check (role in ('student', 'mentor', 'admin')),
  phone text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. STUDENT PROFILES
create table if not exists public.students (
  id uuid references public.profiles(id) on delete cascade primary key,
  city text,
  district text,
  state text,
  current_education_level text,
  intended_course text,
  preferred_language text default 'Hindi',
  first_gen_note text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. MENTOR PROFILES
create table if not exists public.mentors (
  id uuid references public.profiles(id) on delete cascade primary key,
  graduation_college text not null,
  degree text not null,
  field text not null,
  expertise text,
  graduation_year text,
  languages text[] default array['Hindi', 'English'],
  short_bio text,
  availability text default 'Available Weekends',
  verified boolean default false,
  mentee_count integer default 0,
  featured boolean default false,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. MENTORSHIP REQUESTS
create table if not exists public.mentorship_requests (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references public.profiles(id) on delete cascade not null,
  mentor_id uuid references public.profiles(id) on delete cascade not null,
  topic text not null,
  student_language text default 'Hindi',
  preferred_contact text default 'Written Feedback',
  status text not null default 'Pending' check (status in ('Pending', 'Accepted', 'Declined')),
  status_message text,
  mentor_response_note text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. SCHOLARSHIP RESOURCES & GUIDES
create table if not exists public.resources (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  category text not null check (category in ('Scholarship', 'Admission Guide', 'Financial Aid', 'College Life')),
  description text not null,
  eligibility text,
  deadline text,
  amount_or_benefit text,
  official_link text not null,
  featured_tag text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.students enable row level security;
alter table public.mentors enable row level security;
alter table public.mentorship_requests enable row level security;
alter table public.resources enable row level security;

-- Public read access for resources and verified mentors
create policy "Allow public read on resources" on public.resources for select using (true);
create policy "Allow public read on mentors" on public.mentors for select using (true);
create policy "Allow public read on public profiles" on public.profiles for select using (true);

-- Allow profile creation on signup
create policy "Allow insert on profiles" on public.profiles for insert with check (true);
create policy "Allow update on profiles" on public.profiles for update using (true);
create policy "Allow insert on students" on public.students for insert with check (true);
create policy "Allow update on students" on public.students for update using (true);
create policy "Allow insert on mentors" on public.mentors for insert with check (true);
create policy "Allow update on mentors" on public.mentors for update using (true);

-- Authenticated access for requests
create policy "Students can view their own requests" on public.mentorship_requests
  for select using (auth.uid() = student_id or auth.uid() = mentor_id);

create policy "Students can create requests" on public.mentorship_requests
  for insert with check (auth.uid() = student_id);

create policy "Mentors can update request status" on public.mentorship_requests
  for update using (auth.uid() = mentor_id);

