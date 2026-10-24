-- ============================================================================
-- PehliPeedhi (पहली पीढ़ी) - Complete Supabase & PostgreSQL Database Schema
-- Production Data Models with Specific Formats & Strong Type Constraints
-- ============================================================================

-- 0. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. PROFILES (Extends Supabase auth.users)
-- Format: Core identity, contact info, role, and verification status
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('student', 'mentor', 'guest', 'admin')),
  phone TEXT,
  avatar_url TEXT,
  city TEXT,
  district TEXT,
  state TEXT DEFAULT 'Bihar',
  verified BOOLEAN DEFAULT FALSE NOT NULL,
  verification_status TEXT DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified')),
  verification_data JSONB,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- 2. STUDENT PROFILES
-- Format: First-gen educational trajectory, intended course, language preference
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.students (
  id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  city TEXT,
  district TEXT,
  state TEXT DEFAULT 'Bihar',
  current_education_level TEXT,
  intended_course TEXT,
  preferred_language TEXT DEFAULT 'Hindi',
  first_gen_note TEXT,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- 3. MENTOR PROFILES
-- Format: Academic credentials, expertise, vernacular comfort, ratings, reviews
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.mentors (
  id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  graduation_college TEXT NOT NULL,
  degree TEXT NOT NULL,
  field TEXT NOT NULL,
  expertise TEXT,
  graduation_year TEXT,
  languages TEXT[] DEFAULT ARRAY['Hindi', 'English']::TEXT[],
  short_bio TEXT,
  availability TEXT DEFAULT 'Available Weekends',
  city TEXT,
  district TEXT,
  state TEXT DEFAULT 'Bihar',
  verified BOOLEAN DEFAULT FALSE NOT NULL,
  verification_status TEXT DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified')),
  verification_data JSONB,
  mentee_count INTEGER DEFAULT 0 NOT NULL,
  rating NUMERIC(3, 2) DEFAULT 5.00 NOT NULL,
  review_count INTEGER DEFAULT 0 NOT NULL,
  featured BOOLEAN DEFAULT FALSE NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- 4. MENTORSHIP REQUESTS
-- Format: 1-on-1 mentorship session workflow with status tracking & feedback
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.mentorship_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  mentor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  topic TEXT NOT NULL,
  student_language TEXT DEFAULT 'Hindi',
  preferred_contact TEXT DEFAULT 'Written Feedback' 
    CHECK (preferred_contact IN ('Written Feedback', 'Weekend Phone Call', 'WhatsApp Chat', 'Google Meet')),
  status TEXT DEFAULT 'Pending' NOT NULL 
    CHECK (status IN ('Pending', 'Accepted', 'Declined', 'Completed')),
  status_message TEXT,
  mentor_response_note TEXT,
  meeting_link TEXT,
  meeting_date TEXT,
  meeting_time TEXT,
  meeting_scheduled_time TEXT,
  meeting_email_sent BOOLEAN DEFAULT FALSE NOT NULL,
  meeting_completed BOOLEAN DEFAULT FALSE NOT NULL,
  meeting_completed_at TIMESTAMPTZ,
  rating SMALLINT CHECK (rating >= 1 AND rating <= 5),
  feedback JSONB, -- Stores { rating: 5, meetingDate: "...", meetingTime: "...", submitted_at: "..." }
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- 5. MENTOR REVIEWS & MEETING HISTORY
-- Format: Meeting date, meeting time, 1-5 star rating of that meet
-- ============================================================================
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

-- ============================================================================
-- 6. ACCOUNT VERIFICATIONS (Audit Logs & Review Records)
-- Format: Government / University ID proof verification logs
-- ============================================================================
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

-- ============================================================================
-- 7. SCHOLARSHIP RESOURCES & GUIDES
-- Format: Curated first-gen higher education opportunities
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Scholarship', 'Admission Guide', 'Financial Aid', 'College Life')),
  description TEXT NOT NULL,
  eligibility TEXT,
  deadline TEXT,
  amount_or_benefit TEXT,
  official_link TEXT NOT NULL,
  featured_tag TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- 8. INDEXES FOR HIGH QUERY PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_mentors_field ON public.mentors(field);
CREATE INDEX IF NOT EXISTS idx_mentors_rating ON public.mentors(rating DESC);
CREATE INDEX IF NOT EXISTS idx_mentorship_requests_student ON public.mentorship_requests(student_id);
CREATE INDEX IF NOT EXISTS idx_mentorship_requests_mentor ON public.mentorship_requests(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentorship_requests_status ON public.mentorship_requests(status);
CREATE INDEX IF NOT EXISTS idx_mentor_reviews_mentor ON public.mentor_reviews(mentor_id);

-- ============================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Public Select Policies
CREATE POLICY "Public read on resources" ON public.resources FOR SELECT USING (true);
CREATE POLICY "Public read on mentors" ON public.mentors FOR SELECT USING (true);
CREATE POLICY "Public read on profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public read on reviews" ON public.mentor_reviews FOR SELECT USING (true);

-- Upsert / Modification Policies
CREATE POLICY "Allow insert on profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update on profiles" ON public.profiles FOR UPDATE USING (true);

CREATE POLICY "Allow insert on students" ON public.students FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update on students" ON public.students FOR UPDATE USING (true);

CREATE POLICY "Allow insert on mentors" ON public.mentors FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update on mentors" ON public.mentors FOR UPDATE USING (true);

CREATE POLICY "Allow select on mentorship_requests" ON public.mentorship_requests FOR SELECT USING (true);
CREATE POLICY "Allow insert on mentorship_requests" ON public.mentorship_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update on mentorship_requests" ON public.mentorship_requests FOR UPDATE USING (true);

CREATE POLICY "Allow insert on reviews" ON public.mentor_reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert on verifications" ON public.account_verifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select on verifications" ON public.account_verifications FOR SELECT USING (true);

-- Account Deletion Policies
CREATE POLICY "Allow delete on profiles" ON public.profiles FOR DELETE USING (true);
CREATE POLICY "Allow delete on mentors" ON public.mentors FOR DELETE USING (true);
CREATE POLICY "Allow delete on students" ON public.students FOR DELETE USING (true);
CREATE POLICY "Allow delete on mentorship_requests" ON public.mentorship_requests FOR DELETE USING (true);
CREATE POLICY "Allow delete on mentor_reviews" ON public.mentor_reviews FOR DELETE USING (true);
CREATE POLICY "Allow delete on account_verifications" ON public.account_verifications FOR DELETE USING (true);

