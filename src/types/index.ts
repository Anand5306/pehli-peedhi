export type Role = 'student' | 'mentor' | 'guest';

export type VerificationStatus = 'unverified' | 'pending' | 'verified';

export interface VerificationData {
  status: VerificationStatus;
  documentType?: string;
  documentNumber?: string;
  institutionName?: string;
  documentFileName?: string;
  firstGenDeclaration?: boolean;
  verifiedAt?: string;
  submittedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  avatar?: string;
  verified?: boolean;
}

export interface StudentProfile {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  district: string;
  state: string;
  currentEducationLevel: string;
  intendedCourse: string;
  preferredLanguage: string;
  firstGenNote?: string;
  verified?: boolean;
  verificationStatus?: VerificationStatus;
  verificationData?: VerificationData;
}

export interface MentorReview {
  id: string;
  mentorId: string;
  studentId: string;
  studentName: string;
  rating: number; // 1 to 5 stars
  comment?: string;
  tags?: string[];
  date: string;
  meetingDate?: string;
  meetingTime?: string;
  meetingScheduledTime?: string;
  topic?: string;
  requestId?: string;
}

export interface MentorProfile {
  id: string;
  fullName: string;
  avatar: string;
  avatarColor: string;
  city: string;
  district: string;
  state: string;
  email: string;
  phone: string;
  graduationCollege: string;
  degree: string;
  field: string;
  expertise: string;
  graduationYear: string;
  languages: string[];
  shortBio: string;
  availability: string;
  verified: boolean;
  menteeCount: number;
  featured?: boolean;
  verificationStatus?: VerificationStatus;
  verificationData?: VerificationData;
  rating?: number; // Average star rating e.g. 4.9
  reviewCount?: number; // Total count of student reviews
  reviews?: MentorReview[];
}

export interface MentorshipRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  studentLocation?: string;
  intendedCourse?: string;
  mentorId: string;
  mentorName: string;
  mentorCollege?: string;
  mentorField?: string;
  mentorLocation?: string;
  mentorEmail?: string;
  mentorPhone?: string;
  topic: string;
  studentLanguage: string;
  preferredContact: string;
  date: string;
  status: 'Pending' | 'Accepted' | 'Declined' | 'Completed';
  statusMessage?: string;
  mentorResponseNote?: string;
  meetingLink?: string;
  meetingDate?: string;
  meetingTime?: string;
  meetingScheduledTime?: string;
  meetingEmailSent?: boolean;
  meetingCompleted?: boolean;
  meetingCompletedAt?: string;
  rating?: number;
  feedback?: {
    rating: number; // 1 to 5
    comment?: string;
    tags?: string[];
    submittedAt: string;
    meetingDate?: string;
    meetingTime?: string;
  };
}

export interface ResourceItem {
  id: string;
  title: string;
  category: 'Scholarship' | 'Admission Guide' | 'Financial Aid' | 'College Life';
  description: string;
  eligibility: string;
  deadline?: string;
  amountOrBenefit?: string;
  officialLink: string;
  featuredTag?: string;
}

export interface EntranceExam {
  id: string;
  name: string;
  fullName: string;
  stream: string;
  conductingBody: string;
  targetCourses: string;
  eligibility: string;
  frequency: string;
  examMode: string;
  keyDates: string;
  officialUrl: string;
  applicationFee?: string;
  firstGenTips?: string;
  featuredTag?: string;
  badgeColor?: string;
}

