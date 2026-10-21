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

export const SAMPLE_MENTORS: MentorProfile[] = [
  {
    id: "mentor-1",
    fullName: "Priya Sharma",
    avatar: "PS",
    avatarColor: "#2563EB",
    city: "Patna",
    district: "Patna",
    state: "Bihar",
    email: "priya.sharma@pehlipedhi.demo",
    phone: "+91 98111 22334",
    graduationCollege: "National Institute of Technology (NIT) Trichy",
    degree: "B.Tech in Computer Science & Engineering",
    field: "Engineering & Technology",
    expertise: "JEE Preparation, Engineering Branch Selection, Software Careers",
    graduationYear: "2021",
    languages: ["Hindi", "English", "Bhojpuri"],
    shortBio: "First person in my extended family to pursue an engineering degree. I navigated JEE without expensive coaching from a small town in Bihar. Now working as a Senior Software Engineer and passionate about guiding first-gen students into tech.",
    availability: "Available on Weekends",
    verified: true,
    menteeCount: 14,
    featured: true
  },
  {
    id: "mentor-2",
    fullName: "Dr. Kavitha Murugan",
    avatar: "KM",
    avatarColor: "#0D9488",
    city: "Madurai",
    district: "Madurai",
    state: "Tamil Nadu",
    email: "kavitha.murugan@pehlipedhi.demo",
    phone: "+91 98222 33445",
    graduationCollege: "Madras Medical College (MMC), Chennai",
    degree: "M.B.B.S",
    field: "Medical & Healthcare",
    expertise: "NEET Strategy, Govt Medical College Admission, Rural Healthcare",
    graduationYear: "2020",
    languages: ["Tamil", "English"],
    shortBio: "Daughter of agricultural workers in rural Tamil Nadu. I cracked NEET through state syllabus self-study and completed MBBS. I help students understand medical admissions, bond obligations, and clinical training without fear.",
    availability: "Available 2 hrs/week",
    verified: true,
    menteeCount: 9,
    featured: true
  },
  {
    id: "mentor-3",
    fullName: "Rahul Patil",
    avatar: "RP",
    avatarColor: "#D97706",
    city: "Kolhapur",
    district: "Kolhapur",
    state: "Maharashtra",
    email: "rahul.patil@pehlipedhi.demo",
    phone: "+91 98333 44556",
    graduationCollege: "Savitribai Phule Pune University",
    degree: "B.Com + Chartered Accountant (ICAI)",
    field: "Commerce & Chartered Accountancy",
    expertise: "CA Foundation & Inter, Articleship Guidance, Commerce Degree Roadmaps",
    graduationYear: "2022",
    languages: ["Marathi", "Hindi", "English"],
    shortBio: "First-generation graduate from Kolhapur district. When I began B.Com, nobody at home knew what CA articleship meant. Happy to mentor students on low-cost pathways to financial careers and professional certifications.",
    availability: "Available Saturdays",
    verified: true,
    menteeCount: 11,
    featured: true
  },
  {
    id: "mentor-4",
    fullName: "Md. Tariq Anwar",
    avatar: "TA",
    avatarColor: "#7C3AED",
    city: "Lucknow",
    district: "Lucknow",
    state: "Uttar Pradesh",
    email: "tariq.anwar@pehlipedhi.demo",
    phone: "+91 98444 55667",
    graduationCollege: "Faculty of Law, Jamia Millia Islamia, New Delhi",
    degree: "B.A. LL.B (Hons)",
    field: "Law & Legal Studies",
    expertise: "CLAT & Law Entrances, First-Gen Legal Practice, State Judiciary Prep",
    graduationYear: "2019",
    languages: ["Hindi", "Urdu", "English"],
    shortBio: "First lawyer in my village near Bareilly. Law school culture can initially feel intimidating for first-generation students. I help students navigate legal education, internships, and courtroom confidence.",
    availability: "Available Evenings",
    verified: true,
    menteeCount: 8
  },
  {
    id: "mentor-5",
    fullName: "Sunita Soren",
    avatar: "SS",
    avatarColor: "#059669",
    city: "Ranchi",
    district: "Ranchi",
    state: "Jharkhand",
    email: "sunita.soren@pehlipedhi.demo",
    phone: "+91 98555 66778",
    graduationCollege: "Birsa Agricultural University",
    degree: "M.Sc in Agricultural Science",
    field: "Pure Sciences & Research",
    expertise: "Govt Post-Matric Scholarships, ICAR Admissions, Research Fellowships",
    graduationYear: "2022",
    languages: ["Hindi", "English", "Santhali"],
    shortBio: "From an indigenous tribal community in Jharkhand, first in my family to complete higher education. Knowledge of state scholarships and fee waivers made my education possible. I help students discover legitimate financial aid.",
    availability: "Available Sundays",
    verified: true,
    menteeCount: 16,
    featured: true
  },
  {
    id: "mentor-6",
    fullName: "Anil Kumar Verma",
    avatar: "AV",
    avatarColor: "#EA580C",
    city: "Varanasi",
    district: "Varanasi",
    state: "Uttar Pradesh",
    email: "anil.verma@pehlipedhi.demo",
    phone: "+91 98666 77889",
    graduationCollege: "Banaras Hindu University (BHU)",
    degree: "B.Ed & M.A in History",
    field: "Government Exams & Public Services",
    expertise: "CTET/State TET, Teaching Service Commission, Civil Services Prelims",
    graduationYear: "2018",
    languages: ["Hindi", "English"],
    shortBio: "Son of a small shopkeeper, completed education with hostel stipends at BHU. Currently working as an Assistant Teacher in a Government Inter College. Guiding students through syllabus decoding and self-discipline.",
    availability: "Available Weekdays 7-8 PM",
    verified: true,
    menteeCount: 19
  }
];

