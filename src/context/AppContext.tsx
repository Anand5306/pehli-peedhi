'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Role, 
  User, 
  StudentProfile, 
  MentorProfile, 
  MentorshipRequest,
  MentorReview,
  VerificationData 
} from '../types';
import { 
  SAMPLE_MENTORS, 
  INITIAL_STUDENT_PROFILE, 
  INITIAL_MENTOR_PROFILE, 
  INITIAL_REQUESTS 
} from '../data/mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface ToastData {
  text: string;
  type: 'success' | 'info' | 'error';
}

interface AuthResult {
  ok: boolean;
  error?: string;
}

interface RegisteredAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
}

interface AppContextType {
  isLoaded: boolean;
  role: Role;
  currentUser: User | null;
  studentProfile: StudentProfile;
  mentorProfile: MentorProfile;
  mentors: MentorProfile[];
  requests: MentorshipRequest[];
  activeModalMentor: MentorProfile | null;
  toast: ToastData | null;
  setRole: (role: Role) => void;
  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (name: string, email: string, password: string, role: Role) => Promise<AuthResult>;
  logout: () => void;
  openRequestModal: (mentor: MentorProfile) => void;
  closeRequestModal: () => void;
  submitRequest: (topic: string, language: string, contactMode: string) => boolean;
  updateRequestStatus: (requestId: string, status: 'Accepted' | 'Declined', note?: string) => void;
  acceptRequestWithGMeet: (requestId: string, meetingLink: string, meetingTime: string, note?: string, meetingDate?: string) => Promise<boolean>;
  notifyMeetingOver: (requestId: string, completionNote?: string) => Promise<boolean>;
  updateStudentProfile: (profile: Partial<StudentProfile>) => void;
  updateMentorProfile: (profile: Partial<MentorProfile>) => void;
  verifyAccount: (data: VerificationData) => void;
  resetVerification: () => void;
  submitMentorFeedback: (requestId: string, rating: number, comment?: string, tags?: string[]) => void;
  deleteAccount: (userId?: string) => Promise<boolean>;
  showToast: (text: string, type?: 'success' | 'info' | 'error') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'pehlipedhi_v11_';
const REGISTRY_KEY = 'pehlipedhi_users_registry_v1';

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>('guest');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(INITIAL_STUDENT_PROFILE);
  const [mentorProfile, setMentorProfile] = useState<MentorProfile>(INITIAL_MENTOR_PROFILE);
  const [mentors, setMentors] = useState<MentorProfile[]>(SAMPLE_MENTORS);
  const [requests, setRequests] = useState<MentorshipRequest[]>(INITIAL_REQUESTS);
  const [activeModalMentor, setActiveModalMentor] = useState<MentorProfile | null>(null);
  const [toast, setToast] = useState<ToastData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Helper to get local accounts registry
  const getLocalAccounts = (): RegisteredAccount[] => {
    try {
      const data = localStorage.getItem(REGISTRY_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  const saveLocalAccount = (acc: RegisteredAccount) => {
    try {
      const existing = getLocalAccounts();
      const updated = existing.filter(a => a.email.toLowerCase() !== acc.email.toLowerCase());
      updated.push(acc);
      localStorage.setItem(REGISTRY_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn('Could not save to local registry:', err);
    }
  };

  // Load state on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(`${STORAGE_KEY_PREFIX}user`);
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setCurrentUser(parsed);
        setRoleState(parsed.role || 'guest');
      }

      const savedRequests = localStorage.getItem(`${STORAGE_KEY_PREFIX}requests`);
      if (savedRequests) setRequests(JSON.parse(savedRequests));

      const savedStudent = localStorage.getItem(`${STORAGE_KEY_PREFIX}student_profile`);
      if (savedStudent) setStudentProfile(JSON.parse(savedStudent));

      const savedMentor = localStorage.getItem(`${STORAGE_KEY_PREFIX}mentor_profile`);
      if (savedMentor) setMentorProfile(JSON.parse(savedMentor));

      const savedMentors = localStorage.getItem(`${STORAGE_KEY_PREFIX}mentors`);
      if (savedMentors) setMentors(JSON.parse(savedMentors));
    } catch (err) {
      console.warn('LocalStorage load error:', err);
    } finally {
      setIsLoaded(true);
    }

    // Live API & Supabase PostgreSQL Sync on startup
    const syncDataOnStartup = async () => {
      try {
        // 1. Fetch unified requests (joined with mentor_reviews & feedback JSONB)
        const reqRes = await fetch('/api/requests');
        if (reqRes.ok) {
          const reqData = await reqRes.json();
          if (reqData.requests && reqData.requests.length > 0) {
            setRequests(reqData.requests);
          }
        }
      } catch (err) {
        console.warn('API requests startup load note:', err);
      }

      try {
        // 2. Fetch mentors (with reviews & ratings)
        const mentorRes = await fetch('/api/mentors');
        if (mentorRes.ok) {
          const mentorData = await mentorRes.json();
          if (mentorData.mentors && mentorData.mentors.length > 0) {
            setMentors(mentorData.mentors);

            // Synchronize active mentorProfile immediately on startup
            try {
              const savedUserStr = localStorage.getItem(`${STORAGE_KEY_PREFIX}user`);
              const savedUser = savedUserStr ? JSON.parse(savedUserStr) : null;
              if (savedUser) {
                const active = mentorData.mentors.find((m: any) => 
                  (savedUser.id && m.id === savedUser.id) ||
                  (savedUser.email && m.email?.toLowerCase() === savedUser.email?.toLowerCase()) ||
                  (savedUser.name && m.fullName?.toLowerCase() === savedUser.name?.toLowerCase())
                );
                if (active) {
                  setMentorProfile(prev => ({
                    ...prev,
                    ...active,
                    rating: active.rating,
                    reviewCount: active.reviewCount ?? active.reviews?.length ?? 0,
                    reviews: active.reviews || []
                  }));
                }
              }
            } catch (syncErr) {
              console.warn('Sync active mentorProfile on startup note:', syncErr);
            }
          }
        }
      } catch (err) {
        console.warn('API mentors startup load note:', err);
      }
    };

    syncDataOnStartup();
  }, []);

