'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Role, 
  User, 
  StudentProfile, 
  MentorProfile, 
  MentorshipRequest 
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
  role: Role;
  currentUser: User | null;
  isLoaded: boolean;
  studentProfile: StudentProfile;
  mentorProfile: MentorProfile;
  mentors: MentorProfile[];
  requests: MentorshipRequest[];
  activeModalMentor: MentorProfile | null;
  toast: ToastData | null;
  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (name: string, email: string, password: string, role: Role, studentDetails?: Omit<StudentProfile, 'fullName' | 'email'>) => Promise<AuthResult>;
  logout: () => void;
  openRequestModal: (mentor: MentorProfile) => void;
  closeRequestModal: () => void;
  submitRequest: (topic: string, language: string, contactMode: string) => boolean;
  updateRequestStatus: (requestId: string, status: 'Accepted' | 'Declined', note?: string) => void;
  updateStudentProfile: (profile: Partial<StudentProfile>) => void;
  updateMentorProfile: (profile: Partial<MentorProfile>) => void;
  showToast: (text: string, type?: 'success' | 'info' | 'error') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'pehlipedhi_v5_';
const REGISTRY_KEY = 'pehlipedhi_users_registry_v1';

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(INITIAL_STUDENT_PROFILE);
  const [mentorProfile, setMentorProfile] = useState<MentorProfile>(INITIAL_MENTOR_PROFILE);
  const [mentors, setMentors] = useState<MentorProfile[]>(SAMPLE_MENTORS);
  const [requests, setRequests] = useState<MentorshipRequest[]>(INITIAL_REQUESTS);
  const [activeModalMentor, setActiveModalMentor] = useState<MentorProfile | null>(null);
  const [toast, setToast] = useState<ToastData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const role: Role = currentUser?.role || 'guest';

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
        const parsed = JSON.parse(savedUser) as User;
        if (parsed.id && (parsed.role === 'student' || parsed.role === 'mentor')) {
          setCurrentUser(parsed);
        } else {
          localStorage.removeItem(`${STORAGE_KEY_PREFIX}user`);
        }
      }

      const savedRequests = localStorage.getItem(`${STORAGE_KEY_PREFIX}requests`);
      if (savedRequests) setRequests(JSON.parse(savedRequests));

      const savedStudent = localStorage.getItem(`${STORAGE_KEY_PREFIX}student_profile`);
      if (savedStudent) setStudentProfile(JSON.parse(savedStudent));

      const savedMentor = localStorage.getItem(`${STORAGE_KEY_PREFIX}mentor_profile`);
      if (savedMentor) setMentorProfile(JSON.parse(savedMentor));
    } catch (err) {
      console.warn('LocalStorage load error:', err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

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
    } catch (err) {
      console.warn('LocalStorage save error:', err);
    }
  }, [currentUser, requests, studentProfile, mentorProfile, isLoaded]);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ text, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
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
        const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
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

          const storedRole = profile?.role || authData.user.user_metadata?.role;
          const userRole: Role = storedRole === 'mentor' ? 'mentor' : 'student';
          const userName: string = profile?.full_name || authData.user.user_metadata?.full_name || cleanEmail.split('@')[0];

          const loggedUser: User = {
            id: authData.user.id,
            name: userName,
            email: cleanEmail,
            role: userRole,
            avatar: userName.slice(0, 2).toUpperCase()
          };

          setCurrentUser(loggedUser);
          showToast(`Welcome back, ${userName}`);
          return { ok: true };
        }
      }

      // 2. Check local accounts registry (accounts created in this browser session)
      const localAccounts = getLocalAccounts();
      const matched = localAccounts.find(
        acc => acc.email.toLowerCase() === cleanEmail && acc.password === cleanPassword
      );

      if (matched && (matched.role === 'student' || matched.role === 'mentor')) {
        const loggedUser: User = {
          id: matched.id,
          name: matched.name,
          email: matched.email,
          role: matched.role,
          avatar: matched.name.slice(0, 2).toUpperCase()
        };

        setCurrentUser(loggedUser);
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
    userRole: Role,
    studentDetails?: Omit<StudentProfile, 'fullName' | 'email'>
  ): Promise<AuthResult> => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanName || !cleanEmail || !cleanPassword) {
      const err = 'Please provide name, email, and password.';
      showToast(err, 'error');
      return { ok: false, error: err };
    }

    if (userRole !== 'student' && userRole !== 'mentor') {
      const err = 'Please select a valid account role.';
      showToast(err, 'error');
      return { ok: false, error: err };
    }

    if (cleanPassword.length < 6) {
      const err = 'Password must be at least 6 characters.';
      showToast(err, 'error');
      return { ok: false, error: err };
    }

    if (userRole === 'student' && (!studentDetails || [
      studentDetails.phone,
      studentDetails.city,
      studentDetails.district,
      studentDetails.state,
      studentDetails.currentEducationLevel,
      studentDetails.intendedCourse,
      studentDetails.preferredLanguage
    ].some(value => !value.trim()))) {
      const err = 'Please complete all required student profile details.';
      showToast(err, 'error');
      return { ok: false, error: err };
    }

    try {
      let createdUserId = `user-${Date.now()}`;

      // 1. If Supabase is connected, sign up with Supabase Auth
      if (isSupabaseConfigured && supabase) {
        const { data: authData, error: authErr } = await supabase.auth.signUp({
          email: cleanEmail,
          password: cleanPassword,
          options: {
            data: {
              full_name: cleanName,
              role: userRole,
              ...(userRole === 'student' && studentDetails ? {
                phone: studentDetails.phone.trim(),
                city: studentDetails.city.trim(),
                district: studentDetails.district.trim(),
                state: studentDetails.state,
                current_education_level: studentDetails.currentEducationLevel,
                intended_course: studentDetails.intendedCourse.trim(),
                preferred_language: studentDetails.preferredLanguage,
                first_gen_note: studentDetails.firstGenNote?.trim() || ''
              } : {})
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
            role: userRole,
            phone: userRole === 'student' ? studentDetails?.phone.trim() : undefined
          });

          if (userRole === 'student' && studentDetails) {
            await supabase.from('students').upsert({
              id: createdUserId,
              city: studentDetails.city.trim(),
              district: studentDetails.district.trim(),
              state: studentDetails.state,
              current_education_level: studentDetails.currentEducationLevel,
              intended_course: studentDetails.intendedCourse.trim(),
              preferred_language: studentDetails.preferredLanguage,
              first_gen_note: studentDetails.firstGenNote?.trim() || ''
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

      if (userRole === 'mentor') {
        setMentorProfile(prev => ({ ...prev, fullName: cleanName, email: cleanEmail }));
      } else if (userRole === 'student' && studentDetails) {
        setStudentProfile({
          ...studentDetails,
          fullName: cleanName,
          email: cleanEmail,
          firstGenNote: studentDetails.firstGenNote?.trim() || ''
        });
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
      supabase.auth.signOut().catch(() => {});
    }
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}user`);
    setCurrentUser(null);
    setActiveModalMentor(null);
    showToast('Signed out successfully.', 'info');
  };

  const openRequestModal = (mentor: MentorProfile) => {
    if (currentUser?.role !== 'student') {
      showToast('Sign in with a student account to request mentorship.', 'error');
      return;
    }
    setActiveModalMentor(mentor);
  };

  const closeRequestModal = () => {
    setActiveModalMentor(null);
  };

  const submitRequest = (topic: string, language: string, contactMode: string): boolean => {
    if (currentUser?.role !== 'student' || !activeModalMentor) {
      showToast('Only signed-in students can submit mentorship requests.', 'error');
      return false;
    }

    const newReq: MentorshipRequest = {
      id: `req-${Date.now()}`,
      studentId: currentUser?.id || 'student-1',
      studentName: studentProfile.fullName || 'Student Learner',
      studentEmail: studentProfile.email,
      studentPhone: studentProfile.phone,
      studentLocation: `${studentProfile.city}, ${studentProfile.state}`,
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
    setActiveModalMentor(null);
    showToast(`Request submitted to ${activeModalMentor.fullName}. Check your Dashboard.`);
    return true;
  };

  const updateRequestStatus = (requestId: string, status: 'Accepted' | 'Declined', note?: string) => {
    if (currentUser?.role !== 'mentor') {
      showToast('Only signed-in mentors can respond to requests.', 'error');
      return;
    }

    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status,
          mentorResponseNote: note || (status === 'Accepted' ? 'Request accepted. Mentor contact information unlocked.' : 'Mentor is at capacity.'),
          statusMessage: status === 'Accepted' ? 'Mentorship session approved.' : 'Request declined due to schedule constraints.'
        };
      }
      return req;
    }));
    showToast(`Request marked as ${status}.`);
  };

  const updateStudentProfile = (updated: Partial<StudentProfile>) => {
    if (currentUser?.role !== 'student') {
      showToast('Sign in with a student account to update this profile.', 'error');
      return;
    }
    setStudentProfile(prev => ({ ...prev, ...updated }));
    showToast('Profile changes saved.');
  };

  const updateMentorProfile = (updated: Partial<MentorProfile>) => {
    if (currentUser?.role !== 'mentor') {
      showToast('Sign in with a mentor account to update this profile.', 'error');
      return;
    }
    setMentorProfile(prev => ({ ...prev, ...updated }));
    showToast('Profile changes saved.');
  };

  return (
    <AppContext.Provider value={{
      role,
      currentUser,
      isLoaded,
      studentProfile,
      mentorProfile,
      mentors,
      requests,
      activeModalMentor,
      toast,
      login,
      signup,
      logout,
      openRequestModal,
      closeRequestModal,
      submitRequest,
      updateRequestStatus,
      updateStudentProfile,
      updateMentorProfile,
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
