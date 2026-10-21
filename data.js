// PehliPeedhi - Demo Data & Constants
// Note: All sample records are explicitly labeled as Demo Data

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi NCR", "Jammu and Kashmir", "Ladakh"
];

const FIELDS_OF_STUDY = [
  "Engineering & Technology",
  "Medical & Healthcare",
  "Commerce & Chartered Accountancy",
  "Arts, Humanities & Social Sciences",
  "Law & Legal Studies",
  "Government Exams & Public Services",
  "Pure Sciences & Research",
  "Vocational & Skill Training"
];

const EDUCATION_LEVELS = [
  "Class 10 (Secondary School)",
  "Class 11 / 12 (Higher Secondary)",
  "Undergraduate - 1st Year",
  "Undergraduate - 2nd/3rd/4th Year",
  "Polytechnic / Diploma",
  "Postgraduate",
  "Preparing for College Entrance"
];

const LANGUAGES_LIST = [
  "Hindi", "English", "Bengali", "Marathi", "Tamil", "Telugu", 
  "Kannada", "Gujarati", "Malayalam", "Odia", "Punjabi", "Bhojpuri", "Urdu", "Assamese"
];

const SAMPLE_MENTORS = [
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
    isDemo: true
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
    isDemo: true
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
    isDemo: true
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
    shortBio: "First lawyer in my village near Bareilly. Law school culture can initially feel intimidating for first-generation students. I help students navigate legal education, internships, and drafting confidence.",
    availability: "Available Evenings",
    isDemo: true
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
    shortBio: "From an indigenous tribal community in Jharkhand, first to complete higher education. Knowledge of state scholarships and fee waivers made my education possible. I help students discover legitimate financial aid.",
    availability: "Available Sundays",
    isDemo: true
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
    shortBio: "Son of a small shopkeeper, completed education with hostel stipends at BHU. Currently working as an Assistant Teacher in a Government Inter College. Guiding students through syllabus decoding and discipline.",
    availability: "Available Weekdays 7-8 PM",
    isDemo: true
  }
];

const INITIAL_STUDENT_PROFILE = {
  fullName: "Aman Kumar",
  email: "aman.student@pehlipedhi.demo",
  phone: "+91 98765 43210",
  city: "Muzaffarpur",
  district: "Muzaffarpur",
  state: "Bihar",
  currentEducationLevel: "Class 12 (Higher Secondary)",
  intendedCourse: "B.Tech in Computer Science / IT",
  preferredLanguage: "Hindi",
  isDemo: true
};

const INITIAL_MENTOR_PROFILE = {
  fullName: "Priya Sharma",
  email: "priya.mentor@pehlipedhi.demo",
  phone: "+91 98111 22334",
  city: "Patna",
  district: "Patna",
  state: "Bihar",
  graduationCollege: "National Institute of Technology (NIT) Trichy",
  degree: "B.Tech in Computer Science & Engineering",
  field: "Engineering & Technology",
  expertise: "JEE Preparation, Engineering Branch Selection, Software Careers",
  graduationYear: "2021",
  languages: "Hindi, English, Bhojpuri",
  shortBio: "First person in my extended family to pursue an engineering degree. I navigated JEE without expensive coaching from a small town in Bihar. Now working as a Senior Software Engineer and passionate about guiding first-gen students into tech.",
  isDemo: true
};

const SAMPLE_SENT_REQUESTS = [
  {
    id: "req-1",
    mentorId: "mentor-1",
    mentorName: "Priya Sharma",
    mentorCollege: "NIT Trichy",
    mentorField: "Engineering & Technology",
    mentorLocation: "Patna, Bihar",
    mentorEmail: "priya.sharma@pehlipedhi.demo",
    mentorPhone: "+91 98111 22334",
    topic: "Guidance on choosing between state engineering colleges vs taking a drop year for JEE",
    studentLanguage: "Hindi",
    date: "18 Oct 2026",
    status: "Pending", // "Pending", "Accepted", "Declined"
    statusMessage: "Mentor will review your question soon.",
    mentorResponseNote: ""
  },
  {
    id: "req-2",
    mentorId: "mentor-5",
    mentorName: "Sunita Soren",
    mentorCollege: "Birsa Agricultural University",
    mentorField: "Pure Sciences & Research",
    mentorLocation: "Ranchi, Jharkhand",
    mentorEmail: "sunita.soren@pehlipedhi.demo",
    mentorPhone: "+91 98555 66778",
    topic: "Inquiring about National Scholarship Portal (NSP) documents and timeline for first-gen undergraduates",
    studentLanguage: "Hindi",
    date: "14 Oct 2026",
    status: "Accepted",
    statusMessage: "Mentor accepted! Contact details and guidance instructions are ready below.",
    mentorResponseNote: "Namaste Aman! Happy to help you with the NSP scholarship process. Please send me a message on WhatsApp or email so I can share the income certificate format and college Bonafide template."
  }
];

const SAMPLE_INCOMING_REQUESTS = [
  {
    id: "inc-1",
    studentName: "Rameshwar Yadav",
    studentEmail: "rameshwar.yadav@pehlipedhi.demo",
    studentPhone: "+91 98123 45678",
    studentCurrentLevel: "Class 12 (Higher Secondary)",
    studentLocation: "Samastipur, Bihar",
    intendedCourse: "B.Tech (Electrical / Electronics)",
    preferredLanguage: "Hindi",
    topic: "I am the first from my village attempting engineering. Can you advise how to balance 12th board exams with state engineering entrance preparation?",
    date: "19 Oct 2026",
    status: "Pending", // "Pending", "Accepted", "Declined"
    mentorResponseNote: ""
  },
  {
    id: "inc-2",
    studentName: "Deepa Kushwaha",
    studentEmail: "deepa.kushwaha@pehlipedhi.demo",
    studentPhone: "+91 98234 56789",
    studentCurrentLevel: "Class 11 (Science)",
    studentLocation: "Gaya, Bihar",
    intendedCourse: "BCA / Computer Applications",
    preferredLanguage: "Hindi / English",
    topic: "Confused between BCA and B.Tech when family budget is tight. What are low-cost reputable government colleges?",
    date: "17 Oct 2026",
    status: "Pending",
    mentorResponseNote: ""
  },
  {
    id: "inc-3",
    studentName: "Sanjay Soren",
    studentEmail: "sanjay.soren@pehlipedhi.demo",
    studentPhone: "+91 98345 67890",
    studentCurrentLevel: "Undergraduate - 1st Year",
    studentLocation: "Dhanbad, Jharkhand",
    intendedCourse: "B.Sc Computer Science",
    preferredLanguage: "Hindi",
    topic: "Need advice on learning programming fundamentals when you did not have a computer in school.",
    date: "12 Oct 2026",
    status: "Accepted",
    mentorResponseNote: "Hi Sanjay! Great question. You can reach out to me directly on WhatsApp at +91 98111 22334 or email me. I recommend starting with free CS50 and practice on phone apps like Replit."
  }
];
