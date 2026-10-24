import { MentorProfile, MentorshipRequest, ResourceItem, StudentProfile } from '../types';

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
  rating: 5.0,
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
