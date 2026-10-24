import { EntranceExam, MentorProfile, MentorshipRequest, ResourceItem, StudentProfile } from '../types';

export const INDIAN_STATES: string[] = [
  "All States",
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi NCR", "Jammu & Kashmir", "Ladakh"
];

export const FIELDS_OF_STUDY: string[] = [
  "All Fields",
  "Engineering & Technology",
  "Medical & Healthcare",
  "Commerce & Chartered Accountancy",
  "Arts, Humanities & Social Sciences",
  "Law & Legal Studies",
  "Government Exams & Public Services",
  "Pure Sciences & Research",
  "Vocational & Skill Training"
];

export const EDUCATION_LEVELS: string[] = [
  "Class 10 (Secondary School)",
  "Class 11 / 12 (Higher Secondary)",
  "Undergraduate - 1st Year",
  "Undergraduate - 2nd/3rd/4th Year",
  "Polytechnic / Diploma",
  "Postgraduate",
  "Preparing for College Entrance"
];

export const LANGUAGES_LIST: string[] = [
  "All Languages",
  "Hindi", "English", "Bengali", "Marathi", "Tamil", "Telugu", 
  "Kannada", "Gujarati", "Malayalam", "Odia", "Punjabi", "Bhojpuri", "Urdu", "Assamese"
];

export const SAMPLE_MENTORS: MentorProfile[] = [];

export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  fullName: "",
  email: "",
  phone: "",
  city: "",
  district: "",
  state: "Bihar",
  currentEducationLevel: "",
  intendedCourse: "",
  preferredLanguage: "Hindi",
  firstGenNote: "",
  verified: false,
  verificationStatus: 'unverified'
};

export const INITIAL_MENTOR_PROFILE: MentorProfile = { 
  id: "",
  fullName: "",
  avatar: "",
  avatarColor: "#2563EB",
  city: "",
  district: "",
  state: "Bihar",
  email: "",
  phone: "",
  graduationCollege: "",
  degree: "",
  field: "Engineering & Technology",
  expertise: "First-Gen Mentorship Guidance",
  graduationYear: "2023",
  languages: ["Hindi", "English"],
  shortBio: "",
  availability: "Available on Weekends",
  verified: false,
  verificationStatus: 'unverified',
  menteeCount: 0,
  rating: 0,
  reviewCount: 0,
  reviews: []
};

export const INITIAL_REQUESTS: MentorshipRequest[] = [];

export const SAMPLE_RESOURCES: ResourceItem[] = [
  {
    id: "res-1",
    title: "National Scholarship Portal (NSP) Complete Roadmap",
    category: "Scholarship",
    description: "Step-by-step verified guide for first-generation students to apply for Central Sector Scheme of Scholarships for College & University Students.",
    eligibility: "Top 20th percentile in Class 12 board exams, family annual income under ₹4.5 Lakhs",
    amountOrBenefit: "Up to ₹20,000 / year throughout undergraduate degree",
    deadline: "31st October (Annual)",
    officialLink: "https://scholarships.gov.in",
    featuredTag: "High Priority"
  },
  {
    id: "res-2",
    title: "AICTE Pragati Scholarship for Girl Students",
    category: "Scholarship",
    description: "Government scholarship providing financial assistance for female students entering technical degree and diploma courses in AICTE approved institutions.",
    eligibility: "Admitted to 1st year degree/diploma, family annual income under ₹8 Lakhs (Max 2 girls per family)",
    amountOrBenefit: "₹50,000 per annum towards tuition fees and college expenses",
    deadline: "December (Annual Cycle)",
    officialLink: "https://www.aicte-india.org",
    featuredTag: "Empowerment"
  },
  {
    id: "res-3",
    title: "Understanding State Fee Waiver & Post-Matric Schemes",
    category: "Financial Aid",
    description: "How to obtain state income certificates, Bonafide letters, and avail zero-tuition fees in state government colleges and IIT/NIT fee remission.",
    eligibility: "SC / ST / OBC / EWS students with valid state domicile certificate",
    amountOrBenefit: "100% Tuition Fee Remission + Monthly Hostel Maintenance Allowance",
    officialLink: "https://socialjustice.gov.in",
    featuredTag: "Zero Tuition"
  },
  {
    id: "res-4",
    title: "First-Gen Survival: Navigating College Hostels & Campus Culture",
    category: "College Life",
    description: "Practical guide written by alumni: dealing with cultural alienation, finding study groups, avoiding ragging, and finding part-time campus work.",
    eligibility: "Open to all students entering higher education",
    amountOrBenefit: "Free PDF Handbook & Peer Checklist",
    officialLink: "#",
    featuredTag: "Campus Guide"
  }
];