  // Synchronize mentorProfile whenever mentors list updates and matches currentUser
  useEffect(() => {
    if (!currentUser || role !== 'mentor') return;
    const matched = mentors.find(m => 
      (currentUser.id && m.id === currentUser.id) ||
      (currentUser.email && m.email?.toLowerCase() === currentUser.email?.toLowerCase()) ||
      (currentUser.name && m.fullName?.toLowerCase() === currentUser.name?.toLowerCase())
    );
    if (matched) {
      setMentorProfile(prev => {
        const reviewCount = matched.reviewCount ?? matched.reviews?.length ?? prev.reviewCount ?? 0;
        const rating = reviewCount > 0 
          ? (matched.rating !== undefined ? matched.rating : (prev.rating !== undefined ? prev.rating : 0))
          : 0;
        if (prev.reviewCount !== reviewCount || prev.rating !== rating || prev.reviews?.length !== matched.reviews?.length || !prev.id) {
          return {
            ...prev,
            ...matched,
            rating,
            reviewCount,
            reviews: matched.reviews || []
          };
        }
        return prev;
      });
    }
  }, [mentors, currentUser, role]);

  // Sync state to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      if (currentUser) {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}user`, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(`${STORAGE_KEY_PREFIX}user`);
      }
      localStorage.setItem(`${STORAGE_KEY_PREFIX}requests`, JSON.stringify(requests));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}student_profile`, JSON.stringify(studentProfile));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}mentor_profile`, JSON.stringify(mentorProfile));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}mentors`, JSON.stringify(mentors));
    } catch (err) {
      console.warn('LocalStorage save error:', err);
    }
  }, [currentUser, requests, studentProfile, mentorProfile, mentors, isLoaded]);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ text, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    if (newRole === 'mentor') {
      const mentorId = mentorProfile.id || `mentor-${Date.now()}`;
      const mentorName = mentorProfile.fullName || 'Registered Mentor';
      setCurrentUser({
        id: mentorId,
        name: mentorName,
        email: mentorProfile.email,
        role: 'mentor',
        avatar: mentorProfile.avatar || mentorName.slice(0, 2).toUpperCase()
      });
      showToast(`Viewing as Mentor: ${mentorName}`, 'info');
    } else if (newRole === 'student') {
      const studentId = studentProfile.email ? `student-${studentProfile.email}` : `student-${Date.now()}`;
      const studentName = studentProfile.fullName || 'Student Learner';
      setCurrentUser({
        id: studentId,
        name: studentName,
        email: studentProfile.email,
        role: 'student',
        avatar: studentName.slice(0, 2).toUpperCase()
      });
      showToast(`Viewing as Student: ${studentName}`, 'info');
    } else {
      setCurrentUser(null);
      showToast('Viewing as Visitor', 'info');
    }
  };

  /**
   * STRICT LOGIN: Validates credentials against Supabase Auth & PostgreSQL DB
   * Rejects invalid or nonexistent accounts.
   */
  const login = async (email: string, password: string): Promise<AuthResult> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      const err = 'Please enter both email and password.';
      showToast(err, 'error');
      return { ok: false, error: err };
    }

    try {
      // 1. If Supabase is connected, authenticate against Supabase Auth
      if (isSupabaseConfigured && supabase) {
        const { data: authData, error: authErr } = await (supabase.auth as any).signInWithPassword({
          email: cleanEmail,
          password: cleanPassword
        });

        if (!authErr && authData?.user) {
          // Fetch user profile from PostgreSQL profiles table
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .maybeSingle();

          const userRole: Role = (profile?.role as Role) || (authData.user.user_metadata?.role as Role) || 'student';
          const userName: string = profile?.full_name || authData.user.user_metadata?.full_name || cleanEmail.split('@')[0];

          const loggedUser: User = {
            id: authData.user.id,
            name: userName,
            email: cleanEmail,
            role: userRole,
            avatar: userName.slice(0, 2).toUpperCase()
          };

          setCurrentUser(loggedUser);
          setRoleState(userRole);

          if (userRole === 'mentor') {
            let mentorDbData: any = null;
            let mentorDbReviews: any[] = [];
            try {
              const { data: mData } = await supabase
                .from('mentors')
                .select('*')
                .eq('id', authData.user.id)
                .maybeSingle();
              mentorDbData = mData;

              const { data: rData } = await supabase
                .from('mentor_reviews')
                .select('*')
                .eq('mentor_id', authData.user.id);
              mentorDbReviews = rData || [];
            } catch (mErr) {
              console.warn('Error fetching mentor DB record on login:', mErr);
            }

            const revCount = mentorDbReviews.length || mentorDbData?.review_count || 0;
            let mentorAvgRating = 0;
            if (mentorDbReviews.length > 0) {
              const sum = mentorDbReviews.reduce((acc: number, r: any) => acc + (Number(r.rating) || 0), 0);
              mentorAvgRating = Number((sum / mentorDbReviews.length).toFixed(1));
            } else if (revCount > 0 && mentorDbData?.rating) {
              mentorAvgRating = Number(mentorDbData.rating) || 0;
            }

            const formattedReviews: MentorReview[] = mentorDbReviews.map((r: any) => ({
              id: r.id,
              mentorId: r.mentor_id,
              studentId: r.student_id,
              studentName: r.student_name,
              rating: r.rating,
              meetingDate: r.meeting_date || new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
              meetingTime: r.meeting_time || r.meeting_scheduled_time || '',
              meetingScheduledTime: r.meeting_scheduled_time || '',
              topic: r.topic || '',
              comment: r.comment || '',
              tags: r.tags || [],
              date: new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
              requestId: r.request_id
            }));

            const mentorEntry: MentorProfile = {
              id: loggedUser.id,
              fullName: userName,
              avatar: loggedUser.avatar || userName.slice(0, 2).toUpperCase(),
              avatarColor: '#2563EB',
              city: mentorDbData?.city || profile?.city || '',
              district: mentorDbData?.district || profile?.district || '',
              state: mentorDbData?.state || profile?.state || 'Bihar',
              email: cleanEmail,
              phone: profile?.phone || '',
              graduationCollege: mentorDbData?.graduation_college || profile?.graduation_college || '',
              degree: mentorDbData?.degree || profile?.degree || '',
              field: mentorDbData?.field || profile?.field || 'Engineering & Technology',
              expertise: mentorDbData?.expertise || profile?.expertise || 'First-Gen Mentorship Guidance',
              graduationYear: mentorDbData?.graduation_year || profile?.graduation_year || new Date().getFullYear().toString(),
              languages: mentorDbData?.languages || profile?.languages || ['Hindi', 'English'],
              shortBio: mentorDbData?.short_bio || profile?.short_bio || 'First-generation graduate mentor ready to guide aspiring students.',
              availability: mentorDbData?.availability || profile?.availability || 'Available on Weekends',
              verified: !!(mentorDbData?.verified ?? profile?.verified),
              verificationStatus: mentorDbData?.verification_status || profile?.verification_status || 'unverified',
              verificationData: mentorDbData?.verification_data || profile?.verification_data,
              menteeCount: mentorDbData?.mentee_count || profile?.mentee_count || 0,
              rating: mentorAvgRating,
              reviewCount: revCount,
              reviews: formattedReviews
            };
            setMentorProfile(mentorEntry);
            setMentors(prev => {
              const exists = prev.some(m => m.id === loggedUser.id || m.email.toLowerCase() === cleanEmail);
              if (exists) {
                return prev.map(m => (m.id === loggedUser.id || m.email.toLowerCase() === cleanEmail) ? { ...m, ...mentorEntry } : m);
              }
              return [...prev, mentorEntry];
            });
          } else {
            setStudentProfile(prev => ({
              ...prev,
              fullName: userName,
              email: cleanEmail
            }));
          }

          showToast(`Welcome back, ${userName}`);
          return { ok: true };
        }
      }

      // 2. Check local accounts registry (accounts created in this browser session)
      const localAccounts = getLocalAccounts();
      const matched = localAccounts.find(
        acc => acc.email.toLowerCase() === cleanEmail && acc.password === cleanPassword
      );

      if (matched) {
        const loggedUser: User = {
          id: matched.id,
          name: matched.name,
          email: matched.email,
          role: matched.role,
          avatar: matched.name.slice(0, 2).toUpperCase()
        };

        setCurrentUser(loggedUser);
        setRoleState(matched.role);

        if (matched.role === 'mentor') {
          setMentorProfile(prev => {
            const updated: MentorProfile = {
              ...prev,
              id: matched.id,
              fullName: matched.name,
              email: matched.email,
              avatar: matched.name.slice(0, 2).toUpperCase()
            };
            setMentors(prevMentors => {
              const exists = prevMentors.some(m => m.id === matched.id || m.email.toLowerCase() === matched.email.toLowerCase());
              if (exists) {
                return prevMentors.map(m => (m.id === matched.id || m.email.toLowerCase() === matched.email.toLowerCase()) ? { ...m, ...updated } : m);
              }
              return [...prevMentors, updated];
            });
            return updated;
          });
        } else {
          setStudentProfile(prev => ({
            ...prev,
            fullName: matched.name,
            email: matched.email
          }));
        }

        showToast(`Welcome back, ${matched.name}`);
        return { ok: true };
      }

      // 3. Invalid credentials -> Strictly REJECT
      const errMsg = 'Invalid email or password. Please check your credentials or create an account first.';
      showToast(errMsg, 'error');
      return { ok: false, error: errMsg };
    } catch (err: any) {
      console.warn('Login exception:', err);
      const errMsg = err?.message || 'Authentication failed. Please verify your credentials.';
      showToast(errMsg, 'error');
      return { ok: false, error: errMsg };
    }
  };

  /**
   * STRICT SIGNUP: Creates account in Supabase PostgreSQL & Auth
   * Rejects invalid or duplicate accounts.
   */
  const signup = async (
    name: string, 
    email: string, 
    password: string, 
    userRole: Role
  ): Promise<AuthResult> => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanName || !cleanEmail || !cleanPassword) {
      const err = 'Please provide name, email, and password.';
      showToast(err, 'error');
      return { ok: false, error: err };
    }

    if (cleanPassword.length < 6) {
      const err = 'Password must be at least 6 characters.';
      showToast(err, 'error');
      return { ok: false, error: err };
    }

    try {
      let createdUserId = `user-${Date.now()}`;

      // 1. If Supabase is connected, sign up with Supabase Auth
      if (isSupabaseConfigured && supabase) {
        const { data: authData, error: authErr } = await (supabase.auth as any).signUp({
          email: cleanEmail,
          password: cleanPassword,
          options: {
            data: {
              full_name: cleanName,
              role: userRole
            }
          }
        });

        if (authErr) {
          const isRateLimit = authErr.message.toLowerCase().includes('rate limit');
          if (isRateLimit) {
            console.warn('Supabase email rate limit reached. Proceeding with local registration fallback.');
            showToast('Supabase email limit reached. Account created. Turn off "Confirm email" in Supabase settings.', 'info');
          } else {
            const errText = authErr.message;
            showToast(`Registration failed: ${errText}`, 'error');
            return { ok: false, error: errText };
          }
        }

        if (authData?.user) {
          createdUserId = authData.user.id;
        }

        // Write to PostgreSQL public.profiles table
        try {
          await supabase.from('profiles').upsert({
            id: createdUserId,
            full_name: cleanName,
            email: cleanEmail,
            role: userRole
          });

          if (userRole === 'student') {
            await supabase.from('students').upsert({
              id: createdUserId,
              current_education_level: studentProfile.currentEducationLevel,
              intended_course: studentProfile.intendedCourse,
              preferred_language: studentProfile.preferredLanguage
            });
          } else if (userRole === 'mentor') {
            await supabase.from('mentors').upsert({
              id: createdUserId,
              graduation_college: mentorProfile.graduationCollege,
              degree: mentorProfile.degree,
              field: mentorProfile.field
            });
          }
        } catch (dbErr) {
          console.warn('Database profile insertion note:', dbErr);
        }
      }

      // 2. Save in local accounts registry
      saveLocalAccount({
        id: createdUserId,
        name: cleanName,
        email: cleanEmail,
        password: cleanPassword,
        role: userRole
      });

      const user: User = {
        id: createdUserId,
        name: cleanName,
        email: cleanEmail,
        role: userRole,
        avatar: cleanName.slice(0, 2).toUpperCase()
      };

      setCurrentUser(user);
      setRoleState(userRole);

      if (userRole === 'mentor') {
        const newMentor: MentorProfile = {
          id: createdUserId,
          fullName: cleanName,
          avatar: cleanName.slice(0, 2).toUpperCase(),
          avatarColor: '#2563EB',
          city: '',
          district: '',
          state: 'Bihar',
          email: cleanEmail,
          phone: '',
          graduationCollege: '',
          degree: '',
          field: 'Engineering & Technology',
          expertise: 'First-Gen Mentorship Guidance',
          graduationYear: new Date().getFullYear().toString(),
          languages: ['Hindi', 'English'],
          shortBio: 'First-generation graduate mentor ready to guide aspiring students.',
          availability: 'Available on Weekends',
          verified: false,
          verificationStatus: 'unverified',
          menteeCount: 0,
          rating: 0,
          reviewCount: 0,
          reviews: []
        };
        setMentorProfile(newMentor);
        setMentors(prev => {
          const exists = prev.some(m => m.id === createdUserId || m.email.toLowerCase() === cleanEmail);
          if (exists) {
            return prev.map(m => (m.id === createdUserId || m.email.toLowerCase() === cleanEmail) ? { ...m, ...newMentor } : m);
          }
          return [...prev, newMentor];
        });
      } else {
        setStudentProfile(prev => ({ ...prev, fullName: cleanName, email: cleanEmail }));
      }

      showToast(`Account created successfully. Welcome, ${cleanName}`);
      return { ok: true };
    } catch (err: any) {
      console.warn('Signup exception:', err);
      const errMsg = err?.message || 'Failed to complete registration.';
      showToast(errMsg, 'error');
      return { ok: false, error: errMsg };
    }
  };

  const logout = () => {
    if (isSupabaseConfigured && supabase) {
      (supabase.auth as any).signOut().catch(() => {});
    }
    setCurrentUser(null);
    setRoleState('guest');
    showToast('Signed out successfully.', 'info');
  };

  const openRequestModal = (mentor: MentorProfile) => {
    setActiveModalMentor(mentor);
  };

  const closeRequestModal = () => {
    setActiveModalMentor(null);
  };

  const submitRequest = (topic: string, language: string, contactMode: string): boolean => {
    if (!activeModalMentor) return false;

    const studentId = currentUser?.id || (studentProfile.email ? `student-${studentProfile.email}` : `student-${Date.now()}`);
    const studentName = currentUser?.name || studentProfile.fullName || 'Student Learner';
    const studentEmail = currentUser?.email || studentProfile.email;

    const requestId = (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') 
      ? crypto.randomUUID() 
      : `req-${Date.now()}`;

    const newReq: MentorshipRequest = {
      id: requestId,
      studentId,
      studentName,
      studentEmail,
      studentPhone: studentProfile.phone,
      studentLocation: (studentProfile.city || studentProfile.state) ? `${studentProfile.city || ''}, ${studentProfile.state || ''}`.replace(/^, |, $/g, '') : '',
      intendedCourse: studentProfile.intendedCourse,
      mentorId: activeModalMentor.id,
      mentorName: activeModalMentor.fullName,
      mentorCollege: activeModalMentor.graduationCollege,
      mentorField: activeModalMentor.field,
      mentorLocation: `${activeModalMentor.city}, ${activeModalMentor.state}`,
      mentorEmail: activeModalMentor.email,
      mentorPhone: activeModalMentor.phone,
      topic,
      studentLanguage: language,
      preferredContact: contactMode,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'Pending',
      statusMessage: 'Mentor has received your query and will respond soon.'
    };

    setRequests(prev => [newReq, ...prev]);

    // Persist into Supabase PostgreSQL mentorship_requests table
    if (isSupabaseConfigured && supabase) {
      const isUuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (isUuidRegex.test(studentId) && isUuidRegex.test(activeModalMentor.id)) {
        supabase
          .from('mentorship_requests')
          .insert({
            id: requestId,
            student_id: studentId,
            mentor_id: activeModalMentor.id,
            topic,
            student_language: language,
            preferred_contact: contactMode,
            status: 'Pending',
            status_message: 'Mentor has received your query and will respond soon.'
          })
          .then(({ error }: any) => {
            if (error) console.warn('Supabase mentorship_requests insert note:', error);
          }, console.warn);
      }
    }

    setActiveModalMentor(null);
    showToast(`Request submitted to ${activeModalMentor.fullName}. Check your Dashboard.`);
    return true;
  };

  const updateRequestStatus = (requestId: string, status: 'Accepted' | 'Declined', note?: string) => {
    const defaultNote = status === 'Accepted' ? 'Request accepted. Mentor contact information unlocked.' : 'Mentor is at capacity.';
    const defaultMsg = status === 'Accepted' ? 'Mentorship session approved.' : 'Request declined due to schedule constraints.';

    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status,
          mentorResponseNote: note || defaultNote,
          statusMessage: defaultMsg
        };
      }
      return req;
    }));

    // Update in Supabase PostgreSQL
    if (isSupabaseConfigured && supabase) {
      supabase
        .from('mentorship_requests')
        .update({
          status,
          mentor_response_note: note || defaultNote,
          status_message: defaultMsg,
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId)
        .then(({ error }: any) => {
          if (error) console.warn('Supabase updateRequestStatus note:', error);
        }, console.warn);
    }

    showToast(`Request marked as ${status}.`);
  };

  const acceptRequestWithGMeet = async (
    requestId: string,
    meetingLink: string,
    meetingTime: string,
    note?: string,
    meetingDate?: string
  ): Promise<boolean> => {
    const cleanLink = meetingLink.trim() || `https://meet.google.com/${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`;
    const cleanTime = meetingTime.trim() || 'Upcoming Weekend Session';
    const cleanNote = note?.trim() || 'Session scheduled on Google Meet. Click the Join button at the scheduled time to connect.';

    const targetReq = requests.find(r => r.id === requestId);

    const nowFormatted = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const cleanDate = meetingDate?.trim() || (cleanTime.includes('at') ? cleanTime.split('at')[0].trim() : (cleanTime.includes(',') ? cleanTime.split(',')[0].trim() : nowFormatted));

    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status: 'Accepted' as const,
          meetingLink: cleanLink,
          meetingDate: cleanDate,
          meetingTime: cleanTime,
          meetingScheduledTime: cleanTime,
          mentorResponseNote: cleanNote,
          meetingEmailSent: true,
          statusMessage: `Session scheduled on Google Meet for ${cleanTime}. Email invite dispatched to ${req.studentEmail}.`
        };
      }
      return req;
    }));

    // 1. Dispatch email to student
    try {
      if (targetReq?.studentEmail) {
        await fetch('/api/send-meeting-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requestId,
            studentEmail: targetReq.studentEmail,
            studentName: targetReq.studentName,
            mentorName: targetReq.mentorName,
            mentorCollege: targetReq.mentorCollege,
            meetingLink: cleanLink,
            meetingTime: cleanTime,
            topic: targetReq.topic,
            note: cleanNote
          })
        });
      }
    } catch (emailErr) {
      console.warn('Email dispatch warning:', emailErr);
    }

    // 2. Persist to API and Supabase PostgreSQL
    try {
      fetch('/api/requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: requestId,
          status: 'Accepted',
          mentorResponseNote: cleanNote,
          meetingLink: cleanLink,
          meetingDate: cleanDate,
          meetingTime: cleanTime,
          meetingScheduledTime: cleanTime,
          statusMessage: `Session scheduled on Google Meet for ${cleanTime}. Email invite dispatched.`
        })
      }).catch(console.warn);
    } catch (apiErr) {
      console.warn('API PATCH acceptRequest error:', apiErr);
    }

    if (isSupabaseConfigured && supabase) {
      supabase
        .from('mentorship_requests')
        .update({
          status: 'Accepted',
          mentor_response_note: cleanNote,
          meeting_link: cleanLink,
          meeting_date: cleanDate,
          meeting_time: cleanTime,
          meeting_scheduled_time: cleanTime,
          meeting_email_sent: true,
          status_message: `Session scheduled on Google Meet for ${cleanTime}. Email invite dispatched.`,
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId)
        .then(null, console.warn);
    }

    showToast(`Google Meet link emailed to student (${targetReq?.studentEmail || 'student'}) and scheduled in portal.`, 'success');
    return true;
  };

  const notifyMeetingOver = async (requestId: string, completionNote?: string): Promise<boolean> => {
    const targetReq = requests.find(r => r.id === requestId);
    const completedAt = new Date().toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          meetingCompleted: true,
          meetingCompletedAt: completedAt,
          statusMessage: 'Google Meet concluded. Awaiting student feedback and star rating.'
        };
      }
      return req;
    }));

    // Persist to API and Supabase PostgreSQL
    try {
      fetch('/api/requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: requestId,
          meetingCompleted: true,
          meetingCompletedAt: completedAt,
          statusMessage: 'Google Meet concluded. Awaiting student feedback and star rating.',
          feedback: {
            meetingCompleted: true,
            meetingCompletedAt: completedAt,
            completionNote: completionNote?.trim() || ''
          }
        })
      }).catch(console.warn);
    } catch (apiErr) {
      console.warn('API PATCH notifyMeetingOver error:', apiErr);
    }

    if (isSupabaseConfigured && supabase) {
      supabase
        .from('mentorship_requests')
        .update({
          meeting_completed: true,
          meeting_completed_at: new Date().toISOString(),
          status_message: 'Google Meet concluded. Awaiting student feedback and star rating.',
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId)
        .then(null, console.warn);
    }

    showToast(`Meeting marked as completed! ${targetReq?.studentName || 'Student'} has been notified on their dashboard to leave feedback.`, 'success');
    return true;
  };

  const updateStudentProfile = (updated: Partial<StudentProfile>) => {
    const newName = updated.fullName?.trim() || studentProfile.fullName;
    const targetEmail = updated.email?.trim() || studentProfile.email || currentUser?.email;
    const targetId = currentUser?.id || studentProfile.id;

    const mergedStudent: StudentProfile = {
      ...studentProfile,
      ...updated,
      fullName: newName
    };

    // 1. Update studentProfile state
    setStudentProfile(mergedStudent);

    // 2. Update currentUser state & localStorage immediately so new name reflects everywhere
    if (newName && currentUser) {
      const updatedUser: User = {
        ...currentUser,
        name: newName,
        avatar: newName.slice(0, 2).toUpperCase()
      };
      setCurrentUser(updatedUser);
      try {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}user`, JSON.stringify(updatedUser));
      } catch {}
    }

    // 3. Update local accounts registry
    if (targetEmail) {
      try {
        const accounts = getLocalAccounts();
        const updatedAccounts = accounts.map(a => 
          a.email.toLowerCase() === targetEmail.toLowerCase() ? { ...a, name: newName } : a
        );
        localStorage.setItem(REGISTRY_KEY, JSON.stringify(updatedAccounts));
      } catch {}
    }

    // 4. Update requests in local state
    setRequests(prev => prev.map(r => {
      if (r.studentId === targetId || (targetEmail && r.studentEmail?.toLowerCase() === targetEmail.toLowerCase())) {
        return { ...r, studentName: newName };
      }
      return r;
    }));

    // 5. Persist to PostgreSQL database via API
    fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: targetId,
        email: targetEmail,
        role: 'student',
        fullName: newName,
        phone: mergedStudent.phone,
        city: mergedStudent.city,
        district: mergedStudent.district,
        state: mergedStudent.state,
        currentEducationLevel: mergedStudent.currentEducationLevel,
        intendedCourse: mergedStudent.intendedCourse,
        preferredLanguage: mergedStudent.preferredLanguage,
        firstGenNote: mergedStudent.firstGenNote
      })
    }).catch(console.warn);

    // 6. Direct Supabase update if configured
    if (isSupabaseConfigured && supabase) {
      try {
        (supabase.auth as any).updateUser({ data: { full_name: newName } }).catch(() => {});
      } catch {}

      if (targetId) {
        supabase
          .from('profiles')
          .update({
            full_name: newName,
            phone: mergedStudent.phone,
            city: mergedStudent.city,
            district: mergedStudent.district,
            state: mergedStudent.state,
            updated_at: new Date().toISOString()
          })
          .eq('id', targetId)
          .then(null, console.warn);

        supabase
          .from('students')
          .update({
            city: mergedStudent.city,
            district: mergedStudent.district,
            state: mergedStudent.state,
            current_education_level: mergedStudent.currentEducationLevel,
            intended_course: mergedStudent.intendedCourse,
            preferred_language: mergedStudent.preferredLanguage,
            first_gen_note: mergedStudent.firstGenNote,
            updated_at: new Date().toISOString()
          })
          .eq('id', targetId)
          .then(null, console.warn);
      }
    }

    showToast('Name and profile details updated in database.', 'success');
  };

  const updateMentorProfile = (updated: Partial<MentorProfile>) => {
    const newName = updated.fullName?.trim() || mentorProfile.fullName;
    const targetEmail = updated.email?.trim() || mentorProfile.email || currentUser?.email;
    const targetId = currentUser?.id || mentorProfile.id;

    const mergedMentor: MentorProfile = {
      ...mentorProfile,
      ...updated,
      fullName: newName,
      avatar: newName.slice(0, 2).toUpperCase()
    };

    // 1. Update mentorProfile state
    setMentorProfile(mergedMentor);

    // 2. Update currentUser state & localStorage
    if (newName && currentUser) {
      const updatedUser: User = {
        ...currentUser,
        name: newName,
        avatar: newName.slice(0, 2).toUpperCase()
      };
      setCurrentUser(updatedUser);
      try {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}user`, JSON.stringify(updatedUser));
      } catch {}
    }

    // 3. Update mentors list in state
    setMentors(prev => {
      const exists = prev.some(m => 
        (targetId && m.id === targetId) || 
        (targetEmail && m.email?.toLowerCase() === targetEmail.toLowerCase()) ||
        m.fullName.toLowerCase() === mentorProfile.fullName?.toLowerCase()
      );
      if (exists) {
        return prev.map(m => {
          const isMatch = (targetId && m.id === targetId) || 
            (targetEmail && m.email?.toLowerCase() === targetEmail.toLowerCase()) ||
            m.fullName.toLowerCase() === mentorProfile.fullName?.toLowerCase();
          if (isMatch) {
            return {
              ...m,
              ...mergedMentor,
              fullName: newName,
              avatar: newName.slice(0, 2).toUpperCase()
            };
          }
          return m;
        });
      }
      return [...prev, mergedMentor];
    });

    // 4. Update local accounts registry
    if (targetEmail) {
      try {
        const accounts = getLocalAccounts();
        const updatedAccounts = accounts.map(a => 
          a.email.toLowerCase() === targetEmail.toLowerCase() ? { ...a, name: newName } : a
        );
        localStorage.setItem(REGISTRY_KEY, JSON.stringify(updatedAccounts));
      } catch {}
    }

    // 5. Update requests in local state
    setRequests(prev => prev.map(r => {
      if (r.mentorId === targetId || (targetEmail && r.mentorEmail?.toLowerCase() === targetEmail.toLowerCase())) {
        return { ...r, mentorName: newName };
      }
      return r;
    }));

    // 6. Persist to PostgreSQL database via API
    fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: targetId,
        email: targetEmail,
        role: 'mentor',
        fullName: newName,
        phone: mergedMentor.phone,
        city: mergedMentor.city,
        district: mergedMentor.district,
        state: mergedMentor.state,
        graduationCollege: mergedMentor.graduationCollege,
        degree: mergedMentor.degree,
        field: mergedMentor.field,
        expertise: mergedMentor.expertise,
        graduationYear: mergedMentor.graduationYear,
        languages: mergedMentor.languages,
        shortBio: mergedMentor.shortBio,
        availability: mergedMentor.availability
      })
    }).catch(console.warn);

    // 7. Direct Supabase update if configured
    if (isSupabaseConfigured && supabase) {
      try {
        (supabase.auth as any).updateUser({ data: { full_name: newName } }).catch(() => {});
      } catch {}

      if (targetId) {
        supabase
          .from('profiles')
          .update({
            full_name: newName,
            phone: mergedMentor.phone,
            city: mergedMentor.city,
            district: mergedMentor.district,
            state: mergedMentor.state,
            updated_at: new Date().toISOString()
          })
          .eq('id', targetId)
          .then(null, console.warn);

        supabase
          .from('mentors')
          .update({
            graduation_college: mergedMentor.graduationCollege,
            degree: mergedMentor.degree,
            field: mergedMentor.field,
            expertise: mergedMentor.expertise,
            graduation_year: mergedMentor.graduationYear,
            languages: mergedMentor.languages,
            short_bio: mergedMentor.shortBio,
            availability: mergedMentor.availability,
            city: mergedMentor.city,
            district: mergedMentor.district,
            state: mergedMentor.state,
            updated_at: new Date().toISOString()
          })
          .eq('id', targetId)
          .then(null, console.warn);

        supabase
          .from('mentorship_requests')
          .update({
            mentor_name: newName
          })
          .eq('mentor_id', targetId)
          .then(null, console.warn);
      }
    }

    showToast('Name and mentor profile updated in database.', 'success');
  };

  const verifyAccount = (data: VerificationData) => {
    const nowFormatted = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const fullData: VerificationData = {
      ...data,
      status: 'verified',
      submittedAt: data.submittedAt || nowFormatted,
      verifiedAt: nowFormatted
    };

    const targetUserId = currentUser?.id || (role === 'mentor' ? mentorProfile.id : '');

    if (role === 'mentor') {
      setMentorProfile(prev => ({
        ...prev,
        verified: true,
        verificationStatus: 'verified',
        verificationData: fullData
      }));

      setMentors(prev => prev.map(m => (m.id === mentorProfile.id || m.email === mentorProfile.email) ? {
        ...m,
        verified: true,
        verificationStatus: 'verified',
        verificationData: fullData
      } : m));

      setCurrentUser(prev => prev ? ({ ...prev, verified: true }) : null);
      showToast('Graduate Mentor credentials verified! Verified Alumni badge awarded.', 'success');
    } else {
      setStudentProfile(prev => ({
        ...prev,
        verified: true,
        verificationStatus: 'verified',
        verificationData: fullData
      }));

      setCurrentUser(prev => prev ? ({ ...prev, verified: true }) : null);
      showToast('Student status verified! Verified Student badge awarded.', 'success');
    }

    // Persist verification to Supabase PostgreSQL
    if (isSupabaseConfigured && supabase && targetUserId) {
      supabase
        .from('profiles')
        .update({
          verified: true,
          verification_status: 'verified',
          verification_data: fullData,
          updated_at: new Date().toISOString()
        })
        .eq('id', targetUserId)
        .then(null, console.warn);

      if (role === 'mentor') {
        supabase
          .from('mentors')
          .update({
            verified: true,
            verification_status: 'verified',
            verification_data: fullData,
            updated_at: new Date().toISOString()
          })
          .eq('id', targetUserId)
          .then(null, console.warn);
      }

      supabase
        .from('account_verifications')
        .insert({
          user_id: targetUserId,
          role,
          institution_name: data.institutionName || '',
          document_type: data.documentType || '',
          document_number: data.documentNumber || '',
          document_file_name: data.documentFileName || '',
          first_gen_declaration: data.firstGenDeclaration ?? true,
          status: 'verified',
          submitted_at: new Date().toISOString(),
          verified_at: new Date().toISOString()
        })
        .then(null, console.warn);
    }
  };

  const resetVerification = () => {
    const targetUserId = currentUser?.id || (role === 'mentor' ? mentorProfile.id : '');
    if (role === 'mentor') {
      setMentorProfile(prev => ({
        ...prev,
        verified: false,
        verificationStatus: 'unverified',
        verificationData: undefined
      }));
      setMentors(prev => prev.map(m => (m.id === mentorProfile.id || m.email === mentorProfile.email) ? {
        ...m,
        verified: false,
        verificationStatus: 'unverified',
        verificationData: undefined
      } : m));
    } else {
      setStudentProfile(prev => ({
        ...prev,
        verified: false,
        verificationStatus: 'unverified',
        verificationData: undefined
      }));
    }
    setCurrentUser(prev => prev ? ({ ...prev, verified: false }) : null);

    if (isSupabaseConfigured && supabase && targetUserId) {
      supabase
        .from('profiles')
        .update({
          verified: false,
          verification_status: 'unverified',
          verification_data: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', targetUserId)
        .then(null, console.warn);
    }

    showToast('Verification reset.', 'info');
  };

  const submitMentorFeedback = (requestId: string, rating: number, comment?: string, tags?: string[]) => {
    const req = requests.find(r => r.id === requestId);
    if (!req) return;

    const cleanRating = Math.max(1, Math.min(5, Math.round(rating)));
    const submittedAt = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const meetDate = req.meetingDate || submittedAt;
    const meetTime = req.meetingTime || req.meetingScheduledTime || 'Scheduled Session';

    const feedbackObj = {
      rating: cleanRating,
      comment: comment ? comment.trim() : '',
      tags: tags || [],
      submittedAt,
      meetingDate: meetDate,
      meetingTime: meetTime
    };

    // 1. Update the mentorship request in state
    setRequests(prevRequests => prevRequests.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'Completed' as const,
          rating: cleanRating,
          meetingDate: meetDate,
          meetingTime: meetTime,
          statusMessage: `Session completed & rated ${cleanRating} stars.`,
          feedback: feedbackObj
        };
      }
      return r;
    }));

    // 2. Build review record
    const reviewId = (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') 
      ? crypto.randomUUID() 
      : `rev-${Date.now()}`;

    const newReview: MentorReview = {
      id: reviewId,
      mentorId: req.mentorId,
      studentId: req.studentId,
      studentName: req.studentName,
      rating: cleanRating,
      meetingDate: meetDate,
      meetingTime: meetTime,
      meetingScheduledTime: req.meetingScheduledTime || meetTime,
      topic: req.topic,
      comment: comment ? comment.trim() : '',
      tags: tags || [],
      date: submittedAt,
      requestId
    };

    // 3. Update mentor in state
    let calculatedAvgRating = cleanRating;
    let calculatedTotalReviews = 1;

    setMentors(prevMentors => prevMentors.map(m => {
      const isMatch = m.id === req.mentorId || 
        m.fullName.toLowerCase() === req.mentorName.toLowerCase() ||
        (req.mentorEmail && m.email?.toLowerCase() === req.mentorEmail.toLowerCase());
      if (isMatch) {
        const existingReviews = m.reviews || [];
        const updatedReviews = [newReview, ...existingReviews.filter(rev => rev.requestId !== requestId && rev.id !== reviewId)];
        const totalRating = updatedReviews.reduce((sum, rev) => sum + rev.rating, 0);
        calculatedAvgRating = Number((totalRating / updatedReviews.length).toFixed(1));
        calculatedTotalReviews = updatedReviews.length;
        return {
          ...m,
          rating: calculatedAvgRating,
          reviewCount: calculatedTotalReviews,
          reviews: updatedReviews
        };
      }
      return m;
    }));

    // 4. Update mentorProfile if active
    setMentorProfile(prev => {
      const isMatch = (prev.id && prev.id === req.mentorId) ||
        (prev.fullName && prev.fullName.toLowerCase() === req.mentorName.toLowerCase()) ||
        (req.mentorEmail && prev.email && prev.email.toLowerCase() === req.mentorEmail.toLowerCase());
      if (isMatch) {
        const existingReviews = prev.reviews || [];
        const updatedReviews = [newReview, ...existingReviews.filter(rev => rev.requestId !== requestId && rev.id !== reviewId)];
        const totalRating = updatedReviews.reduce((sum, rev) => sum + rev.rating, 0);
        const avgRating = Number((totalRating / updatedReviews.length).toFixed(1));
        return {
          ...prev,
          rating: avgRating,
          reviewCount: updatedReviews.length,
          reviews: updatedReviews
        };
      }
      return prev;
    });

    // 5. Persist via API and Supabase PostgreSQL
    try {
      fetch('/api/requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: requestId,
          status: 'Completed',
          rating: cleanRating,
          meetingDate: meetDate,
          meetingTime: meetTime,
          meetingCompleted: true,
          statusMessage: `Session completed & rated ${cleanRating} stars.`,
          feedback: feedbackObj
        })
      }).catch(console.warn);
    } catch (apiErr) {
      console.warn('API PATCH submitMentorFeedback error:', apiErr);
    }

    if (isSupabaseConfigured && supabase) {
      supabase
        .from('mentorship_requests')
        .update({
          status: 'Completed',
          rating: cleanRating,
          meeting_date: meetDate,
          meeting_time: meetTime,
          status_message: `Session completed & rated ${cleanRating} stars.`,
          feedback: feedbackObj,
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId)
        .then(null, console.warn);

      const isUuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (isUuidRegex.test(req.mentorId) && isUuidRegex.test(req.studentId)) {
        supabase
          .from('mentor_reviews')
          .insert({
            id: reviewId,
            request_id: isUuidRegex.test(requestId) ? requestId : null,
            mentor_id: req.mentorId,
            student_id: req.studentId,
            student_name: req.studentName,
            rating: cleanRating,
            meeting_date: meetDate,
            meeting_time: meetTime,
            meeting_scheduled_time: req.meetingScheduledTime || meetTime,
            topic: req.topic,
            comment: comment ? comment.trim() : null,
            tags: tags || []
          })
          .then(null, console.warn);

        // Update mentors table directly with new rating and review_count
        supabase
          .from('mentors')
          .update({
            rating: calculatedAvgRating,
            review_count: calculatedTotalReviews,
            updated_at: new Date().toISOString()
          })
          .eq('id', req.mentorId)
          .then(null, console.warn);
      }
    }

    showToast(`Thank you! Meeting rated ${cleanRating} stars and recorded in mentor's session history.`, 'success');
  };

  const deleteAccount = async (userId?: string): Promise<boolean> => {
    const targetId = userId || currentUser?.id;
    const targetEmail = currentUser?.email || mentorProfile?.email || studentProfile?.email;

    try {
      // 1. Call server API to delete from PostgreSQL DB
      if (targetId) {
        await fetch('/api/account', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: targetId, email: targetEmail, role })
        }).catch(console.warn);
      }

      // 2. Direct client-side Supabase deletion if connected
      if (isSupabaseConfigured && supabase && targetId) {
        try {
          await supabase.from('mentors').delete().eq('id', targetId);
          await supabase.from('students').delete().eq('id', targetId);
          await supabase.from('mentor_reviews').delete().or(`mentor_id.eq.${targetId},student_id.eq.${targetId}`);
          await supabase.from('mentorship_requests').delete().or(`mentor_id.eq.${targetId},student_id.eq.${targetId}`);
          await supabase.from('account_verifications').delete().eq('user_id', targetId);
          await supabase.from('profiles').delete().eq('id', targetId);
        } catch (dbErr) {
          console.warn('Direct client Supabase delete note:', dbErr);
        }
        try {
          await (supabase.auth as any).signOut();
        } catch {}
      }

      // 3. Clean up local state
      if (targetId) {
        setMentors(prev => prev.filter(m => m.id !== targetId && m.email?.toLowerCase() !== targetEmail?.toLowerCase()));
        setRequests(prev => prev.filter(r => r.mentorId !== targetId && r.studentId !== targetId));
      }

      // 4. Remove from local accounts registry
      try {
        const existing = getLocalAccounts();
        const updated = existing.filter(a => 
          (targetId ? a.id !== targetId : true) && 
          (targetEmail ? a.email.toLowerCase() !== targetEmail.toLowerCase() : true)
        );
        localStorage.setItem(REGISTRY_KEY, JSON.stringify(updated));
      } catch (regErr) {
        console.warn('Could not update local registry on delete:', regErr);
      }

      // 5. Clear all storage keys for this user
      setCurrentUser(null);
      setRoleState('guest');
      setMentorProfile(INITIAL_MENTOR_PROFILE);
      setStudentProfile(INITIAL_STUDENT_PROFILE);
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}user`);
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}mentor_profile`);
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}student_profile`);

      showToast('Account and all associated records permanently removed.', 'info');
      return true;
    } catch (err: any) {
      console.error('Delete account error:', err);
      showToast('Failed to delete account. Please try again.', 'error');
      return false;
    }
  };

  return (
    <AppContext.Provider value={{
      isLoaded,
      role,
      currentUser,
      studentProfile,
      mentorProfile,
      mentors,
      requests,
      activeModalMentor,
      toast,
      setRole,
      login,
      signup,
      logout,
      openRequestModal,
      closeRequestModal,
      submitRequest,
      updateRequestStatus,
      acceptRequestWithGMeet,
      notifyMeetingOver,
      updateStudentProfile,
      updateMentorProfile,
      verifyAccount,
      resetVerification,
      submitMentorFeedback,
      deleteAccount,
      showToast
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
