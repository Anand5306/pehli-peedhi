'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { EDUCATION_LEVELS, INDIAN_STATES, LANGUAGES_LIST } from '../../data/mockData';

export default function ProfilePage() {
  const router = useRouter();
  const { 
    isLoaded,
    currentUser,
    role, 
    studentProfile, 
    mentorProfile, 
    updateStudentProfile, 
    updateMentorProfile,
    verifyAccount,
    resetVerification,
    deleteAccount
  } = useApp();

  const [activeTab, setActiveTab] = useState<'details' | 'verification'>('details');
  const [isEditingVerification, setIsEditingVerification] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [studentForm, setStudentForm] = useState(studentProfile);
  const [mentorForm, setMentorForm] = useState(mentorProfile);

  // Student verification form state
  const [studentVerifForm, setStudentVerifForm] = useState({
    institutionName: studentProfile.verificationData?.institutionName || studentProfile.intendedCourse || '',
    documentType: studentProfile.verificationData?.documentType || 'College / School Student ID Card',
    documentNumber: studentProfile.verificationData?.documentNumber || '',
    firstGenDeclaration: studentProfile.verificationData?.firstGenDeclaration ?? true,
    documentFileName: studentProfile.verificationData?.documentFileName || ''
  });

  // Mentor verification form state
  const [mentorVerifForm, setMentorVerifForm] = useState({
    institutionName: mentorProfile.verificationData?.institutionName || mentorProfile.graduationCollege || '',
    degree: mentorProfile.degree || '',
    graduationYear: mentorProfile.graduationYear || '2022',
    documentType: mentorProfile.verificationData?.documentType || 'University Degree Certificate',
    documentNumber: mentorProfile.verificationData?.documentNumber || '',
    mentorPledge: true,
    documentFileName: mentorProfile.verificationData?.documentFileName || ''
  });

  // Redirect to / if user is signed out or guest
  useEffect(() => {
    if (isLoaded && (!currentUser || role === 'guest')) {
      router.replace('/');
    }
  }, [isLoaded, currentUser, role, router]);

  // Always reset tab to 'details' whenever role or user changes (prevents stuck verification screen on signout)
  useEffect(() => {
    setActiveTab('details');
    setIsEditingVerification(false);
  }, [currentUser?.id, role]);

  useEffect(() => {
    setStudentForm(studentProfile);
    if (studentProfile.verificationData) {
      setStudentVerifForm({
        institutionName: studentProfile.verificationData.institutionName || '',
        documentType: studentProfile.verificationData.documentType || 'College / School Student ID Card',
        documentNumber: studentProfile.verificationData.documentNumber || '',
        firstGenDeclaration: studentProfile.verificationData.firstGenDeclaration ?? true,
        documentFileName: studentProfile.verificationData.documentFileName || ''
      });
    }
  }, [studentProfile]);

  useEffect(() => {
    setMentorForm(mentorProfile);
    if (mentorProfile.verificationData) {
      setMentorVerifForm({
        institutionName: mentorProfile.verificationData.institutionName || mentorProfile.graduationCollege || '',
        degree: mentorProfile.degree || '',
        graduationYear: mentorProfile.graduationYear || '2022',
        documentType: mentorProfile.verificationData.documentType || 'University Degree Certificate',
        documentNumber: mentorProfile.verificationData.documentNumber || '',
        mentorPledge: true,
        documentFileName: mentorProfile.verificationData.documentFileName || ''
      });
    }
  }, [mentorProfile]);

  // If user is not authenticated, show sign-in prompt and don't render any student or mentor data
  if (isLoaded && (!currentUser || role === 'guest')) {
    return (
      <div style={{ padding: '6rem 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '480px' }}>
          <div className="card" style={{ padding: '2.5rem' }}>
            <div className="brand-monogram" style={{ margin: '0 auto 1rem', width: '48px', height: '48px' }}>
              <img src="/logo.png" alt="PehliPeedhi Logo" />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Authentication Required
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Please sign in to view your profile settings.
            </p>
            <Link href="/auth" className="btn btn-cream" style={{ width: '100%', justifyContent: 'center' }}>
              Sign In to PehliPeedhi
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateStudentProfile(studentForm);
    setTimeout(() => setIsSaving(false), 600);
  };

  const handleMentorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateMentorProfile(mentorForm);
    setTimeout(() => setIsSaving(false), 600);
  };

  const handleStudentVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentVerifForm.institutionName.trim() || !studentVerifForm.documentNumber.trim()) {
      alert('Please fill in your Institution Name and ID / Roll Number.');
      return;
    }
    verifyAccount({
      status: 'verified',
      institutionName: studentVerifForm.institutionName.trim(),
      documentType: studentVerifForm.documentType,
      documentNumber: studentVerifForm.documentNumber.trim(),
      documentFileName: studentVerifForm.documentFileName || 'student_id_proof.pdf',
      firstGenDeclaration: studentVerifForm.firstGenDeclaration,
      submittedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    });
    setIsEditingVerification(false);
  };

  const handleMentorVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mentorVerifForm.institutionName.trim() || !mentorVerifForm.documentNumber.trim()) {
      alert('Please fill in your Alma Mater and Degree Certificate / Registration Number.');
      return;
    }
    verifyAccount({
      status: 'verified',
      institutionName: mentorVerifForm.institutionName.trim(),
      documentType: mentorVerifForm.documentType,
      documentNumber: mentorVerifForm.documentNumber.trim(),
      documentFileName: mentorVerifForm.documentFileName || 'degree_certificate.pdf',
      submittedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    });
    setIsEditingVerification(false);
  };

  const isVerified = role === 'mentor' ? !!mentorProfile.verified : !!studentProfile.verified;

  return (
    <div style={{ padding: '3rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '820px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
              <span className="badge badge-cream">
                Account Settings
              </span>
              {isVerified ? (
                <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  ✓ {role === 'mentor' ? 'Verified Alumni Mentor' : 'Verified First-Gen Student'}
                </span>
              ) : (
                <span 
                  className="badge badge-glass" 
                  style={{ color: '#D97706', borderColor: '#FDE68A', background: '#FEF3C7', cursor: 'pointer' }}
                  onClick={() => setActiveTab('verification')}
                  title="Click to view Account Verification"
                >
                  ⚠️ Unverified Account
                </span>
              )}
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              {role === 'mentor' ? 'Mentor Profile & Availability' : 'Student Learner Profile'}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Link href="/dashboard" className="btn btn-sm btn-secondary">
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Navigation Tabs - Verification only opens when explicitly clicking Account Verification */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1.75rem',
          borderBottom: '1px solid var(--border-glass)',
          paddingBottom: '0.5rem'
        }}>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'details' ? 'btn-cream' : 'btn-secondary'}`}
            onClick={() => setActiveTab('details')}
          >
            Profile Details
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'verification' ? 'btn-cream' : 'btn-secondary'}`}
            onClick={() => setActiveTab('verification')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <span>Account Verification</span>
            {isVerified ? (
              <span className="badge badge-success" style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>✓ Verified</span>
            ) : (
              <span className="badge badge-glass" style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', color: '#D97706', borderColor: '#FDE68A', background: '#FEF3C7' }}>
                Pending
              </span>
            )}
          </button>
        </div>

        {/* SECTION 1: ACCOUNT VERIFICATION (Opens ONLY when clicking Account Verification tab) */}
        {activeTab === 'verification' && (
          <div className="card" style={{ padding: '2.5rem' }}>
            {role === 'student' && (
              /* STUDENT VERIFICATION */
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                      First-Generation Student Verification
                    </h2>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0.35rem 0 0' }}>
                      Verify your enrollment &amp; first-generation learner status to earn the Verified Student badge.
                    </p>
                  </div>
                  <div>
                    {isVerified ? (
                      <span className="badge badge-success" style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}>
                        ✓ Verified First-Gen Student
                      </span>
                    ) : (
                      <span className="badge badge-glass" style={{ color: '#D97706', borderColor: '#FDE68A', background: '#FEF3C7', fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}>
                        ⚠️ Verification Pending
                      </span>
                    )}
                  </div>
                </div>

                {isVerified && !isEditingVerification ? (
                  /* VERIFIED STUDENT STATE CARD */
                  <div>
                    <div style={{
                      background: 'rgba(16, 185, 129, 0.08)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.5rem',
                      marginBottom: '1.75rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          background: '#10B981',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.25rem',
                          fontWeight: 800
                        }}>
                          ✓
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#065F46' }}>
                            Your Student Profile is Officially Verified
                          </div>
                          <div style={{ fontSize: '0.8125rem', color: '#047857' }}>
                            You can now send priority mentorship requests and access verified scholarship assistance.
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(16, 185, 129, 0.2)' }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>STUDENT NAME</div>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>{studentProfile.fullName}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>INSTITUTION</div>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                            {studentProfile.verificationData?.institutionName || studentProfile.intendedCourse || 'Patna Science College'}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>VERIFIED DOCUMENT</div>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                            {studentProfile.verificationData?.documentType || 'College Student ID Card'}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>DOCUMENT / ROLL NO.</div>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                            {studentProfile.verificationData?.documentNumber || 'STU-2026-9041'}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>VERIFIED ON</div>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                            {studentProfile.verificationData?.verifiedAt || 'Active'}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>FIRST-GEN STATUS</div>
                          <div style={{ fontWeight: 700, color: '#10B981', marginTop: '2px' }}>
                            Confirmed (First in Family)
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        onClick={() => setIsEditingVerification(true)}
                      >
                        Update Verification Document
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        style={{ color: '#EF4444' }}
                        onClick={resetVerification}
                      >
                        Reset Status
                      </button>
                    </div>
                  </div>
                ) : (
                  /* STUDENT VERIFICATION SUBMISSION FORM */
                  <form onSubmit={handleStudentVerificationSubmit}>
                    <div style={{
                      background: 'rgba(245, 158, 11, 0.08)',
                      border: '1px solid rgba(245, 158, 11, 0.25)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem 1.25rem',
                      marginBottom: '1.75rem',
                      fontSize: '0.875rem',
                      color: '#92400E'
                    }}>
                      <strong>Why Verification?</strong> Mentors on PehliPeedhi are volunteer graduates offering their personal time. Verification ensures genuine first-generation learners receive mentorship and scholarship assistance.
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                      <div className="form-group">
                        <label className="form-label" htmlFor="verif-institution">School / College / Institution Name *</label>
                        <input
                          id="verif-institution"
                          type="text"
                          className="form-input"
                          required
                          placeholder="e.g. Govt Girls High School, Patna Science College"
                          value={studentVerifForm.institutionName}
                          onChange={e => setStudentVerifForm({ ...studentVerifForm, institutionName: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label" htmlFor="verif-doc-type">Verification Document Type *</label>
                        <select
                          id="verif-doc-type"
                          className="form-select"
                          value={studentVerifForm.documentType}
                          onChange={e => setStudentVerifForm({ ...studentVerifForm, documentType: e.target.value })}
                        >
                          <option value="College / School Student ID Card">College / School Student ID Card</option>
                          <option value="Class 10th / 12th Admit Card or Board Marksheet">Class 10th / 12th Admit Card or Board Marksheet</option>
                          <option value="Current Year Tuition Fee Receipt / Admission Letter">Current Year Tuition Fee Receipt / Admission Letter</option>
                          <option value="Bonafide Student Certificate">Bonafide Student Certificate</option>
                          <option value="Ration Card / Income Certificate">Ration Card / Family Income Certificate</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                      <div className="form-group">
                        <label className="form-label" htmlFor="verif-doc-num">Document / Roll / Registration Number *</label>
                        <input
                          id="verif-doc-num"
                          type="text"
                          className="form-input"
                          required
                          placeholder="e.g. ROLL-2024-8842 or REG-091823"
                          value={studentVerifForm.documentNumber}
                          onChange={e => setStudentVerifForm({ ...studentVerifForm, documentNumber: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label" htmlFor="verif-file">Upload Document Proof (PDF or Image)</label>
                        <input
                          id="verif-file"
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg"
                          className="form-input"
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setStudentVerifForm({ ...studentVerifForm, documentFileName: file.name });
                            }
                          }}
                        />
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          {studentVerifForm.documentFileName 
                            ? `Selected: ${studentVerifForm.documentFileName}` 
                            : 'Upload ID card, marksheet, or fee receipt (PDF, JPG, PNG up to 10MB)'}
                        </div>
                      </div>
                    </div>

                    <div className="form-group" style={{ marginTop: '0.75rem' }}>
                      <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                        <input
                          type="checkbox"
                          required
                          checked={studentVerifForm.firstGenDeclaration}
                          onChange={e => setStudentVerifForm({ ...studentVerifForm, firstGenDeclaration: e.target.checked })}
                          style={{ marginTop: '3px' }}
                        />
                        <span>
                          <strong>First-Generation Learner Affirmation:</strong> I solemnly declare that neither of my parents has completed a 4-year undergraduate bachelor&apos;s degree, and all details submitted are accurate.
                        </span>
                      </label>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                      {isVerified && (
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => setIsEditingVerification(false)}
                        >
                          Cancel
                        </button>
                      )}
                      <button type="submit" className="btn btn-cream">
                        Submit &amp; Verify Student Status
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {role === 'mentor' && (
              /* MENTOR VERIFICATION */
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                      Graduate Mentor Credential Verification
                    </h2>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0.35rem 0 0' }}>
                      Verify your college graduation credentials to display the Verified Alumni badge and connect with first-gen learners.
                    </p>
                  </div>
                  <div>
                    {isVerified ? (
                      <span className="badge badge-success" style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}>
                        ✓ Verified Alumni Mentor
                      </span>
                    ) : (
                      <span className="badge badge-glass" style={{ color: '#D97706', borderColor: '#FDE68A', background: '#FEF3C7', fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}>
                        ⚠️ Verification Pending
                      </span>
                    )}
                  </div>
                </div>

                {isVerified && !isEditingVerification ? (
                  /* VERIFIED MENTOR STATE CARD */
                  <div>
                    <div style={{
                      background: 'rgba(16, 185, 129, 0.08)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.5rem',
                      marginBottom: '1.75rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          background: '#10B981',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.25rem',
                          fontWeight: 800
                        }}>
                          ✓
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#065F46' }}>
                            Your Graduate Mentor Credentials are Fully Verified
                          </div>
                          <div style={{ fontSize: '0.8125rem', color: '#047857' }}>
                            The Verified Alumni badge is active on your profile and directory cards. First-generation students can reach out to you with confidence.
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(16, 185, 129, 0.2)' }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>MENTOR NAME</div>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>{mentorProfile.fullName}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>ALMA MATER</div>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                            {mentorProfile.verificationData?.institutionName || mentorProfile.graduationCollege}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>DEGREE &amp; FIELD</div>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                            {mentorProfile.degree} ({mentorProfile.graduationYear})
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>VERIFIED DOCUMENT</div>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                            {mentorProfile.verificationData?.documentType || 'University Degree Certificate'}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>CERTIFICATE / REG NO.</div>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                            {mentorProfile.verificationData?.documentNumber || 'DEG-NIT-2022-7719'}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>DIRECTORY STATUS</div>
                          <div style={{ fontWeight: 700, color: '#10B981', marginTop: '2px' }}>
                            Listed on Verified Mentors
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        onClick={() => setIsEditingVerification(true)}
                      >
                        Update Verification Document
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        style={{ color: '#EF4444' }}
                        onClick={resetVerification}
                      >
                        Reset Status
                      </button>
                    </div>
                  </div>
                ) : (
                  /* MENTOR VERIFICATION SUBMISSION FORM */
                  <form onSubmit={handleMentorVerificationSubmit}>
                    <div style={{
                      background: 'rgba(37, 99, 235, 0.08)',
                      border: '1px solid rgba(37, 99, 235, 0.25)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem 1.25rem',
                      marginBottom: '1.75rem',
                      fontSize: '0.875rem',
                      color: '#1E40AF'
                    }}>
                      <strong>Alumni Credential Verification:</strong> Please provide proof of your college graduation. Mentors who verify their degree credentials receive the verified shield on the Alumni Directory.
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                      <div className="form-group">
                        <label className="form-label" htmlFor="mentor-verif-college">Graduation Alma Mater / University *</label>
                        <input
                          id="mentor-verif-college"
                          type="text"
                          className="form-input"
                          required
                          placeholder="e.g. NIT Trichy, IIT Bombay, Delhi University"
                          value={mentorVerifForm.institutionName}
                          onChange={e => setMentorVerifForm({ ...mentorVerifForm, institutionName: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label" htmlFor="mentor-verif-doc-type">Verification Proof Type *</label>
                        <select
                          id="mentor-verif-doc-type"
                          className="form-select"
                          value={mentorVerifForm.documentType}
                          onChange={e => setMentorVerifForm({ ...mentorVerifForm, documentType: e.target.value })}
                        >
                          <option value="University Degree Certificate">University Degree Certificate / Convocation Transcript</option>
                          <option value="College Alumni Card">College Alumni ID Card / Student Alumni Roll</option>
                          <option value="Institutional University Email">Institutional University Email (.ac.in / .edu)</option>
                          <option value="Company Work ID / Official Professional Profile">Company Work ID / Official Professional Profile</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                      <div className="form-group">
                        <label className="form-label" htmlFor="mentor-verif-doc-num">Degree / Registration / Alumni ID Number *</label>
                        <input
                          id="mentor-verif-doc-num"
                          type="text"
                          className="form-input"
                          required
                          placeholder="e.g. DEG-NIT-2022-7719 or ROLL-1082"
                          value={mentorVerifForm.documentNumber}
                          onChange={e => setMentorVerifForm({ ...mentorVerifForm, documentNumber: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label" htmlFor="mentor-verif-file">Upload Credential Document (PDF or Image)</label>
                        <input
                          id="mentor-verif-file"
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg"
                          className="form-input"
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setMentorVerifForm({ ...mentorVerifForm, documentFileName: file.name });
                            }
                          }}
                        />
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          {mentorVerifForm.documentFileName 
                            ? `Selected: ${mentorVerifForm.documentFileName}` 
                            : 'Upload degree certificate, alumni ID, or convocation proof (PDF, JPG, PNG)'}
                        </div>
                      </div>
                    </div>

                    <div className="form-group" style={{ marginTop: '0.75rem' }}>
                      <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                        <input
                          type="checkbox"
                          required
                          checked={mentorVerifForm.mentorPledge}
                          onChange={e => setMentorVerifForm({ ...mentorVerifForm, mentorPledge: e.target.checked })}
                          style={{ marginTop: '3px' }}
                        />
                        <span>
                          <strong>Mentor Integrity Pledge:</strong> I confirm that I am a graduate of this institution and agree to volunteer truthful, respectful guidance to first-generation students in accordance with the PehliPeedhi safety guidelines.
                        </span>
                      </label>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                      {isVerified && (
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => setIsEditingVerification(false)}
                        >
                          Cancel
                        </button>
                      )}
                      <button type="submit" className="btn btn-cream">
                        Submit &amp; Verify Mentor Credentials
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        )}

        {/* SECTION 2: PROFILE DETAILS (Default view when landing on Profile page) */}
        {activeTab === 'details' && (
          <div>
            {/* STUDENT PROFILE FORM */}
            {role === 'student' && (
              <form onSubmit={handleStudentSubmit} className="card" style={{ padding: '2.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem' }}>
                  Personal &amp; Educational Background
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="student-name">Full Name</label>
                    <input
                      id="student-name"
                      type="text"
                      className="form-input"
                      required
                      value={studentForm.fullName}
                      onChange={e => setStudentForm({ ...studentForm, fullName: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="student-email">Email Address</label>
                    <input
                      id="student-email"
                      type="email"
                      className="form-input"
                      required
                      value={studentForm.email}
                      onChange={e => setStudentForm({ ...studentForm, email: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="student-phone">
                      Phone / WhatsApp Number
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400, marginLeft: '0.5rem' }}>
                        (Kept private &bull; used for 1-click WhatsApp redirect)
                      </span>
                    </label>
                    <input
                      id="student-phone"
                      type="text"
                      className="form-input"
                      value={studentForm.phone}
                      onChange={e => setStudentForm({ ...studentForm, phone: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="student-state">Home State</label>
                    <select
                      id="student-state"
                      className="form-select"
                      value={studentForm.state}
                      onChange={e => setStudentForm({ ...studentForm, state: e.target.value })}
                    >
                      {INDIAN_STATES.filter(s => s !== 'All States').map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="student-city">City / District</label>
                    <input
                      id="student-city"
                      type="text"
                      className="form-input"
                      value={studentForm.city}
                      onChange={e => setStudentForm({ ...studentForm, city: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="student-level">Current Education Level</label>
                    <select
                      id="student-level"
                      className="form-select"
                      value={studentForm.currentEducationLevel}
                      onChange={e => setStudentForm({ ...studentForm, currentEducationLevel: e.target.value })}
                    >
                      {EDUCATION_LEVELS.map(lvl => (
                        <option key={lvl} value={lvl}>{lvl}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="student-course">Target Degree / Course</label>
                    <input
                      id="student-course"
                      type="text"
                      className="form-input"
                      placeholder="e.g. B.Tech Computer Science, MBBS, BCA, State PSC"
                      value={studentForm.intendedCourse}
                      onChange={e => setStudentForm({ ...studentForm, intendedCourse: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="student-lang">Preferred Language for Mentorship</label>
                  <select
                    id="student-lang"
                    className="form-select"
                    value={studentForm.preferredLanguage}
                    onChange={e => setStudentForm({ ...studentForm, preferredLanguage: e.target.value })}
                  >
                    {LANGUAGES_LIST.filter(l => l !== 'All Languages').map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="student-notes">First-Gen Family Background (Optional)</label>
                  <textarea
                    id="student-notes"
                    className="form-textarea"
                    rows={3}
                    placeholder="Share your background or the specific hurdles you are facing."
                    value={studentForm.firstGenNote || ''}
                    onChange={e => setStudentForm({ ...studentForm, firstGenNote: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <button type="submit" className="btn btn-cream" disabled={isSaving}>
                    {isSaving ? 'Saving to Database...' : 'Save Student Profile'}
                  </button>
                </div>
              </form>
            )}

            {/* MENTOR PROFILE FORM */}
            {role === 'mentor' && (
              <form onSubmit={handleMentorSubmit} className="card" style={{ padding: '2.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem' }}>
                  Graduate Alumni Credentials &amp; Bio
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="mentor-name">Full Name</label>
                    <input
                      id="mentor-name"
                      type="text"
                      className="form-input"
                      required
                      value={mentorForm.fullName}
                      onChange={e => setMentorForm({ ...mentorForm, fullName: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="mentor-email">Email Address</label>
                    <input
                      id="mentor-email"
                      type="email"
                      className="form-input"
                      required
                      value={mentorForm.email}
                      onChange={e => setMentorForm({ ...mentorForm, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="mentor-phone">
                    WhatsApp Number
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400, marginLeft: '0.5rem' }}>
                      (Kept private &bull; used for 1-click WhatsApp redirect when queries are accepted)
                    </span>
                  </label>
                  <input
                    id="mentor-phone"
                    type="text"
                    className="form-input"
                    placeholder="+91 98XXX XXXXX"
                    value={mentorForm.phone || ''}
                    onChange={e => setMentorForm({ ...mentorForm, phone: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="mentor-college">Graduation Alma Mater</label>
                    <input
                      id="mentor-college"
                      type="text"
                      className="form-input"
                      required
                      value={mentorForm.graduationCollege}
                      onChange={e => setMentorForm({ ...mentorForm, graduationCollege: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="mentor-degree">Degree &amp; Branch</label>
                    <input
                      id="mentor-degree"
                      type="text"
                      className="form-input"
                      required
                      value={mentorForm.degree}
                      onChange={e => setMentorForm({ ...mentorForm, degree: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="mentor-year">Graduation Year</label>
                    <input
                      id="mentor-year"
                      type="text"
                      className="form-input"
                      placeholder="e.g. 2022"
                      value={mentorForm.graduationYear || ''}
                      onChange={e => setMentorForm({ ...mentorForm, graduationYear: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="mentor-expertise">Core Guidance Expertise</label>
                    <input
                      id="mentor-expertise"
                      type="text"
                      className="form-input"
                      value={mentorForm.expertise}
                      onChange={e => setMentorForm({ ...mentorForm, expertise: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="mentor-avail">Weekly Availability Window</label>
                  <input
                    id="mentor-avail"
                    type="text"
                    className="form-input"
                    value={mentorForm.availability}
                    onChange={e => setMentorForm({ ...mentorForm, availability: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="mentor-bio">Your First-Gen Journey &amp; Advice</label>
                  <textarea
                    id="mentor-bio"
                    className="form-textarea"
                    rows={4}
                    value={mentorForm.shortBio}
                    onChange={e => setMentorForm({ ...mentorForm, shortBio: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <button type="submit" className="btn btn-cream" disabled={isSaving}>
                    {isSaving ? 'Saving to Database...' : 'Save Mentor Profile'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* DANGER ZONE: PERMANENT ACCOUNT DELETION */}
        <div className="card" style={{ 
          marginTop: '2.5rem', 
          borderColor: '#FCA5A5', 
          background: 'rgba(254, 242, 242, 0.75)',
          padding: '1.75rem 2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '1.2rem' }}>⚠️</span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#991B1B', margin: 0 }}>
                  Danger Zone: Permanent Account Deletion
                </h3>
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#7F1D1D', lineHeight: 1.5, maxWidth: '560px' }}>
                Permanently erase your {role === 'mentor' ? 'mentor profile, verification files, scheduled meetings, and reviews' : 'student profile, verification files, and inquiry history'} from PehliPeedhi. This action is irreversible.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => {
                setConfirmText('');
                setShowDeleteModal(true);
              }}
              id="delete-account-trigger-btn"
              style={{
                background: '#DC2626',
                color: '#FFFFFF',
                border: '1px solid #B91C1C',
                fontWeight: 700,
                padding: '0.65rem 1.35rem',
                borderRadius: 'var(--radius-sm)',
                boxShadow: 'var(--shadow-sm)',
                cursor: 'pointer'
              }}
            >
              🗑️ Delete Account Permanently
            </button>
          </div>
        </div>

        {/* DELETE ACCOUNT CONFIRMATION MODAL */}
        {showDeleteModal && (
          <div className="modal-overlay" onClick={() => !isDeletingAccount && setShowDeleteModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px', borderTop: '5px solid #DC2626' }}>
              <div className="modal-header">
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#991B1B', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>🗑️</span>
                    <span>Confirm Account Deletion</span>
                  </h3>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Account: <strong>{currentUser?.email}</strong> ({currentUser?.name})
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => !isDeletingAccount && setShowDeleteModal(false)}
                  disabled={isDeletingAccount}
                  style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1, color: 'var(--text-muted)' }}
                >
                  &times;
                </button>
              </div>

              <div className="modal-body">
                <div style={{
                  background: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem 1.15rem',
                  fontSize: '0.875rem',
                  color: '#991B1B',
                  marginBottom: '1.25rem',
                  lineHeight: 1.5
                }}>
                  <strong>Warning:</strong> You are about to permanently delete your entire account.
                  <ul style={{ margin: '0.5rem 0 0 1.25rem', padding: 0 }}>
                    <li>Your public directory profile and credentials will be removed.</li>
                    <li>All scheduled Google Meet invites, chat links, and notes will be deleted.</li>
                    <li>All star ratings and student feedback will be erased.</li>
                    <li>You will be logged out and cannot recover this account.</li>
                  </ul>
                </div>

                <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                  <label className="form-label" htmlFor="delete-confirm-input" style={{ fontSize: '0.85rem' }}>
                    To confirm, please type <strong>DELETE</strong> below:
                  </label>
                  <input
                    id="delete-confirm-input"
                    type="text"
                    className="form-input"
                    value={confirmText}
                    onChange={e => setConfirmText(e.target.value)}
                    placeholder="DELETE"
                    disabled={isDeletingAccount}
                    autoFocus
                  />
                </div>
              </div>

              <div className="modal-footer" style={{ borderTop: '1px solid var(--border-glass)' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeletingAccount}
                >
                  Cancel &amp; Keep Account
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={async () => {
                    setIsDeletingAccount(true);
                    const ok = await deleteAccount();
                    setIsDeletingAccount(false);
                    if (ok) {
                      setShowDeleteModal(false);
                      router.replace('/');
                    }
                  }}
                  disabled={confirmText.trim().toUpperCase() !== 'DELETE' || isDeletingAccount}
                  id="confirm-delete-account-btn"
                  style={{
                    background: confirmText.trim().toUpperCase() === 'DELETE' ? '#DC2626' : '#9CA3AF',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 700,
                    cursor: confirmText.trim().toUpperCase() === 'DELETE' ? 'pointer' : 'not-allowed'
                  }}
                >
                  {isDeletingAccount ? 'Deleting Account...' : 'Permanently Delete Account'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