export const EXAM_STREAMS = [
  { id: 'All', name: 'All Streams', icon: '🎓' },
  { id: 'Engineering & Technology', name: 'Engineering & Technology', icon: '⚙️' },
  { id: 'Medical & Healthcare', name: 'Medical & Healthcare', icon: '🩺' },
  { id: 'Central Universities (CUET)', name: 'Central Universities (CUET)', icon: '🏛️' },
  { id: 'Law & Legal Studies', name: 'Law & Legal Studies', icon: '⚖️' },
  { id: 'Management & Commerce', name: 'Management & Commerce', icon: '📈' },
  { id: 'Design & Architecture', name: 'Design & Architecture', icon: '🎨' },
  { id: 'Pure Sciences & Research', name: 'Pure Sciences & Research', icon: '🔬' },
  { id: 'Defense & Agriculture', name: 'Defense & Agriculture', icon: '🎖️' }
];

export const ENTRANCE_EXAMS_DATA: EntranceExam[] = [
  // 1. Engineering & Technology
  {
    id: 'exam-jee-main',
    name: 'JEE Main',
    fullName: 'Joint Entrance Examination (Main)',
    stream: 'Engineering & Technology',
    conductingBody: 'National Testing Agency (NTA)',
    targetCourses: 'B.Tech / B.E. / B.Arch in 32 NITs, 26 IIITs, 38 GFTIs & State Engg Colleges',
    eligibility: 'Class 12 pass/appearing with Physics, Mathematics & Chemistry/Technical Vocational subject. 75% marks (65% for SC/ST) or top 20 percentile in respective board.',
    frequency: 'Twice a year (Session 1: Jan/Feb, Session 2: April)',
    examMode: 'Computer Based Test (CBT)',
    keyDates: 'Session 1 Reg: Nov-Dec | Session 2 Reg: Feb-Mar',
    officialUrl: 'https://jeemain.nta.nic.in',
    applicationFee: '₹1,000 (Gen/OBC Male) | ₹500 (Female / SC / ST / PwD)',
    firstGenTips: 'Qualifying JEE Main unlocks JEE Advanced for IITs. At NITs, students with family annual income < ₹1 Lakh receive 100% tuition fee waiver, and income between ₹1-5 Lakhs receive 66.6% fee remission.',
    featuredTag: 'Top National Gateway',
    badgeColor: '#2563EB'
  },
  {
    id: 'exam-jee-adv',
    name: 'JEE Advanced',
    fullName: 'Joint Entrance Examination (Advanced)',
    stream: 'Engineering & Technology',
    conductingBody: 'Organizing IIT (under Joint Admission Board)',
    targetCourses: 'B.Tech, B.S., Dual Degree across all 23 Indian Institutes of Technology (IITs)',
    eligibility: 'Ranked in Top 2,50,000 successful candidates of JEE Main (Category-wise quotas apply). Max 2 attempts in consecutive years.',
    frequency: 'Once a year (May / June)',
    examMode: 'Computer Based Test (Two mandatory 3-hour papers on same day)',
    keyDates: 'Registration starts immediately after JEE Main Session 2 declaration (Late April / May)',
    officialUrl: 'https://jeeadv.ac.in',
    applicationFee: '₹3,200 (General/OBC Male) | ₹1,600 (Female / SC / ST / PwD)',
    firstGenTips: 'All IITs grant 100% tuition remission to SC, ST, PwD, and economically underprivileged students (income < ₹1 Lakh). SBI Scholar Loans provide collateral-free 100% funding on campus.',
    featuredTag: 'Premier Tier-1 Gateway',
    badgeColor: '#1D4ED8'
  },
  {
    id: 'exam-bitsat',
    name: 'BITSAT',
    fullName: 'Birla Institute of Technology and Science Admission Test',
    stream: 'Engineering & Technology',
    conductingBody: 'BITS Pilani',
    targetCourses: 'B.E., B.Pharm, M.Sc Dual Degree at BITS Pilani, Goa & Hyderabad Campuses',
    eligibility: 'Class 12 with min 75% aggregate in Physics, Chemistry & Mathematics/Biology with at least 60% in each subject.',
    frequency: 'Twice a year (Session 1: May, Session 2: June)',
    examMode: 'Online Computer Based Test (130 Multiple Choice Questions)',
    keyDates: 'Registration opens in January; Closes in April',
    officialUrl: 'https://www.bitsadmission.com',
    applicationFee: '₹3,400 (One Session) | ₹5,400 (Both Sessions)',
    firstGenTips: 'BITS offers merit-cum-need scholarships covering up to 80% to 100% of semester tuition for students whose family annual income is under ₹11 Lakhs.',
    featuredTag: 'Top Private University',
    badgeColor: '#7C3AED'
  },
  {
    id: 'exam-wbjee',
    name: 'WBJEE',
    fullName: 'West Bengal Joint Entrance Examination',
    stream: 'Engineering & Technology',
    conductingBody: 'West Bengal Joint Entrance Examinations Board (WBJEEB)',
    targetCourses: 'B.Tech / B.Pharm in Jadavpur University, Kalyani Govt Engg, Heritage & WB State Colleges',
    eligibility: '10+2 with Physics, Mathematics and Chemistry/Bio (min 45% aggregate, 40% for reserved)',
    frequency: 'Annual (Held in April)',
    examMode: 'Offline OMR-Based Written Examination',
    keyDates: 'Registration: Dec - Feb | Exam: Late April',
    officialUrl: 'https://wbjeeb.nic.in',
    applicationFee: '₹500 (General) | ₹400 (SC / ST / OBC)',
    firstGenTips: 'Jadavpur University offers world-ranked engineering at under ₹10,000 TOTAL tuition fee for the entire 4-year degree! One of the highest ROI universities in Asia for first-generation students.',
    featuredTag: 'Ultra-High ROI (Low Fees)',
    badgeColor: '#059669'
  },
  {
    id: 'exam-mht-cet',
    name: 'MHT CET',
    fullName: 'Maharashtra Common Entrance Test',
    stream: 'Engineering & Technology',
    conductingBody: 'State CET Cell, Government of Maharashtra',
    targetCourses: 'B.E. / B.Tech in COEP Tech Pune, VJTI Mumbai, SPIT Mumbai, Walchand College',
    eligibility: '10+2 passed with Physics, Mathematics & Chemistry (min 45% for general, 40% for reserved)',
    frequency: 'Annual (Held in April - May)',
    examMode: 'Computer Based Test (PCM Group)',
    keyDates: 'Registration: Jan - March | Exam: April / May',
    officialUrl: 'https://cetcell.mahacet.org',
    applicationFee: '₹1,000 (General) | ₹800 (Reserved Categories)',
    firstGenTips: 'Maharashtra state government reimbursement schemes (EBC scholarship) reimburse 50% to 100% tuition fees for low-income and first-gen families admitted through CAP rounds.',
    featuredTag: 'Top State Gateway',
    badgeColor: '#EA580C'
  },
  {
    id: 'exam-comedk',
    name: 'COMEDK UGET',
    fullName: 'Consortium of Medical, Engineering and Dental Colleges of Karnataka',
    stream: 'Engineering & Technology',
    conductingBody: 'COMEDK',
    targetCourses: 'B.E. / B.Tech in 190+ Karnataka colleges including RV College, BMS College, Ramaiah Institute',
    eligibility: '10+2 with min 45% aggregate in Physics, Mathematics & Chemistry with English',
    frequency: 'Annual (May)',
    examMode: 'Computer Based Test (180 questions, no negative marking)',
    keyDates: 'Registration: Feb - April | Exam: Second week of May',
    officialUrl: 'https://www.comedk.org',
    applicationFee: '₹1,800 + GST',
    firstGenTips: 'No state domicile restriction; open to students across all Indian states. Top 3 colleges (RVCE, BMS, MSRIT) feature average placement packages above ₹12 LPA.',
    featuredTag: 'All-India Open Seats',
    badgeColor: '#0284C7'
  },

  // 2. Medical & Healthcare
  {
    id: 'exam-neet-ug',
    name: 'NEET-UG',
    fullName: 'National Eligibility cum Entrance Test (Undergraduate)',
    stream: 'Medical & Healthcare',
    conductingBody: 'National Testing Agency (NTA)',
    targetCourses: 'MBBS, BDS, BAMS, BHMS, BUMS, B.Sc Nursing across all AIIMS, JIPMER, Govt Medical Colleges',
    eligibility: 'Class 12 with Physics, Chemistry, Biology/Biotechnology & English. Min 50% for Unreserved, 40% for SC/ST/OBC. Min age: 17 years.',
    frequency: 'Annual (First Sunday of May)',
    examMode: 'Pen & Paper (OMR sheet) - 200 Questions (Physics, Chemistry, Botany, Zoology)',
    keyDates: 'Registration: Feb - March | Exam: Early May',
    officialUrl: 'https://neet.ntaonline.in',
    applicationFee: '₹1,700 (General) | ₹1,600 (EWS/OBC) | ₹1,000 (SC / ST / PwD)',
    firstGenTips: 'AIIMS New Delhi and Central Government Medical Colleges charge less than ₹6,500 total tuition and hostel fee for the entire 5.5-year MBBS degree. State quota reservations reserve 85% seats in state medical colleges.',
    featuredTag: 'Single National Medical Gateway',
    badgeColor: '#DC2626'
  },
  {
    id: 'exam-aiims-nursing',
    name: 'AIIMS B.Sc Nursing',
    fullName: 'AIIMS Bachelor of Science (Nursing / Paramedical) Entrance Exam',
    stream: 'Medical & Healthcare',
    conductingBody: 'All India Institute of Medical Sciences (AIIMS New Delhi)',
    targetCourses: 'B.Sc (Hons) Nursing, B.Sc Medical Radiology, Medical Laboratory Technology, Bachelor of Optometry across AIIMS',
    eligibility: '10+2 with Physics, Chemistry, Biology & English (min 55% for Gen/OBC, 50% for SC/ST)',
    frequency: 'Annual (June)',
    examMode: 'Computer Based Test (CBT)',
    keyDates: 'Basic Registration: March - April | Exam: June',
    officialUrl: 'https://www.aiimsexams.ac.in',
    applicationFee: '₹2,000 (General/OBC) | ₹1,600 (SC / ST / EWS)',
    firstGenTips: 'AIIMS provides subsidized residential accommodation, minimal fees (~₹1,200/year), and monthly student stipends during practical clinical rotations.',
    featuredTag: 'Govt Medical Fellowship',
    badgeColor: '#B91C1C'
  },

  // 3. Central Universities (CUET)
  {
    id: 'exam-cuet-ug',
    name: 'CUET-UG',
    fullName: 'Common University Entrance Test (Undergraduate)',
    stream: 'Central Universities (CUET)',
    conductingBody: 'National Testing Agency (NTA)',
    targetCourses: 'B.A. (Hons), B.Sc, B.Com, BBA, B.Voc, Integrated B.Ed across 250+ Central, State & Deemed Universities',
    eligibility: 'Class 12 passed or appearing. No minimum age limit specified by NTA (university specific criteria applies).',
    frequency: 'Annual (May - June)',
    examMode: 'Hybrid Mode (CBT & Pen-Paper) in 13 languages across India',
    keyDates: 'Registration: Feb - April | Exam: May - June',
    officialUrl: 'https://exams.nta.ac.in/CUET-UG/',
    applicationFee: '₹1,000 (Up to 3 subjects, Gen) | ₹900 (OBC/EWS) | ₹800 (SC/ST/PwD)',
    firstGenTips: 'Grants access to prestigious central institutions like Delhi University (DU), Banaras Hindu University (BHU), JNU, Jamia Millia Islamia, and Allahabad University without 100% board cutoff pressure.',
    featuredTag: 'Largest Multi-Stream Exam',
    badgeColor: '#7C3AED'
  },
  {
    id: 'exam-cuet-pg',
    name: 'CUET-PG',
    fullName: 'Common University Entrance Test (Postgraduate)',
    stream: 'Central Universities (CUET)',
    conductingBody: 'National Testing Agency (NTA)',
    targetCourses: 'M.A., M.Sc, M.Com, MCA, M.Ed, LLM, MBA across 190+ central and participating universities',
    eligibility: 'Bachelor degree in relevant discipline from a recognized university.',
    frequency: 'Annual (March)',
    examMode: 'Computer Based Test (105 minutes duration)',
    keyDates: 'Registration: Dec - Feb | Exam: March',
    officialUrl: 'https://pgcuet.samarth.ac.in',
    applicationFee: '₹1,200 (General, 2 papers) | ₹1,000 (OBC/EWS) | ₹900 (SC/ST)',
    firstGenTips: 'Enables smooth progression to Master degrees with UGC and CSIR research fellowship pathways for students who want to become college professors or scientists.',
    featuredTag: 'Postgraduate Gateway',
    badgeColor: '#6D28D9'
  },

  // 4. Law & Legal Studies
  {
    id: 'exam-clat',
    name: 'CLAT',
    fullName: 'Common Law Admission Test',
    stream: 'Law & Legal Studies',
    conductingBody: 'Consortium of National Law Universities',
    targetCourses: '5-Year Integrated Law (BA LLB, BBA LLB, B.Sc LLB, B.Com LLB) at 24 National Law Universities',
    eligibility: '10+2 with min 45% marks (40% for SC/ST). No upper age limit for appearing.',
    frequency: 'Annual (Held in December for next academic year)',
    examMode: 'Offline Pen & Paper (120 Comprehension-based Multiple Choice Questions)',
    keyDates: 'Applications: July - October | Exam: First Sunday of December',
    officialUrl: 'https://consortiumofnlus.ac.in',
    applicationFee: '₹4,000 (General/OBC) | ₹3,500 (SC/ST/BPL)',
    firstGenTips: 'NLSIU Bengaluru and NLUs offer needs-based financial scholarships covering 100% fees for low-income students. IDIA (Increasing Diversity by Increasing Access) provides mentoring and financial aid.',
    featuredTag: 'Top National Law Gateway',
    badgeColor: '#0F766E'
  },
  {
    id: 'exam-ailet',
    name: 'AILET',
    fullName: 'All India Law Entrance Test',
    stream: 'Law & Legal Studies',
    conductingBody: 'National Law University (NLU) Delhi',
    targetCourses: 'BA LLB (Hons), LL.M., and Ph.D. at National Law University Delhi',
    eligibility: '10+2 with min 45% aggregate (40% for SC/ST/PwD candidates)',
    frequency: 'Annual (First Sunday of December)',
    examMode: 'Offline Pen & Paper (120 minutes, 150 questions on English, Reasoning, GK)',
    keyDates: 'Registration: August - November | Exam: Early December',
    officialUrl: 'https://nationallawuniversitydelhi.in',
    applicationFee: '₹3,500 (General) | ₹1,500 (SC/ST/PwD)',
    firstGenTips: 'NLU Delhi operates independently from CLAT. It ranks #2 among law schools in India (NIRF) and provides fee remission schemes for economically weaker students.',
    featuredTag: 'NLU Delhi Exclusive',
    badgeColor: '#115E59'
  },

  // 5. Management & Commerce
  {
    id: 'exam-ipmat',
    name: 'IPMAT',
    fullName: 'Integrated Programme in Management Aptitude Test',
    stream: 'Management & Commerce',
    conductingBody: 'IIM Indore & IIM Rohtak',
    targetCourses: '5-Year Dual Degree Integrated BBA + MBA at IIM Indore, IIM Rohtak & IIM Ranchi',
    eligibility: '10+2 passed with min 60% aggregate marks (55% for SC / ST / PwD). Max age limit: 20 years.',
    frequency: 'Annual (May)',
    examMode: 'Computer Based Test (Quant MCQ + Short Answer, Verbal Ability) + Interview',
    keyDates: 'Registration: Feb - April | Exam: Mid May',
    officialUrl: 'https://www.iimidr.ac.in',
    applicationFee: '₹4,130 (General) | ₹2,065 (SC/ST/PwD)',
    firstGenTips: 'Direct admission to an Indian Institute of Management right after Class 12 without needing CAT! Need Based Financial Assistance (NBFA) covers up to 100% tuition for family income < ₹4.5 Lakhs.',
    featuredTag: 'Direct IIM After Class 12',
    badgeColor: '#D97706'
  },
  {
    id: 'exam-jipmat',
    name: 'JIPMAT',
    fullName: 'Joint Integrated Programme in Management Admission Test',
    stream: 'Management & Commerce',
    conductingBody: 'National Testing Agency (NTA) for IIM Bodh Gaya & IIM Jammu',
    targetCourses: '5-Year Integrated Programme in Management (BBA + MBA) at IIM Bodh Gaya and IIM Jammu',
    eligibility: '10+2 passed with min 60% marks (55% for SC / ST / PwD candidates)',
    frequency: 'Annual (June)',
    examMode: 'Computer Based Test (Quantitative Aptitude, Reasoning, Verbal Ability)',
    keyDates: 'Registration: March - April | Exam: Early June',
    officialUrl: 'https://jipmat.nta.ac.in',
    applicationFee: '₹2,000 (General/OBC) | ₹1,000 (SC/ST/PwD)',
    firstGenTips: 'Prestigious IIM degree with pre-approved collateral-free education loans directly through SBI and Canara Bank on campus.',
    featuredTag: 'IIM Dual Degree',
    badgeColor: '#B45309'
  },

  // 6. Design & Architecture
  {
    id: 'exam-uceed',
    name: 'UCEED',
    fullName: 'Undergraduate Common Entrance Examination for Design',
    stream: 'Design & Architecture',
    conductingBody: 'Indian Institute of Technology Bombay (IIT Bombay)',
    targetCourses: 'Bachelor of Design (B.Des) at IIT Bombay, IIT Delhi, IIT Guwahati, IIT Hyderabad, IIITDM Jabalpur',
    eligibility: 'Passed Class 12 in ANY stream (Arts, Commerce, or Science) in current or previous year.',
    frequency: 'Annual (Third Sunday of January)',
    examMode: 'Part A (Computer Based) + Part B (Drawing & Design Sketching on paper)',
    keyDates: 'Registration: Oct - Nov | Exam: January',
    officialUrl: 'https://www.uceed.iitb.ac.in',
    applicationFee: '₹4,000 (Male Gen/OBC) | ₹2,000 (Female / SC / ST / PwD)',
    firstGenTips: 'IIT degree open to Arts & Commerce students! Product, UI/UX and industrial design graduates from IITs secure premier technology design placements with top packages.',
    featuredTag: 'IIT Design Gateway',
    badgeColor: '#9333EA'
  },
  {
    id: 'exam-nift',
    name: 'NIFT Entrance Exam',
    fullName: 'National Institute of Fashion Technology Entrance Examination',
    stream: 'Design & Architecture',
    conductingBody: 'National Testing Agency (NTA)',
    targetCourses: 'B.Des (Fashion, Textile, Accessory, Knitwear, Communication) & B.FTech across 18 NIFT Campuses',
    eligibility: '10+2 from recognized board in any stream for B.Des; Physics, Chemistry & Math required for B.FTech.',
    frequency: 'Annual (Held in February)',
    examMode: 'Creative Ability Test (CAT) + General Ability Test (GAT) + Situation Test',
    keyDates: 'Registration: Dec - Jan | Exam: Early February',
    officialUrl: 'https://exams.nta.ac.in/NIFT/',
    applicationFee: '₹3,000 (General/OBC) | ₹1,500 (SC/ST/PwD)',
    firstGenTips: 'SARTHAK Financial Assistance Scheme by NIFT grants up to 100% tuition fee waiver to students with parental income under ₹2.5 Lakhs.',
    featuredTag: 'Premier Fashion & Design',
    badgeColor: '#C026D3'
  },
  {
    id: 'exam-nata',
    name: 'NATA',
    fullName: 'National Aptitude Test in Architecture',
    stream: 'Design & Architecture',
    conductingBody: 'Council of Architecture (CoA)',
    targetCourses: '5-Year Bachelor of Architecture (B.Arch) in government, university and private architecture colleges nationwide',
    eligibility: '10+2 passed with Physics & Mathematics as mandatory subjects or 10+3 Diploma with Mathematics.',
    frequency: 'Multiple attempts allowed (Conducted every weekend from April to July)',
    examMode: 'Computer-Based MCQ + Offline Drawing / Compositional Test',
    keyDates: 'Registration opens in March | Exams conducted April to July',
    officialUrl: 'https://www.nata.in',
    applicationFee: '₹1,750 per test (General) | ₹1,250 per test (SC/ST/PwD/Female)',
    firstGenTips: 'Candidates can appear up to 3 times in a single year; only the best score is utilized for counselling and admissions.',
    featuredTag: 'National Architecture Gateway',
    badgeColor: '#4F46E5'
  },

  // 7. Pure Sciences & Research
  {
    id: 'exam-iat',
    name: 'IAT (IISER)',
    fullName: 'IISER Aptitude Test',
    stream: 'Pure Sciences & Research',
    conductingBody: 'Indian Institutes of Science Education and Research',
    targetCourses: '5-Year BS-MS Dual Degree at 7 IISERs (Pune, Kolkata, Mohali, Bhopal, Thiruvananthapuram, Tirupati, Berhampur) & IISc Bangalore',
    eligibility: '10+2 with at least three subjects among Biology, Chemistry, Mathematics & Physics with min 60% aggregate (55% for SC/ST/PwD).',
    frequency: 'Annual (June)',
    examMode: 'Computer Based Test (60 Questions covering Physics, Chemistry, Math & Biology)',
    keyDates: 'Registration: April - May | Exam: June',
    officialUrl: 'https://iiseradmission.in',
    applicationFee: '₹2,000 (General/OBC/EWS) | ₹1,000 (SC/ST/PwD)',
    firstGenTips: 'World-class scientific research environment. Eligible students receive monthly DST-INSPIRE fellowships of ₹5,000 plus an annual research grant of ₹20,000.',
    featuredTag: 'Premier Science Research',
    badgeColor: '#0284C7'
  },
  {
    id: 'exam-nest',
    name: 'NEST',
    fullName: 'National Entrance Screening Test',
    stream: 'Pure Sciences & Research',
    conductingBody: 'NISER Bhubaneswar & UM-DAE CEBS Mumbai (Dept. of Atomic Energy)',
    targetCourses: '5-Year Integrated M.Sc. in Biology, Chemistry, Mathematics, Physics at NISER & CEBS',
    eligibility: 'Class 12 pass in science stream with at least 60% aggregate (55% for SC/ST/PwD).',
    frequency: 'Annual (June)',
    examMode: 'Computer Based Test (CBT - Best 3 sections considered among PCMB)',
    keyDates: 'Registration: Feb - May | Exam: Late June',
    officialUrl: 'https://www.nestexam.in',
    applicationFee: '₹1,400 (General/OBC Male) | ₹700 (Female / SC / ST / PwD)',
    firstGenTips: 'All enrolled students receive an annual DISHA scholarship of ₹60,000 + ₹20,000 annual summer internship grant directly from the Government of India Department of Atomic Energy!',
    featuredTag: '100% Funded DAE Scholarship',
    badgeColor: '#0369A1'
  },
  {
    id: 'exam-isi',
    name: 'ISI Admission Test',
    fullName: 'Indian Statistical Institute Admission Test',
    stream: 'Pure Sciences & Research',
    conductingBody: 'Indian Statistical Institute (ISI Kolkata & Bengaluru)',
    targetCourses: 'Bachelor of Statistics (B.Stat Hons) in Kolkata & Bachelor of Mathematics (B.Math Hons) in Bengaluru',
    eligibility: '10+2 with Mathematics and English.',
    frequency: 'Annual (May)',
    examMode: 'Morning Objective Math Exam + Afternoon Subjective Math Proofs Exam',
    keyDates: 'Registration: March - April | Exam: Second Sunday of May',
    officialUrl: 'https://www.isical.ac.in',
    applicationFee: '₹1,500 (Male Gen) | ₹1,000 (Female Gen) | ₹750 (SC/ST/PwD)',
    firstGenTips: 'ZERO TUITION FEES! Every student admitted receives a guaranteed monthly stipend of ₹5,000 + annual contingency grant. Superlative data science and analytics placements globally.',
    featuredTag: 'Zero Tuition + Stipend',
    badgeColor: '#047857'
  },

  // 8. Defense & Agriculture
  {
    id: 'exam-nda',
    name: 'NDA & NA',
    fullName: 'National Defence Academy & Naval Academy Examination',
    stream: 'Defense & Agriculture',
    conductingBody: 'Union Public Service Commission (UPSC)',
    targetCourses: 'Commissioned Officer in Indian Army, Navy, Air Force with a recognized B.Sc / B.Tech degree from JNU',
    eligibility: 'Unmarried male and female candidates aged 16.5 to 19.5 years. Class 12 passed or appearing (PCM mandatory for Air Force/Navy; Any stream for Army).',
    frequency: 'Twice a year (NDA 1 in April, NDA 2 in September)',
    examMode: 'Written Examination (Maths + General Ability Test) followed by 5-day SSB Interview',
    keyDates: 'NDA 1 Notification: December | NDA 2 Notification: May',
    officialUrl: 'https://upsc.gov.in',
    applicationFee: '₹100 (General/OBC Male) | Fee Exempted for Female & SC/ST candidates',
    firstGenTips: '100% free higher education, food, boarding, uniforms, books, and medical care! Trainees receive a stipend of ₹56,100 per month during cadet training at IMA / INA / AFA.',
    featuredTag: 'Prestigious Defense Commission',
    badgeColor: '#B45309'
  },
  {
    id: 'exam-icar',
    name: 'ICAR AIEEA (CUET-UG)',
    fullName: 'Indian Council of Agricultural Research All India Entrance Exam',
    stream: 'Defense & Agriculture',
    conductingBody: 'National Testing Agency (NTA) mapped through CUET-UG',
    targetCourses: 'B.Sc (Hons) Agriculture, Horticulture, Forestry, Community Science, B.Tech Agricultural Engg across 75+ State & Central Agricultural Universities',
    eligibility: '10+2 with PCB, PCM, PCMB, or Agriculture subjects (min 50% for Gen/OBC, 40% for SC/ST)',
    frequency: 'Annual (May - June)',
    examMode: 'Computer Based Test (Mapped to CUET domain subject papers)',
    keyDates: 'Registration aligns with CUET-UG (Feb - April)',
    officialUrl: 'https://icar.org.in',
    applicationFee: 'Mapped with CUET-UG application fee structure',
    firstGenTips: 'Undergraduate students who secure admission in a state other than their home state receive the ICAR National Talent Scholarship (NTS) of ₹3,000 per month.',
    featuredTag: 'National Talent Scholarship',
    badgeColor: '#15803D'
  }
];

