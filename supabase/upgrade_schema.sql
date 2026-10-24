-- ============================================================================
-- PehliPeedhi (पहली पीढ़ी) - Safe Idempotent Schema Upgrade Script
-- Run this in your Supabase Dashboard -> SQL Editor -> Run
-- It safely adds missing columns, tables, types, and policies to existing databases
-- ============================================================================

-- 0. Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Upgrade public.profiles
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS district TEXT,
  ADD COLUMN IF NOT EXISTS state TEXT DEFAULT 'Bihar',
  ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'unverified',
  ADD COLUMN IF NOT EXISTS verification_data JSONB,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());

-- 2. Upgrade public.students
ALTER TABLE public.students 
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS district TEXT,
  ADD COLUMN IF NOT EXISTS state TEXT DEFAULT 'Bihar',
  ADD COLUMN IF NOT EXISTS current_education_level TEXT,
  ADD COLUMN IF NOT EXISTS intended_course TEXT,
  ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'Hindi',
  ADD COLUMN IF NOT EXISTS first_gen_note TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());

-- 3. Upgrade public.mentors
ALTER TABLE public.mentors 
  ADD COLUMN IF NOT EXISTS expertise TEXT,
  ADD COLUMN IF NOT EXISTS graduation_year TEXT,
  ADD COLUMN IF NOT EXISTS languages TEXT[] DEFAULT ARRAY['Hindi', 'English']::TEXT[],
  ADD COLUMN IF NOT EXISTS short_bio TEXT,
  ADD COLUMN IF NOT EXISTS availability TEXT DEFAULT 'Available Weekends',
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS district TEXT,
  ADD COLUMN IF NOT EXISTS state TEXT DEFAULT 'Bihar',
  ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'unverified',
  ADD COLUMN IF NOT EXISTS verification_data JSONB,
  ADD COLUMN IF NOT EXISTS mentee_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS rating NUMERIC(3, 2) DEFAULT 5.00,
  ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());

-- 4. Upgrade public.mentorship_requests
ALTER TABLE public.mentorship_requests 
  ADD COLUMN IF NOT EXISTS status_message TEXT,
  ADD COLUMN IF NOT EXISTS mentor_response_note TEXT,
  ADD COLUMN IF NOT EXISTS meeting_link TEXT,
  ADD COLUMN IF NOT EXISTS meeting_date TEXT,
  ADD COLUMN IF NOT EXISTS meeting_time TEXT,
  ADD COLUMN IF NOT EXISTS meeting_scheduled_time TEXT,
  ADD COLUMN IF NOT EXISTS meeting_email_sent BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS meeting_completed BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS meeting_completed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS rating SMALLINT,
  ADD COLUMN IF NOT EXISTS feedback JSONB,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());

-- Update status check constraint on mentorship_requests to allow 'Completed'
DO $$
BEGIN
  ALTER TABLE public.mentorship_requests DROP CONSTRAINT IF EXISTS mentorship_requests_status_check;
  ALTER TABLE public.mentorship_requests ADD CONSTRAINT mentorship_requests_status_check 
    CHECK (status IN ('Pending', 'Accepted', 'Declined', 'Completed'));
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- 5. Create / Upgrade public.mentor_reviews (Mentorship Meeting History & Ratings)
CREATE TABLE IF NOT EXISTS public.mentor_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID REFERENCES public.mentorship_requests(id) ON DELETE SET NULL,
  mentor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  student_name TEXT NOT NULL,
  rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  meeting_date TEXT,
  meeting_time TEXT,
  meeting_scheduled_time TEXT,
  topic TEXT,
  comment TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.mentor_reviews 
  ADD COLUMN IF NOT EXISTS meeting_date TEXT,
  ADD COLUMN IF NOT EXISTS meeting_time TEXT,
  ADD COLUMN IF NOT EXISTS meeting_scheduled_time TEXT,
  ADD COLUMN IF NOT EXISTS topic TEXT;

