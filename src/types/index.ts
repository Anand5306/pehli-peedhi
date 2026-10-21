export type Role = 'student' | 'mentor' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  avatar?: string;
}

export interface StudentProfile {
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
  status: 'Pending' | 'Accepted' | 'Declined';
  statusMessage?: string;
  mentorResponseNote?: string;
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
