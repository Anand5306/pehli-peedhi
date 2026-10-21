-- ============================================================================
-- PehliPeedhi (पहली पीढ़ी) - Supabase Seed Data
-- Run this in Supabase Dashboard -> SQL Editor to populate verified mentors & resources
-- ============================================================================

-- 1. Insert Initial Resources (Scholarships & Financial Aid)
insert into public.resources (title, category, description, eligibility, deadline, amount_or_benefit, official_link, featured_tag)
values
(
  'National Scholarship Portal (NSP) Complete Roadmap',
  'Scholarship',
  'Step-by-step verified guide for first-generation students to apply for Central Sector Scheme of Scholarships for College & University Students.',
  'Top 20th percentile in Class 12 board exams, family annual income under ₹4.5 Lakhs',
  '31st October (Annual)',
  'Up to ₹20,000 / year throughout undergraduate degree',
  'https://scholarships.gov.in',
  'High Priority'
),
(
  'AICTE Pragati Scholarship for Girl Students',
  'Scholarship',
  'Government scholarship providing financial assistance for female students entering technical degree and diploma courses in AICTE approved institutions.',
  'Admitted to 1st year degree/diploma, family annual income under ₹8 Lakhs (Max 2 girls per family)',
  'December (Annual Cycle)',
  '₹50,000 per annum towards tuition fees and college expenses',
  'https://www.aicte-india.org',
  'Empowerment'
),
(
  'Understanding State Fee Waiver & Post-Matric Schemes',
  'Financial Aid',
  'How to obtain state income certificates, Bonafide letters, and avail zero-tuition fees in state government colleges and IIT/NIT fee remission.',
  'SC / ST / OBC / EWS students with valid state domicile certificate',
  'August - November (State Dependent)',
  '100% Tuition Fee Remission + Monthly Hostel Maintenance Allowance',
  'https://socialjustice.gov.in',
  'Zero Tuition'
),
(
  'First-Gen Survival: Navigating College Hostels & Campus Culture',
  'College Life',
  'Practical guide written by alumni: dealing with cultural alienation, finding study groups, avoiding ragging, and finding part-time campus work.',
  'Open to all students entering higher education',
  'Year-round Guide',
  'Free PDF Handbook & Peer Checklist',
  'https://scholarships.gov.in',
  'Campus Guide'
)
on conflict do nothing;