-- 6. Create public.account_verifications if not exists
CREATE TABLE IF NOT EXISTS public.account_verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'mentor')),
  institution_name TEXT NOT NULL,
  degree TEXT,
  graduation_year TEXT,
  document_type TEXT NOT NULL,
  document_number TEXT NOT NULL,
  document_file_name TEXT,
  first_gen_declaration BOOLEAN DEFAULT TRUE NOT NULL,
  status TEXT DEFAULT 'verified' NOT NULL CHECK (status IN ('pending', 'verified', 'rejected')),
  submitted_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  verified_at TIMESTAMPTZ
);

-- 7. Ensure RLS is active
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- 8. Safe policy additions
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read on reviews') THEN
    CREATE POLICY "Public read on reviews" ON public.mentor_reviews FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow insert on reviews') THEN
    CREATE POLICY "Allow insert on reviews" ON public.mentor_reviews FOR INSERT WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow insert on verifications') THEN
    CREATE POLICY "Allow insert on verifications" ON public.account_verifications FOR INSERT WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow select on verifications') THEN
    CREATE POLICY "Allow select on verifications" ON public.account_verifications FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow select on mentorship_requests') THEN
    CREATE POLICY "Allow select on mentorship_requests" ON public.mentorship_requests FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow insert on mentorship_requests') THEN
    CREATE POLICY "Allow insert on mentorship_requests" ON public.mentorship_requests FOR INSERT WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow update on mentorship_requests') THEN
    CREATE POLICY "Allow update on mentorship_requests" ON public.mentorship_requests FOR UPDATE USING (true) WITH CHECK (true);
  END IF;

  -- Profiles, Students, Mentors Update Policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow insert on profiles') THEN
    CREATE POLICY "Allow insert on profiles" ON public.profiles FOR INSERT WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow update on profiles') THEN
    CREATE POLICY "Allow update on profiles" ON public.profiles FOR UPDATE USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow insert on students') THEN
    CREATE POLICY "Allow insert on students" ON public.students FOR INSERT WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow update on students') THEN
    CREATE POLICY "Allow update on students" ON public.students FOR UPDATE USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow insert on mentors') THEN
    CREATE POLICY "Allow insert on mentors" ON public.mentors FOR INSERT WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow update on mentors') THEN
    CREATE POLICY "Allow update on mentors" ON public.mentors FOR UPDATE USING (true);
  END IF;

  -- Delete Policies (Enables permanent account deletion directly from the profile section)
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow delete on mentors') THEN
    CREATE POLICY "Allow delete on mentors" ON public.mentors FOR DELETE USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow delete on profiles') THEN
    CREATE POLICY "Allow delete on profiles" ON public.profiles FOR DELETE USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow delete on students') THEN
    CREATE POLICY "Allow delete on students" ON public.students FOR DELETE USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow delete on mentorship_requests') THEN
    CREATE POLICY "Allow delete on mentorship_requests" ON public.mentorship_requests FOR DELETE USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow delete on mentor_reviews') THEN
    CREATE POLICY "Allow delete on mentor_reviews" ON public.mentor_reviews FOR DELETE USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow delete on account_verifications') THEN
    CREATE POLICY "Allow delete on account_verifications" ON public.account_verifications FOR DELETE USING (true);
  END IF;
END $$;

-- ============================================================================
-- 9. PERMANENT REMOVAL OF PREVIOUS MENTOR PROFILE (Shashwat Anand)
-- Execute this block in SQL Editor to permanently purge the previous mentor profile
-- ============================================================================
DELETE FROM public.mentor_reviews WHERE mentor_id = '443f5649-17c2-4d34-a253-43cb925c72d5';
DELETE FROM public.mentorship_requests WHERE mentor_id = '443f5649-17c2-4d34-a253-43cb925c72d5';
DELETE FROM public.account_verifications WHERE user_id = '443f5649-17c2-4d34-a253-43cb925c72d5';
DELETE FROM public.mentors WHERE id = '443f5649-17c2-4d34-a253-43cb925c72d5';
DELETE FROM public.profiles WHERE id = '443f5649-17c2-4d34-a253-43cb925c72d5';
DELETE FROM auth.users WHERE id = '443f5649-17c2-4d34-a253-43cb925c72d5' OR email = 'shashwatanand5306@gmail.com';