export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  fullName: "Aman Kumar",
  email: "aman.student@pehlipedhi.demo",
  phone: "+91 98765 43210",
  city: "Muzaffarpur",
  district: "Muzaffarpur",
  state: "Bihar",
  currentEducationLevel: "Class 12 (Higher Secondary)",
  intendedCourse: "B.Tech in Computer Science / IT",
  preferredLanguage: "Hindi",
  firstGenNote: "Parents run a small grocery store. First in family preparing for national engineering exams."
};

export const INITIAL_MENTOR_PROFILE: MentorProfile = { ...SAMPLE_MENTORS[0] };

export const INITIAL_REQUESTS: MentorshipRequest[] = [
  {
    id: "req-1",
    studentId: "student-1",
    studentName: "Aman Kumar",
    studentEmail: "aman.student@pehlipedhi.demo",
    studentPhone: "+91 98765 43210",
    studentLocation: "Muzaffarpur, Bihar",
    intendedCourse: "B.Tech in Computer Science / IT",
    mentorId: "mentor-1",
    mentorName: "Priya Sharma",
    mentorCollege: "NIT Trichy",
    mentorField: "Engineering & Technology",
    mentorLocation: "Patna, Bihar",
    mentorEmail: "priya.sharma@pehlipedhi.demo",
    mentorPhone: "+91 98111 22334",
    topic: "Guidance on choosing between state engineering colleges vs taking a drop year for JEE",
    studentLanguage: "Hindi",
    preferredContact: "Written Feedback",
    date: "18 Oct 2026",
    status: "Pending",
    statusMessage: "Mentor will review your question soon.",
    mentorResponseNote: ""
  },
  {
    id: "req-2",
    studentId: "student-1",
    studentName: "Aman Kumar",
    studentEmail: "aman.student@pehlipedhi.demo",
    studentPhone: "+91 98765 43210",
    studentLocation: "Muzaffarpur, Bihar",
    intendedCourse: "B.Tech in Computer Science / IT",
    mentorId: "mentor-5",
    mentorName: "Sunita Soren",
    mentorCollege: "Birsa Agricultural University",
    mentorField: "Pure Sciences & Research",
    mentorLocation: "Ranchi, Jharkhand",
    mentorEmail: "sunita.soren@pehlipedhi.demo",
    mentorPhone: "+91 98555 66778",
    topic: "Inquiring about National Scholarship Portal (NSP) documents and timeline for first-gen undergraduates",
    studentLanguage: "Hindi",
    preferredContact: "15-min Weekend Call",
    date: "14 Oct 2026",
    status: "Accepted",
    statusMessage: "Mentor accepted! Contact details and guidance instructions are ready below.",
    mentorResponseNote: "Namaste Aman! Happy to help you with the NSP scholarship process. You can reach out to me via WhatsApp at +91 98555 66778. Make sure you have your family income certificate and 10th/12th marksheets digitized."
  },
  {
    id: "inc-1",
    studentId: "student-2",
    studentName: "Rameshwar Yadav",
    studentEmail: "rameshwar.yadav@pehlipedhi.demo",
    studentPhone: "+91 98123 45678",
    studentLocation: "Samastipur, Bihar",
    intendedCourse: "B.Tech (Electrical / Electronics)",
    mentorId: "mentor-1",
    mentorName: "Priya Sharma",
    topic: "I am the first from my village attempting engineering. Can you advise how to balance 12th board exams with state engineering entrance preparation?",
    studentLanguage: "Hindi",
    preferredContact: "Written Feedback",
    date: "19 Oct 2026",
    status: "Pending",
    mentorResponseNote: ""
  },
  {
    id: "inc-2",
    studentId: "student-3",
    studentName: "Deepa Kushwaha",
    studentEmail: "deepa.kushwaha@pehlipedhi.demo",
    studentPhone: "+91 98234 56789",
    studentLocation: "Gaya, Bihar",
    intendedCourse: "BCA / Computer Applications",
    mentorId: "mentor-1",
    mentorName: "Priya Sharma",
    topic: "Confused between BCA and B.Tech when family budget is tight. What are low-cost reputable government colleges?",
    studentLanguage: "Hindi / English",
    preferredContact: "15-min Weekend Call",
    date: "17 Oct 2026",
    status: "Pending",
    mentorResponseNote: ""
  }
];

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
