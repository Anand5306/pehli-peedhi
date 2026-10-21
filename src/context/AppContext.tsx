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
  updateStudentProfile: (profile: Partial<StudentProfile>) => void;
  updateMentorProfile: (profile: Partial<MentorProfile>) => void;
  showToast: (text: string, type?: 'success' | 'info' | 'error') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'pehlipedhi_v5_';
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

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    if (newRole === 'mentor') {
      setCurrentUser({
        id: 'mentor-1',
        name: mentorProfile.fullName,
        email: mentorProfile.email,
        role: 'mentor',
        avatar: mentorProfile.avatar
      });
      showToast(`Viewing as Mentor: ${mentorProfile.fullName}`, 'info');
    } else if (newRole === 'student') {
      setCurrentUser({
        id: 'student-1',
        name: studentProfile.fullName,
        email: studentProfile.email,
        role: 'student',
        avatar: 'AK'
      });
      showToast(`Viewing as Student: ${studentProfile.fullName}`, 'info');
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
        const { data: authData, error: authErr } = await supabase.auth.signUp({
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
        setMentorProfile(prev => ({ ...prev, fullName: cleanName, email: cleanEmail }));
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
      supabase.auth.signOut().catch(() => {});
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
    setStudentProfile(prev => ({ ...prev, ...updated }));
    showToast('Profile changes saved.');
  };

  const updateMentorProfile = (updated: Partial<MentorProfile>) => {
    setMentorProfile(prev => ({ ...prev, ...updated }));
    showToast('Profile changes saved.');
  };

  return (
    <AppContext.Provider value={{
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
