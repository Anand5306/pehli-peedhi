'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { Role, StudentProfile } from '../../types';
import { EDUCATION_LEVELS, INDIAN_STATES, LANGUAGES_LIST } from '../../data/mockData';

export default function AuthPage() {
  const router = useRouter();
  const { login, signup } = useApp();

  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [selectedRole, setSelectedRole] = useState<Role>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [studentDetails, setStudentDetails] = useState<Omit<StudentProfile, 'fullName' | 'email'>>({
    phone: '',
    city: '',
    district: '',
    state: '',
    currentEducationLevel: '',
    intendedCourse: '',
    preferredLanguage: '',
    firstGenNote: ''
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    if (mode === 'login') {
      const result = await login(email, password);
      setIsSubmitting(false);

      if (result.ok) {
        router.push('/dashboard');
      } else {
        setErrorMessage(result.error || 'Invalid email or password. Please check your credentials or create an account.');
      }
    } else {
      const result = await signup(name, email, password, selectedRole, studentDetails);
      setIsSubmitting(false);

      if (result.ok) {
        router.push('/dashboard');
      } else {
        setErrorMessage(result.error || 'Sign up failed. Please check your inputs and try again.');
      }
    }
  };

  const handleModeSwitch = (newMode: 'login' | 'signup') => {
    setMode(newMode);
    setErrorMessage(null);
  };

  return (
    <div style={{ padding: '4rem 0 6rem', minHeight: 'calc(100vh - 120px)' }}>
      <div className="container" style={{ maxWidth: mode === 'signup' && selectedRole === 'student' ? '760px' : '500px' }}>
        <div className="card" style={{ padding: '2.5rem' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div className="brand-monogram" style={{ margin: '0 auto 1rem', width: '48px', height: '48px', fontSize: '1.25rem' }}>
              PP
            </div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              {mode === 'login' ? 'Sign In to PehliPeedhi' : 'Create Your Account'}
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
              First-generation higher education mentorship network
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-glass)', marginBottom: '1.75rem' }}>
            <button
              type="button"
              style={{
                flex: 1,
                padding: '0.75rem',
                border: 'none',
                background: 'none',
                fontWeight: 700,
                fontSize: '0.9375rem',
                color: mode === 'signup' ? 'var(--text-main)' : 'var(--text-muted)',
                borderBottom: mode === 'signup' ? '2px solid var(--text-main)' : '2px solid transparent',
                cursor: 'pointer'
              }}
              onClick={() => handleModeSwitch('signup')}
            >
              Sign Up
            </button>
            <button
              type="button"
              style={{
                flex: 1,
                padding: '0.75rem',
                border: 'none',
                background: 'none',
                fontWeight: 700,
                fontSize: '0.9375rem',
                color: mode === 'login' ? 'var(--text-main)' : 'var(--text-muted)',
                borderBottom: mode === 'login' ? '2px solid var(--text-main)' : '2px solid transparent',
                cursor: 'pointer'
              }}
              onClick={() => handleModeSwitch('login')}
            >
              Log In
            </button>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div style={{
              background: 'rgba(254, 242, 242, 0.95)',
              border: '1px solid #FECACA',
              color: '#991B1B',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              marginBottom: '1.5rem',
              lineHeight: 1.45
            }}>
              <strong>Error:</strong> {errorMessage}
            </div>
          )}

          {/* Role selector (Only relevant during sign-up) */}
          {mode === 'signup' && (
            <div className="form-group">
              <label className="form-label">Select Your Role</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <button
                  type="button"
                  className={`btn btn-sm ${selectedRole === 'student' ? 'btn-cream' : 'btn-secondary'}`}
                  onClick={() => setSelectedRole('student')}
                >
                  First-Gen Student
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${selectedRole === 'mentor' ? 'btn-cream' : 'btn-secondary'}`}
                  onClick={() => setSelectedRole('mentor')}
                >
                  Graduate Mentor
                </button>
              </div>
              <div className="form-hint">
                {selectedRole === 'student' 
                  ? 'Access free guidance on college selection, admissions, and scholarships.' 
                  : 'Guide aspiring students navigating higher education for the first time.'}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div className="form-group">
                <label className="form-label" htmlFor="auth-name">Full Name</label>
                <input
                  id="auth-name"
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. Rameshwar Kumar"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
            )}

            {mode === 'signup' && selectedRole === 'student' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="auth-phone">Phone / WhatsApp Number</label>
                    <input
                      id="auth-phone"
                      type="tel"
                      className="form-input"
                      required
                      autoComplete="tel"
                      placeholder="e.g. +91 98765 43210"
                      value={studentDetails.phone}
                      onChange={e => setStudentDetails({ ...studentDetails, phone: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="auth-state">Home State</label>
                    <select
                      id="auth-state"
                      className="form-select"
                      required
                      value={studentDetails.state}
                      onChange={e => setStudentDetails({ ...studentDetails, state: e.target.value })}
                    >
                      <option value="">Select a state</option>
                      {INDIAN_STATES.filter(state => state !== 'All States').map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="auth-city">City</label>
                    <input
                      id="auth-city"
                      type="text"
                      className="form-input"
                      required
                      autoComplete="address-level2"
                      value={studentDetails.city}
                      onChange={e => setStudentDetails({ ...studentDetails, city: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="auth-district">District</label>
                    <input
                      id="auth-district"
                      type="text"
                      className="form-input"
                      required
                      value={studentDetails.district}
                      onChange={e => setStudentDetails({ ...studentDetails, district: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="auth-education">Current Education Level</label>
                    <select
                      id="auth-education"
                      className="form-select"
                      required
                      value={studentDetails.currentEducationLevel}
                      onChange={e => setStudentDetails({ ...studentDetails, currentEducationLevel: e.target.value })}
                    >
                      <option value="">Select your education level</option>
                      {EDUCATION_LEVELS.map(level => <option key={level} value={level}>{level}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="auth-course">Target Degree / Course</label>
                    <input
                      id="auth-course"
                      type="text"
                      className="form-input"
                      required
                      placeholder="e.g. B.Tech Computer Science, MBBS"
                      value={studentDetails.intendedCourse}
                      onChange={e => setStudentDetails({ ...studentDetails, intendedCourse: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="auth-language">Preferred Language for Mentorship</label>
                  <select
                    id="auth-language"
                    className="form-select"
                    required
                    value={studentDetails.preferredLanguage}
                    onChange={e => setStudentDetails({ ...studentDetails, preferredLanguage: e.target.value })}
                  >
                    <option value="">Select a language</option>
                    {LANGUAGES_LIST.filter(language => language !== 'All Languages').map(language => (
                      <option key={language} value={language}>{language}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="auth-first-gen-note">First-Gen Family Background (Optional)</label>
                  <textarea
                    id="auth-first-gen-note"
                    className="form-textarea"
                    rows={3}
                    placeholder="Share any background or specific hurdles you are facing."
                    value={studentDetails.firstGenNote || ''}
                    onChange={e => setStudentDetails({ ...studentDetails, firstGenNote: e.target.value })}
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="auth-email">Email Address</label>
              <input
                id="auth-email"
                type="email"
                className="form-input"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="auth-password">Password</label>
              <input
                id="auth-password"
                type="password"
                className="form-input"
                required
                minLength={6}
                placeholder="At least 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              {mode === 'signup' && (
                <div className="form-hint">Must be at least 6 characters.</div>
              )}
            </div>

            <button 
              type="submit" 
              className="btn btn-cream btn-lg" 
              style={{ width: '100%', marginTop: '0.75rem' }}
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? 'Verifying...' 
                : mode === 'signup' 
                  ? `Create ${selectedRole === 'mentor' ? 'Mentor' : 'Student'} Account` 
                  : 'Sign In'}
            </button>
          </form>

          {/* Footer note */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            {mode === 'login' ? (
              <span>
                Don&apos;t have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => handleModeSwitch('signup')}
                  style={{ background: 'none', border: 'none', color: 'var(--text-main)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Create one here
                </button>
              </span>
            ) : (
              <span>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => handleModeSwitch('login')}
                  style={{ background: 'none', border: 'none', color: 'var(--text-main)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Sign in here
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
