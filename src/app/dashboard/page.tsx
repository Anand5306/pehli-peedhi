'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { getWhatsAppRedirectUrl } from '../../lib/whatsapp';
import { MentorshipRequest } from '../../types';

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M12.031 2C6.5 2 2 6.5 2 12.031c0 1.947.562 3.844 1.625 5.484L2 22l4.641-1.594A10.02 10.02 0 0 0 12.031 22c5.531 0 10.031-4.5 10.031-10.031C22.062 6.5 17.562 2 12.031 2zm0 18.25c-1.687 0-3.328-.469-4.75-1.344l-.344-.203-2.844.984.984-2.766-.219-.359a8.16 8.16 0 0 1-1.344-4.531c0-4.563 3.719-8.281 8.281-8.281 4.563 0 8.281 3.719 8.281 8.281 0 4.563-3.719 8.25-8.281 8.25zm4.844-6.406c-.266-.141-1.578-.781-1.828-.875-.25-.094-.438-.141-.625.141-.188.281-.719.875-.875 1.062-.156.188-.328.203-.594.078-.266-.141-1.125-.406-2.141-1.312-.797-.703-1.344-1.578-1.5-1.844-.156-.266-.016-.406.125-.547.125-.125.266-.328.406-.484.141-.156.188-.266.281-.438.094-.188.047-.359-.031-.5-.078-.141-.625-1.5-.859-2.062-.234-.547-.469-.469-.641-.484l-.547-.016c-.188 0-.5.078-.766.359-.266.281-1.016.984-1.016 2.406s1.047 2.797 1.188 2.984c.156.188 2.062 3.156 5 4.422.703.312 1.25.484 1.672.625.703.219 1.344.188 1.844.109.562-.078 1.578-.641 1.797-1.266.219-.625.219-1.156.156-1.266-.062-.109-.234-.172-.5-.312z" />
    </svg>
  );
}

function MailIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function VideoIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
      <rect x="2" y="6" width="14" height="12" rx="2" />
    </svg>
  );
}

function BellIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function CheckCircleIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function CopyIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

function generateRandomGMeet(): string {
  const s1 = Math.random().toString(36).substring(2, 5);
  const s2 = Math.random().toString(36).substring(2, 6);
  const s3 = Math.random().toString(36).substring(2, 5);
  return `https://meet.google.com/${s1}-${s2}-${s3}`;
}

export default function DashboardPage() {
  const router = useRouter();
  const { 
    isLoaded, 
    role, 
    requests, 
    mentors, 
    updateRequestStatus, 
    acceptRequestWithGMeet, 
    notifyMeetingOver, 
    studentProfile, 
    mentorProfile, 
    currentUser, 
    submitMentorFeedback 
  } = useApp();

  // Accept & Schedule Google Meet Modal States
  const [scheduleModalReq, setScheduleModalReq] = useState<MentorshipRequest | null>(null);
  const [gmeetLinkInput, setGmeetLinkInput] = useState('');
  const [gmeetDateInput, setGmeetDateInput] = useState('');
  const [gmeetTimeInput, setGmeetTimeInput] = useState('');
  const [gmeetNoteInput, setGmeetNoteInput] = useState('');
  const [isSubmittingSchedule, setIsSubmittingSchedule] = useState(false);

  // Notify Meeting Over Modal States
  const [completingReq, setCompletingReq] = useState<MentorshipRequest | null>(null);
  const [completionNote, setCompletionNote] = useState('');
  const [isSubmittingCompletion, setIsSubmittingCompletion] = useState(false);

  // Email Preview Modal
  const [emailPreviewReq, setEmailPreviewReq] = useState<MentorshipRequest | null>(null);

  // Copy status tracker
  const [copiedReqId, setCopiedReqId] = useState<string | null>(null);

  // Feedback & Star Rating Modal States
  const [feedbackModalReq, setFeedbackModalReq] = useState<MentorshipRequest | null>(null);
  const [ratingScore, setRatingScore] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedbackComment, setFeedbackComment] = useState<string>('');
  const [feedbackTags, setFeedbackTags] = useState<string[]>([]);

  useEffect(() => {
    if (isLoaded && (!currentUser || role === 'guest')) {
      router.replace('/');
    }
  }, [isLoaded, currentUser, role, router]);

  // Filtering requests strictly for the currently authenticated user
  const studentRequests = requests.filter(r => 
    (currentUser && (r.studentId === currentUser.id || r.studentName === currentUser.name || (currentUser.email && r.studentEmail === currentUser.email))) ||
    (studentProfile.fullName && r.studentName === studentProfile.fullName) ||
    (studentProfile.email && r.studentEmail === studentProfile.email)
  );

  const mentorRequests = requests.filter(r => 
    (currentUser && (r.mentorId === currentUser.id || r.mentorName === currentUser.name || (currentUser.email && r.mentorEmail === currentUser.email))) ||
    (mentorProfile.fullName && r.mentorName === mentorProfile.fullName) ||
    (mentorProfile.email && r.mentorEmail === mentorProfile.email)
  );

  // Active mentor record from the global directory
  const activeMentorRecord = mentors.find(m => 
    (currentUser && m.id === currentUser.id) || 
    (currentUser?.email && m.email?.toLowerCase() === currentUser.email?.toLowerCase()) ||
    (currentUser?.name && m.fullName?.toLowerCase() === currentUser.name?.toLowerCase()) ||
    (mentorProfile.id && m.id === mentorProfile.id) ||
    (mentorProfile.email && m.email?.toLowerCase() === mentorProfile.email?.toLowerCase()) ||
    (mentorProfile.fullName && m.fullName?.toLowerCase() === mentorProfile.fullName?.toLowerCase())
  );

  // Dynamic review count and star rating calculation across all data sources
  const allReviewsMap = new Map<string, { rating: number; date?: string; meetingDate?: string; meetingTime?: string; topic?: string }>();

  if (activeMentorRecord?.reviews) {
    activeMentorRecord.reviews.forEach(r => {
      const key = r.requestId || r.id || `${r.studentId}-${r.rating}`;
      allReviewsMap.set(key, r);
    });
  }

  if (mentorProfile?.reviews) {
    mentorProfile.reviews.forEach(r => {
      const key = r.requestId || r.id || `${r.studentId}-${r.rating}`;
      if (!allReviewsMap.has(key)) {
        allReviewsMap.set(key, r);
      }
    });
  }

  mentorRequests.forEach(req => {
    const star = req.rating || req.feedback?.rating;
    if (star) {
      const key = req.id;
      if (!allReviewsMap.has(key)) {
        allReviewsMap.set(key, {
          rating: Number(star),
          meetingDate: req.meetingDate || req.feedback?.meetingDate || req.date,
          meetingTime: req.meetingTime || req.feedback?.meetingTime || req.meetingScheduledTime || 'Scheduled Session',
          topic: req.topic
        });
      }
    }
  });

  const allReviewsList = Array.from(allReviewsMap.values());
  const totalReviewsCount = Math.max(
    allReviewsList.length,
    activeMentorRecord?.reviewCount || 0,
    mentorProfile.reviewCount || 0
  );

  let displayRating = 0;
  if (allReviewsList.length > 0) {
    const sum = allReviewsList.reduce((acc, curr) => acc + (Number(curr.rating) || 0), 0);
    displayRating = Number((sum / allReviewsList.length).toFixed(1));
  } else if (activeMentorRecord?.rating && Number(activeMentorRecord.rating) > 0 && (activeMentorRecord.reviewCount || 0) > 0) {
    displayRating = Number(activeMentorRecord.rating);
  } else if (mentorProfile?.rating && Number(mentorProfile.rating) > 0 && (mentorProfile.reviewCount || 0) > 0) {
    displayRating = Number(mentorProfile.rating);
  }

  // Requests that have completed meetings where student has not yet submitted feedback
  const pendingFeedbackRequests = studentRequests.filter(r => r.meetingCompleted && !r.feedback);

  const handleOpenScheduleModal = (req: MentorshipRequest) => {
    setScheduleModalReq(req);
    setGmeetLinkInput(req.meetingLink || generateRandomGMeet());
    const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    setGmeetDateInput(req.meetingDate || (req.meetingScheduledTime?.includes('at') ? req.meetingScheduledTime.split('at')[0].trim() : today));
    setGmeetTimeInput(req.meetingTime || (req.meetingScheduledTime?.includes('at') ? req.meetingScheduledTime.split('at')[1].trim() : '5:00 PM IST'));
    setGmeetNoteInput(req.mentorResponseNote || 'Glad to guide you! Please review your queries beforehand and join the Google Meet link promptly.');
  };

  const handleConfirmSchedule = async () => {
    if (!scheduleModalReq) return;
    setIsSubmittingSchedule(true);
    try {
      const cleanDate = gmeetDateInput.trim() || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      const cleanTime = gmeetTimeInput.trim() || '5:00 PM IST';
      const combinedTime = `${cleanDate} at ${cleanTime}`;
      await acceptRequestWithGMeet(
        scheduleModalReq.id,
        gmeetLinkInput.trim() || generateRandomGMeet(),
        combinedTime,
        gmeetNoteInput.trim(),
        cleanDate
      );
      setScheduleModalReq(null);
    } finally {
      setIsSubmittingSchedule(false);
    }
  };

  const handleConfirmMeetingOver = async () => {
    if (!completingReq) return;
    setIsSubmittingCompletion(true);
    try {
      await notifyMeetingOver(completingReq.id, completionNote.trim());
      setCompletingReq(null);
    } finally {
      setIsSubmittingCompletion(false);
    }
  };

  const handleCopyLink = (reqId: string, link: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(link);
      setCopiedReqId(reqId);
      setTimeout(() => setCopiedReqId(null), 2500);
    }
  };

  const isVerified = role === 'mentor' ? !!mentorProfile.verified : !!studentProfile.verified;

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
              Please sign in to view your dashboard.
            </p>
            <Link href="/auth" className="btn btn-cream" style={{ width: '100%', justifyContent: 'center' }}>
              Sign In to PehliPeedhi
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '3rem 0 5rem' }}>
      <div className="container">
        {/* Top Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid var(--border-glass)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
              <span className="badge badge-cream">Dashboard</span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                Portal: <strong>{role === 'mentor' ? 'Graduate Mentor' : 'First-Gen Student'}</strong>
              </span>
              {isVerified ? (
                <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  ✓ {role === 'mentor' ? 'Verified Alumni Mentor' : 'Verified First-Gen Student'}
                </span>
              ) : (
                <Link 
                  href="/profile" 
                  className="badge badge-glass" 
                  style={{ color: '#D97706', borderColor: '#FDE68A', background: '#FEF3C7', textDecoration: 'none' }}
                  title="Verify your profile in Profile Settings"
                >
                  ⚠️ Not Verified &bull; Complete in Profile &rarr;
                </Link>
              )}
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              {role === 'mentor' 
                ? `${currentUser?.name || mentorProfile.fullName}'s Mentor Portal` 
                : `${currentUser?.name || studentProfile.fullName}'s Student Portal`}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {role === 'student' && (
              <Link href="/find-mentors" className="btn btn-sm btn-cream">
                Find Mentors
              </Link>
            )}
            <Link href="/profile" className="btn btn-sm btn-secondary">
              Profile Settings
            </Link>
          </div>
        </div>

        {/* Verification Alert Banner if Unverified */}
        {!isVerified && (
          <div style={{
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: '1.1rem 1.35rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <strong style={{ color: '#92400E', fontSize: '0.95rem' }}>Account Verification Required:</strong>{' '}
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                {role === 'mentor' 
                  ? 'Verify your graduation credentials in Profile Settings to unlock the Verified Alumni badge.'
                  : 'Verify your school or college student status in Profile Settings to earn the Verified Student badge.'}
              </span>
            </div>
            <Link href="/profile" className="btn btn-sm btn-cream">
              Verify in Profile Settings &rarr;
            </Link>
          </div>
        )}

        {/* STUDENT VIEW */}
        {role === 'student' && (
          <div>
            {/* REAL-TIME NOTIFICATION BANNER: When Mentor Notifies Meeting is Over */}
            {pendingFeedbackRequests.length > 0 && (
              <div className="feedback-notification-card">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: '#F59E0B',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: '0 2px 8px rgba(245, 158, 11, 0.4)'
                    }}>
                      <BellIcon size={22} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <strong style={{ color: '#92400E', fontSize: '1.05rem' }}>
                          Mentorship Meeting Over &bull; Feedback Requested
                        </strong>
                        <span className="badge" style={{ background: '#F59E0B', color: '#FFFFFF', fontWeight: 700, fontSize: '0.7rem' }}>
                          Action Needed
                        </span>
                      </div>
                      <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.875rem', color: '#78350F', lineHeight: 1.5 }}>
                        <strong>{pendingFeedbackRequests[0].mentorName}</strong> has marked your Google Meet session as completed! Please take 30 seconds to rate your session. Your feedback directly updates their rating on the mentor directory.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-notify-over"
                    onClick={() => {
                      setFeedbackModalReq(pendingFeedbackRequests[0]);
                      setRatingScore(5);
                      setFeedbackComment('');
                      setFeedbackTags([]);
                    }}
                    id="banner-rate-mentor-btn"
                  >
                    ★ Rate Session &amp; Submit Feedback
                  </button>
                </div>
              </div>
            )}

            {/* Student Stats Summary */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2rem'
            }}>
              <div className="card">
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Requests</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
                  {studentRequests.length}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {studentRequests.filter(r => r.status === 'Accepted' || r.status === 'Completed').length} Accepted Sessions
                </div>
              </div>

              <div className="card">
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>Target Degree</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '6px' }}>
                  {studentProfile.intendedCourse || 'Higher Education'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {studentProfile.currentEducationLevel}
                </div>
              </div>

              <div className="card">
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>Language &amp; Region</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '6px' }}>
                  {studentProfile.preferredLanguage}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {studentProfile.city}, {studentProfile.state}
                </div>
              </div>
            </div>

            {/* Requests List Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                My Mentorship Requests &amp; Responses
              </h2>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Link href="/entrance-exams" className="btn btn-sm btn-secondary" id="student-dash-entrance-exams-btn">
                  🎯 Entrance Exams Directory
                </Link>
                <Link href="/find-mentors" className="btn btn-sm btn-cream">
                  Browse Verified Mentors
                </Link>
              </div>
            </div>

            {studentRequests.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {studentRequests.map(req => {
                  const isAccepted = req.status === 'Accepted' || req.status === 'Completed';
                  const isCompleted = req.status === 'Completed';
                  const isDeclined = req.status === 'Declined';
                  const isPending = req.status === 'Pending';

                  return (
                    <div 
                      key={req.id} 
                      className="card" 
                      style={{ 
                        borderLeft: isCompleted 
                          ? '4px solid #F59E0B' 
                          : req.meetingCompleted 
                          ? '4px solid #D97706' 
                          : isAccepted 
                          ? '4px solid var(--success)' 
                          : isDeclined 
                          ? '4px solid #DC2626' 
                          : '4px solid #3B82F6'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                              Mentor: {req.mentorName}
                            </h3>
                            <span className={`badge ${isCompleted ? 'badge-cream' : isAccepted ? 'badge-success' : 'badge-glass'}`}>
                              {isCompleted ? '★ Completed & Rated' : req.meetingCompleted ? '🔔 Meeting Over - Feedback Due' : req.status}
                            </span>
                            {req.meetingLink && (
                              <span className="badge" style={{ background: '#EFF6FF', color: '#1D4ED8', borderColor: '#BFDBFE', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                <VideoIcon size={12} /> Google Meet
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {req.mentorCollege || 'Alumni Mentor'} &bull; Submitted {req.date} &bull; Mode: {req.preferredContact}
                          </div>
                        </div>
                      </div>

                      {/* Student question */}
                      <div style={{ 
                        background: 'rgba(255, 255, 255, 0.65)', 
                        padding: '0.85rem 1rem', 
                        borderRadius: 'var(--radius-md)', 
                        fontSize: '0.875rem',
                        marginBottom: '1rem',
                        color: 'var(--text-secondary)'
                      }}>
                        <strong>Your Query:</strong> &ldquo;{req.topic}&rdquo;
                      </div>

                      {/* Mentor Response & Guidance */}
                      {isAccepted && (
                        <div style={{
                          background: 'var(--success-bg)',
                          border: '1px solid var(--success-border)',
                          padding: '1rem',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '0.875rem',
                          color: '#14532D',
                          marginBottom: '0.85rem'
                        }}>
                          <div style={{ fontWeight: 700, marginBottom: '0.35rem' }}>
                            Mentorship Approved by {req.mentorName}
                          </div>
                          <p style={{ marginBottom: '0.75rem', lineHeight: 1.5 }}>
                            {req.mentorResponseNote || 'Mentor approved your guidance request. Contact details and Google Meet link are available below.'}
                          </p>

                          {/* Google Meet Scheduled Box */}
                          {req.meetingLink && (
                            <div style={{
                              background: '#FFFFFF',
                              border: '1px solid #BFDBFE',
                              borderRadius: 'var(--radius-md)',
                              padding: '0.9rem 1.15rem',
                              marginBottom: '0.85rem',
                              boxShadow: 'var(--shadow-sm)'
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#1A73E8', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <VideoIcon size={16} />
                                  </div>
                                  <div>
                                    <strong style={{ color: '#1E3A8A', fontSize: '0.95rem' }}>Google Meet Session</strong>
                                    <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>
                                      Live 1-on-1 Guidance Session
                                    </span>
                                  </div>
                                </div>
                                <span className={`badge ${req.meetingCompleted ? 'badge-glass' : 'badge-success'}`} style={{ fontSize: '0.72rem' }}>
                                  {req.meetingCompleted ? '✓ Concluded by Mentor' : '🟢 Session Live / Scheduled'}
                                </span>
                              </div>

                              {/* Meeting Date & Time Highlight Indicator */}
                              <div style={{
                                background: '#EFF6FF',
                                border: '1.5px solid #BFDBFE',
                                borderRadius: '8px',
                                padding: '0.75rem 1rem',
                                margin: '0.65rem 0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexWrap: 'wrap',
                                gap: '0.75rem'
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <span style={{ fontSize: '1.25rem' }}>📅</span>
                                  <div>
                                    <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700, color: '#1E40AF', letterSpacing: '0.5px' }}>
                                      Meeting Date
                                    </div>
                                    <div style={{ fontSize: '0.925rem', fontWeight: 800, color: '#1E3A8A' }}>
                                      {req.meetingDate || (req.meetingScheduledTime?.includes('at') ? req.meetingScheduledTime.split('at')[0].trim() : (req.meetingScheduledTime?.includes(',') ? req.meetingScheduledTime.split(',')[0].trim() : req.date))}
                                    </div>
                                  </div>
                                </div>

                                <div style={{ width: '1px', height: '26px', background: '#BFDBFE' }} />

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <span style={{ fontSize: '1.25rem' }}>⏰</span>
                                  <div>
                                    <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700, color: '#1E40AF', letterSpacing: '0.5px' }}>
                                      Meeting Time
                                    </div>
                                    <div style={{ fontSize: '0.925rem', fontWeight: 800, color: '#1E3A8A' }}>
                                      {req.meetingTime || (req.meetingScheduledTime?.includes('at') ? req.meetingScheduledTime.split('at')[1].trim() : (req.meetingScheduledTime || 'Scheduled Session'))}
                                    </div>
                                  </div>
                                </div>

                                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                                  <span className="badge badge-cream" style={{ fontSize: '0.7rem', fontWeight: 700 }}>
                                    Confirmed
                                  </span>
                                </div>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', marginTop: '0.65rem' }}>
                                <a
                                  href={req.meetingLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn-gmeet"
                                  id={`join-gmeet-student-${req.id}`}
                                >
                                  <VideoIcon size={16} />
                                  <span>Join Google Meet</span>
                                </a>

                                <button
                                  type="button"
                                  className="btn btn-sm btn-secondary"
                                  onClick={() => handleCopyLink(req.id, req.meetingLink || '')}
                                  title="Copy Google Meet Link"
                                >
                                  <CopyIcon size={14} />
                                  <span>{copiedReqId === req.id ? 'Copied!' : 'Copy Link'}</span>
                                </button>

                                <button
                                  type="button"
                                  className="btn btn-sm btn-secondary"
                                  onClick={() => setEmailPreviewReq(req)}
                                  title="Preview the confirmation email sent to you"
                                >
                                  <MailIcon size={14} />
                                  <span>View Email Invite</span>
                                </button>
                              </div>

                              <div style={{ fontSize: '0.75rem', color: '#1E40AF', marginTop: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                <span>📧 Meeting invitation was dispatched to your email: <strong>{req.studentEmail || currentUser?.email || 'your registered email'}</strong></span>
                              </div>
                            </div>
                          )}

                          {/* Direct WhatsApp & Email Links */}
                          <div style={{ 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            alignItems: 'center',
                            gap: '0.75rem', 
                            paddingTop: '0.85rem', 
                            borderTop: '1px solid rgba(21, 128, 61, 0.2)'
                          }}>
                            {req.mentorPhone && (
                              <a
                                href={getWhatsAppRedirectUrl(
                                  req.mentorPhone,
                                  `Namaste ${req.mentorName}! I am ${req.studentName} from PehliPeedhi connecting regarding our scheduled session: "${req.topic}".`
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-whatsapp"
                                id={`whatsapp-mentor-${req.id}`}
                              >
                                <WhatsAppIcon />
                                <span>Connect on WhatsApp</span>
                              </a>
                            )}
                            {req.mentorEmail && (
                              <a
                                href={`mailto:${req.mentorEmail}?subject=${encodeURIComponent(`PehliPeedhi Mentorship Guidance: ${req.topic}`)}`}
                                className="btn-email-link"
                                id={`email-mentor-${req.id}`}
                              >
                                <MailIcon />
                                <span>Email Mentor</span>
                              </a>
                            )}
                            <span style={{ fontSize: '0.75rem', color: '#166534', opacity: 0.9, marginLeft: 'auto' }}>
                              🔒 Private redirect &bull; Phone numbers hidden
                            </span>
                          </div>
                        </div>
                      )}

                      {/* MEETING OVER NOTIFICATION & FEEDBACK PROMPT */}
                      {isAccepted && req.meetingCompleted && !req.feedback && (
                        <div style={{
                          background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                          border: '1.5px solid #F59E0B',
                          padding: '1.1rem 1.35rem',
                          borderRadius: 'var(--radius-md)',
                          marginTop: '0.85rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '0.85rem',
                          boxShadow: '0 2px 10px rgba(245, 158, 11, 0.25)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#F59E0B', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <BellIcon size={18} />
                            </div>
                            <div>
                              <div style={{ fontWeight: 800, color: '#92400E', fontSize: '0.925rem' }}>
                                Mentor Notified: Meeting Concluded!
                              </div>
                              <div style={{ fontSize: '0.8rem', color: '#78350F', marginTop: '2px' }}>
                                {req.mentorName} marked the Google Meet session as finished. Please rate your session &amp; leave a short review!
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="btn-notify-over"
                            onClick={() => {
                              setFeedbackModalReq(req);
                              setRatingScore(5);
                              setFeedbackComment('');
                              setFeedbackTags([]);
                            }}
                            id={`rate-mentor-btn-${req.id}`}
                          >
                            ★ Rate Session &amp; Submit Feedback
                          </button>
                        </div>
                      )}

                      {/* Mentorship Meet History & Rating display (student comment hidden, date/time and rating shown) */}
                      {isAccepted && (req.feedback || req.status === 'Completed') && (
                        <div style={{
                          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(254, 243, 199, 0.3) 100%)',
                          border: '1.5px solid rgba(245, 158, 11, 0.35)',
                          padding: '1.1rem 1.25rem',
                          borderRadius: 'var(--radius-md)',
                          marginTop: '0.85rem',
                          fontSize: '0.85rem'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '1px solid rgba(245, 158, 11, 0.2)', paddingBottom: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ fontSize: '1.15rem' }}>📹</span>
                              <strong style={{ color: '#92400E', fontSize: '0.95rem' }}>Mentorship Meet History &amp; Rating</strong>
                              <span className="badge badge-success" style={{ fontSize: '0.6875rem' }}>
                                ✓ Completed
                              </span>
                            </div>
                            <div style={{ fontWeight: 800, color: '#B45309', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                              <span>Rating of Meet:</span>
                              <span style={{ color: '#F59E0B', fontSize: '1.1rem', letterSpacing: '1px' }}>
                                {'★'.repeat(req.feedback?.rating || req.rating || 5)}{'☆'.repeat(5 - (req.feedback?.rating || req.rating || 5))}
                              </span>
                              <span style={{ fontWeight: 800 }}>({req.feedback?.rating || req.rating || 5}/5)</span>
                            </div>
                          </div>

                          {/* Meet Date & Time Details */}
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '0.75rem',
                            background: '#FFFFFF',
                            border: '1px solid #FCD34D',
                            borderRadius: 'var(--radius-sm)',
                            padding: '0.85rem 1rem'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1E293B' }}>
                              <span style={{ fontSize: '1.1rem' }}>📅</span>
                              <div>
                                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700, color: '#78350F' }}>Date of Meet</div>
                                <div style={{ fontWeight: 700, color: '#1E293B' }}>
                                  {req.meetingDate || req.feedback?.meetingDate || req.date}
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1E293B' }}>
                              <span style={{ fontSize: '1.1rem' }}>⏰</span>
                              <div>
                                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700, color: '#78350F' }}>Time of Meet</div>
                                <div style={{ fontWeight: 700, color: '#1E293B' }}>
                                  {req.meetingTime || req.feedback?.meetingTime || req.meetingScheduledTime || 'Completed Session'}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div style={{ fontSize: '0.75rem', color: '#15803D', marginTop: '0.65rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <span>✓</span>
                            <span>Meet session history and rating are recorded in the database.</span>
                          </div>
                        </div>
                      )}

                      {/* Not completed yet & no feedback */}
                      {isAccepted && !req.meetingCompleted && !req.feedback && (
                        <div style={{
                          fontSize: '0.8rem',
                          color: 'var(--text-muted)',
                          marginTop: '0.65rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem'
                        }}>
                          <span>ℹ️ Once your Google Meet session is completed, your mentor will notify on the portal and you can rate your session here.</span>
                        </div>
                      )}

                      {isPending && (
                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                          Status: Awaiting review. First-generation mentors typically review inquiries and dispatch Google Meet invites within 48 hours.
                        </div>
                      )}

                      {isDeclined && (
                        <div style={{ fontSize: '0.8125rem', color: '#DC2626' }}>
                          Mentor is at full capacity this week. You can freely connect with another alumni in the directory.
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                  You have not submitted any mentorship queries yet.
                </p>
                <Link href="/find-mentors" className="btn btn-cream">
                  Explore Mentors Directory
                </Link>
              </div>
            )}
          </div>
        )}

        {/* MENTOR VIEW */}
        {role === 'mentor' && (
          <div>
            {/* Mentor Stats Summary */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2rem'
            }}>
              <div className="card">
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>Incoming Requests</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
                  {mentorRequests.length}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {mentorRequests.filter(r => r.status === 'Pending').length} Pending Review
                </div>
              </div>

              <div className="card">
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>Alumni Alma Mater</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '6px' }}>
                  {mentorProfile.graduationCollege || activeMentorRecord?.graduationCollege || 'Alumni Mentor'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {mentorProfile.degree || activeMentorRecord?.degree || 'Degree'} ({mentorProfile.graduationYear || activeMentorRecord?.graduationYear || '2024'})
                </div>
              </div>

              <div className="card">
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>Student Ratings</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ color: '#F59E0B', letterSpacing: '0.5px' }}>
                    {totalReviewsCount > 0 
                      ? '★'.repeat(Math.min(5, Math.max(0, Math.round(displayRating)))) + '☆'.repeat(5 - Math.min(5, Math.max(0, Math.round(displayRating))))
                      : '☆☆☆☆☆'}
                  </span>
                  <span>{displayRating.toFixed(1)} / 5.0</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Based on {totalReviewsCount} student review{totalReviewsCount === 1 ? '' : 's'}
                </div>
              </div>
            </div>

            {/* Incoming Requests List */}
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.25rem' }}>
              Student Inquiries Requiring Your Guidance
            </h2>

            {mentorRequests.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {mentorRequests.map(req => {
                  const isPending = req.status === 'Pending';
                  const isAccepted = req.status === 'Accepted' || req.status === 'Completed';

                  return (
                    <div 
                      key={req.id} 
                      className="card" 
                      style={{ 
                        borderLeft: isPending 
                          ? '4px solid #2563EB' 
                          : req.meetingCompleted 
                          ? '4px solid #10B981' 
                          : isAccepted 
                          ? '4px solid var(--success)' 
                          : '4px solid var(--border-glass)' 
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                              Student: {req.studentName}
                            </h3>
                            <span className={`badge ${req.meetingCompleted ? 'badge-cream' : isAccepted ? 'badge-success' : 'badge-glass'}`}>
                              {req.meetingCompleted ? '✓ Meeting Concluded' : req.status}
                            </span>
                            {req.meetingLink && (
                              <span className="badge" style={{ background: '#EFF6FF', color: '#1D4ED8', borderColor: '#BFDBFE', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                <VideoIcon size={12} /> Google Meet
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            Student Email: <strong>{req.studentEmail || 'Registered Student'}</strong> &bull; Aiming for: <strong>{req.intendedCourse || 'Higher Education'}</strong> &bull; Language: {req.studentLanguage}
                          </div>
                        </div>

                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Submitted: {req.date} &bull; Mode: {req.preferredContact}
                        </div>
                      </div>

                      {/* Question */}
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.65)',
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.9rem',
                        marginBottom: '1rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.5
                      }}>
                        <strong>Student Question:</strong> &ldquo;{req.topic}&rdquo;
                      </div>

                      {/* Action buttons if pending */}
                      {isPending && (
                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            className="btn btn-sm btn-cream"
                            onClick={() => handleOpenScheduleModal(req)}
                            id={`accept-schedule-btn-${req.id}`}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.45rem',
                              fontWeight: 700
                            }}
                          >
                            <VideoIcon size={16} />
                            <span>Accept &amp; Schedule Google Meet</span>
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-secondary"
                            onClick={() => updateRequestStatus(req.id, 'Declined', 'Mentor is currently at full capacity.')}
                          >
                            Decline
                          </button>
                        </div>
                      )}

                      {/* Accepted State Details */}
                      {isAccepted && (
                        <div style={{
                          background: 'var(--success-bg)',
                          border: '1px solid var(--success-border)',
                          padding: '1rem',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '0.875rem',
                          color: '#14532D',
                          marginTop: '0.75rem'
                        }}>
                          <div style={{ fontWeight: 700, marginBottom: '0.35rem' }}>
                            Guidance Accepted &bull; Google Meet Session Active
                          </div>
                          <p style={{ margin: '0 0 0.85rem 0', lineHeight: 1.5 }}>
                            <strong>Your Message:</strong> &ldquo;{req.mentorResponseNote}&rdquo;
                          </p>

                          {/* Google Meet Card */}
                          {req.meetingLink && (
                            <div style={{
                              background: '#FFFFFF',
                              border: '1px solid #BFDBFE',
                              borderRadius: 'var(--radius-md)',
                              padding: '0.9rem 1.15rem',
                              marginBottom: '0.85rem',
                              boxShadow: 'var(--shadow-sm)'
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#1A73E8', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <VideoIcon size={16} />
                                  </div>
                                  <div>
                                    <strong style={{ color: '#1E3A8A', fontSize: '0.95rem' }}>Google Meet Link</strong>
                                    <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>
                                      Live 1-on-1 Guidance Session
                                    </span>
                                  </div>
                                </div>
                                <span className={`badge ${req.meetingCompleted ? 'badge-glass' : 'badge-success'}`} style={{ fontSize: '0.72rem' }}>
                                  {req.meetingCompleted ? '✓ Concluded' : '🟢 Session Ready'}
                                </span>
                              </div>

                              {/* Meeting Date & Time Highlight Indicator */}
                              <div style={{
                                background: '#EFF6FF',
                                border: '1.5px solid #BFDBFE',
                                borderRadius: '8px',
                                padding: '0.75rem 1rem',
                                margin: '0.65rem 0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexWrap: 'wrap',
                                gap: '0.75rem'
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <span style={{ fontSize: '1.25rem' }}>📅</span>
                                  <div>
                                    <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700, color: '#1E40AF', letterSpacing: '0.5px' }}>
                                      Meeting Date
                                    </div>
                                    <div style={{ fontSize: '0.925rem', fontWeight: 800, color: '#1E3A8A' }}>
                                      {req.meetingDate || (req.meetingScheduledTime?.includes('at') ? req.meetingScheduledTime.split('at')[0].trim() : (req.meetingScheduledTime?.includes(',') ? req.meetingScheduledTime.split(',')[0].trim() : req.date))}
                                    </div>
                                  </div>
                                </div>

                                <div style={{ width: '1px', height: '26px', background: '#BFDBFE' }} />

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <span style={{ fontSize: '1.25rem' }}>⏰</span>
                                  <div>
                                    <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700, color: '#1E40AF', letterSpacing: '0.5px' }}>
                                      Meeting Time
                                    </div>
                                    <div style={{ fontSize: '0.925rem', fontWeight: 800, color: '#1E3A8A' }}>
                                      {req.meetingTime || (req.meetingScheduledTime?.includes('at') ? req.meetingScheduledTime.split('at')[1].trim() : (req.meetingScheduledTime || 'Scheduled Session'))}
                                    </div>
                                  </div>
                                </div>

                                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                                  <span className="badge badge-cream" style={{ fontSize: '0.7rem', fontWeight: 700 }}>
                                    Confirmed
                                  </span>
                                </div>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', marginTop: '0.65rem' }}>
                                <a
                                  href={req.meetingLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn-gmeet"
                                  id={`open-gmeet-mentor-${req.id}`}
                                >
                                  <VideoIcon size={16} />
                                  <span>Open Google Meet</span>
                                </a>

                                <button
                                  type="button"
                                  className="btn btn-sm btn-secondary"
                                  onClick={() => handleCopyLink(req.id, req.meetingLink || '')}
                                >
                                  <CopyIcon size={14} />
                                  <span>{copiedReqId === req.id ? 'Copied!' : 'Copy Meet Link'}</span>
                                </button>

                                <button
                                  type="button"
                                  className="btn btn-sm btn-secondary"
                                  onClick={() => setEmailPreviewReq(req)}
                                >
                                  <MailIcon size={14} />
                                  <span>Preview Sent Email</span>
                                </button>
                              </div>

                              <div style={{ fontSize: '0.75rem', color: '#1E40AF', marginTop: '0.65rem' }}>
                                📧 Invitation email was dispatched to student: <strong>{req.studentEmail}</strong>
                              </div>
                            </div>
                          )}

                          {/* WhatsApp & Email buttons */}
                          <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            gap: '0.75rem',
                            paddingTop: '0.75rem',
                            borderTop: '1px solid rgba(21, 128, 61, 0.2)'
                          }}>
                            {req.studentPhone && (
                              <a
                                href={getWhatsAppRedirectUrl(
                                  req.studentPhone,
                                  `Namaste ${req.studentName}! I am ${req.mentorName} from PehliPeedhi following up on our scheduled session: "${req.topic}".`
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-whatsapp"
                                id={`whatsapp-student-${req.id}`}
                              >
                                <WhatsAppIcon />
                                <span>Message Student on WhatsApp</span>
                              </a>
                            )}
                            {req.studentEmail && (
                              <a
                                href={`mailto:${req.studentEmail}?subject=${encodeURIComponent(`PehliPeedhi Mentorship Guidance: ${req.topic}`)}`}
                                className="btn-email-link"
                                id={`email-student-${req.id}`}
                              >
                                <MailIcon />
                                <span>Email Student</span>
                              </a>
                            )}
                            <span style={{ fontSize: '0.75rem', color: '#166534', opacity: 0.9, marginLeft: 'auto' }}>
                              🔒 Private redirect &bull; Phone numbers hidden
                            </span>
                          </div>

                          {/* "MEETING OVER" NOTIFICATION TRIGGER */}
                          {!req.meetingCompleted ? (
                            <div style={{
                              background: 'rgba(245, 158, 11, 0.1)',
                              border: '1px solid rgba(245, 158, 11, 0.3)',
                              borderRadius: 'var(--radius-md)',
                              padding: '0.9rem 1.15rem',
                              marginTop: '1rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              flexWrap: 'wrap',
                              gap: '0.85rem'
                            }}>
                              <div>
                                <div style={{ fontWeight: 700, color: '#92400E', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                  <BellIcon size={16} />
                                  <span>Google Meet Session Over?</span>
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#B45309', marginTop: '2px' }}>
                                  Click below once the call ends. The student will be notified on their dashboard to leave a star rating and feedback for your profile.
                                </div>
                              </div>
                              <button
                                type="button"
                                className="btn-notify-over"
                                onClick={() => {
                                  setCompletingReq(req);
                                  setCompletionNote('');
                                }}
                                id={`notify-meeting-over-btn-${req.id}`}
                              >
                                🔔 Notify: Meeting Over (Request Feedback)
                              </button>
                            </div>
                          ) : (
                            <div style={{
                              background: 'rgba(21, 128, 61, 0.08)',
                              border: '1px solid rgba(21, 128, 61, 0.25)',
                              borderRadius: 'var(--radius-md)',
                              padding: '0.9rem 1.15rem',
                              marginTop: '1rem'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#166534', fontWeight: 700, fontSize: '0.875rem' }}>
                                  <CheckCircleIcon size={18} />
                                  <span>Meeting Concluded {req.meetingCompletedAt ? `(${req.meetingCompletedAt})` : ''}</span>
                                </div>
                                <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>
                                  Student Notified on Dashboard
                                </span>
                              </div>

                              {!req.feedback ? (
                                <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                  Waiting for {req.studentName} to rate the session and submit their review on their student dashboard.
                                </p>
                              ) : (
                                <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(21, 128, 61, 0.2)' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.65rem' }}>
                                    <div style={{ fontWeight: 800, color: '#B45309', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                      <span>Meet History &amp; Rating:</span>
                                      <span style={{ color: '#F59E0B', fontSize: '1.05rem', letterSpacing: '1px' }}>
                                        {'★'.repeat(req.feedback?.rating || req.rating || 5)}{'☆'.repeat(5 - (req.feedback?.rating || req.rating || 5))}
                                      </span>
                                      <span>({req.feedback?.rating || req.rating || 5}/5)</span>
                                    </div>
                                    <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                                      ✓ Verified Meet Recorded
                                    </span>
                                  </div>

                                  {/* Meeting Date & Time Details */}
                                  <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                                    gap: '0.75rem',
                                    background: '#FFFFFF',
                                    border: '1px solid #BFDBFE',
                                    borderRadius: 'var(--radius-sm)',
                                    padding: '0.85rem 1rem',
                                    fontSize: '0.8125rem'
                                  }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1E293B' }}>
                                      <span style={{ fontSize: '1.1rem' }}>📅</span>
                                      <div>
                                        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700, color: '#1E40AF' }}>Date of Meet</div>
                                        <div style={{ fontWeight: 700, color: '#1E293B' }}>
                                          {req.meetingDate || req.feedback?.meetingDate || req.date}
                                        </div>
                                      </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1E293B' }}>
                                      <span style={{ fontSize: '1.1rem' }}>⏰</span>
                                      <div>
                                        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700, color: '#1E40AF' }}>Time of Meet</div>
                                        <div style={{ fontWeight: 700, color: '#1E293B' }}>
                                          {req.meetingTime || req.feedback?.meetingTime || req.meetingScheduledTime || 'Scheduled Session'}
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div style={{ fontSize: '0.75rem', color: '#15803D', marginTop: '0.5rem', fontWeight: 600 }}>
                                    ✓ Rating has updated your public score on the mentor directory.
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                <p style={{ color: 'var(--text-secondary)' }}>
                  No incoming student queries right now. As first-generation students submit questions in your field, they will appear here.
                </p>
              </div>
            )}
          </div>
        )}

        {/* MODAL: Accept Request & Schedule Google Meet (Dispatches Student Email) */}
        {scheduleModalReq && (
          <div className="modal-overlay" onClick={() => setScheduleModalReq(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '580px' }}>
              <div className="modal-header">
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <VideoIcon size={20} />
                    <span>Schedule Google Meet &amp; Send Invite</span>
                  </h3>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Mentoring: <strong>{scheduleModalReq.studentName}</strong> ({scheduleModalReq.studentEmail})
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => setScheduleModalReq(null)}
                  style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1, color: 'var(--text-muted)' }}
                >
                  &times;
                </button>
              </div>

              <div className="modal-body">
                {/* Student Query Review */}
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 'var(--radius-md)', padding: '0.85rem 1rem', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                  <div style={{ fontWeight: 600, color: '#475569', marginBottom: '2px' }}>Student Inquiry:</div>
                  <div style={{ color: '#0F172A', fontStyle: 'italic' }}>&ldquo;{scheduleModalReq.topic}&rdquo;</div>
                </div>

                {/* Google Meet Link Field */}
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <label className="form-label" htmlFor="gmeet-link-input" style={{ margin: 0 }}>
                      Google Meet Link
                    </label>
                    <button
                      type="button"
                      onClick={() => setGmeetLinkInput(generateRandomGMeet())}
                      style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                    >
                      🔄 Generate New Link
                    </button>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="gmeet-link-input"
                      type="url"
                      className="form-input"
                      value={gmeetLinkInput}
                      onChange={e => setGmeetLinkInput(e.target.value)}
                      placeholder="https://meet.google.com/xxx-yyyy-zzz"
                      required
                    />
                  </div>
                  <div className="form-hint">
                    This Google Meet link will be automatically dispatched to {scheduleModalReq.studentName}&apos;s email.
                  </div>
                </div>

                {/* Scheduled Date & Time Fields */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor="gmeet-date-input">
                      📅 Meeting Date
                    </label>
                    <input
                      id="gmeet-date-input"
                      type="text"
                      className="form-input"
                      value={gmeetDateInput}
                      onChange={e => setGmeetDateInput(e.target.value)}
                      placeholder="e.g. 26 Oct 2026 or Tomorrow"
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor="gmeet-time-input">
                      ⏰ Meeting Time
                    </label>
                    <input
                      id="gmeet-time-input"
                      type="text"
                      className="form-input"
                      value={gmeetTimeInput}
                      onChange={e => setGmeetTimeInput(e.target.value)}
                      placeholder="e.g. 5:00 PM IST"
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.45rem', marginBottom: '1rem' }}>
                  {['5:00 PM IST', '6:00 PM IST', '4:00 PM IST', '11:00 AM IST'].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setGmeetTimeInput(opt)}
                      style={{
                        background: gmeetTimeInput === opt ? '#EFF6FF' : '#F1F5F9',
                        color: gmeetTimeInput === opt ? '#1D4ED8' : '#475569',
                        border: gmeetTimeInput === opt ? '1px solid #BFDBFE' : '1px solid #E2E8F0',
                        borderRadius: '4px',
                        padding: '2px 8px',
                        fontSize: '0.72rem',
                        cursor: 'pointer'
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {/* Mentor Note */}
                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label" htmlFor="gmeet-note-input">
                    Instructions &amp; Agenda for Student
                  </label>
                  <textarea
                    id="gmeet-note-input"
                    className="form-textarea"
                    rows={3}
                    value={gmeetNoteInput}
                    onChange={e => setGmeetNoteInput(e.target.value)}
                    placeholder="e.g. Please join on time with your questions on college admission, scholarships, or syllabus."
                  />
                </div>

                {/* Automated Email Notice */}
                <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 'var(--radius-md)', padding: '0.85rem 1rem', fontSize: '0.8125rem', color: '#1E40AF' }}>
                  <strong>📧 Automated Dispatch:</strong> Upon clicking Confirm, PehliPeedhi will email <strong>{scheduleModalReq.studentEmail}</strong> with the Google Meet link, scheduled time, and preparation guidance.
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setScheduleModalReq(null)}
                  disabled={isSubmittingSchedule}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-cream"
                  onClick={handleConfirmSchedule}
                  disabled={isSubmittingSchedule}
                  id="confirm-schedule-submit-btn"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
                >
                  {isSubmittingSchedule ? 'Dispatching Email...' : 'Send Invite & Schedule Google Meet'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: Notify Meeting Over Confirmation */}
        {completingReq && (
          <div className="modal-overlay" onClick={() => setCompletingReq(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
              <div className="modal-header">
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#92400E', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <BellIcon size={20} />
                    <span>Conclude Google Meet Session</span>
                  </h3>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Student: <strong>{completingReq.studentName}</strong>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => setCompletingReq(null)}
                  style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1, color: 'var(--text-muted)' }}
                >
                  &times;
                </button>
              </div>

              <div className="modal-body">
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                  Are you sure you want to mark the meeting with <strong>{completingReq.studentName}</strong> as finished?
                </p>

                <div style={{ background: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: 'var(--radius-md)', padding: '0.85rem 1rem', fontSize: '0.85rem', color: '#78350F', marginBottom: '1.25rem' }}>
                  <strong>🔔 Real-Time Student Notification:</strong> {completingReq.studentName} will immediately receive a notification on their student dashboard asking them to rate the session and write feedback that will be featured on your mentor profile.
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="completion-note">
                    Optional Wrap-Up Note for Student
                  </label>
                  <input
                    id="completion-note"
                    type="text"
                    className="form-input"
                    value={completionNote}
                    onChange={e => setCompletionNote(e.target.value)}
                    placeholder="e.g. Great session today! Best of luck on your college applications."
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setCompletingReq(null)}
                  disabled={isSubmittingCompletion}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-notify-over"
                  onClick={handleConfirmMeetingOver}
                  disabled={isSubmittingCompletion}
                  id="confirm-meeting-over-btn"
                >
                  {isSubmittingCompletion ? 'Notifying Student...' : 'Yes, Meeting Over — Notify Student'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: Email Preview */}
        {emailPreviewReq && (
          <div className="modal-overlay" onClick={() => setEmailPreviewReq(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
              <div className="modal-header">
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <MailIcon size={18} />
                    <span>Sent Email Invitation Preview</span>
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Recipient: <strong>{emailPreviewReq.studentEmail}</strong>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => setEmailPreviewReq(null)}
                  style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1, color: 'var(--text-muted)' }}
                >
                  &times;
                </button>
              </div>

              <div className="modal-body" style={{ background: '#F8FAFC', padding: '1.5rem' }}>
                {/* Email Client Envelope Card */}
                <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ borderBottom: '2px solid #F1F5F9', paddingBottom: '1rem', marginBottom: '1.25rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E3A8A' }}>PehliPeedhi (पहली पीढ़ी)</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B' }}>First-Generation Higher Education Network</div>
                  </div>

                  <p style={{ fontSize: '0.925rem', color: '#1E293B', marginBottom: '0.75rem' }}>
                    Dear <strong>{emailPreviewReq.studentName}</strong>,
                  </p>

                  <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.6, marginBottom: '1rem' }}>
                    Great news! <strong>{emailPreviewReq.mentorName}</strong> ({emailPreviewReq.mentorCollege || 'Verified Graduate'}) has accepted your mentorship guidance query.
                  </p>

                  <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '1rem', marginBottom: '1.25rem' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#0F172A', fontSize: '0.9rem' }}>📅 Session Details:</h4>
                    <p style={{ margin: '4px 0', fontSize: '0.825rem', color: '#334155' }}>
                      <strong>Query:</strong> &ldquo;{emailPreviewReq.topic}&rdquo;
                    </p>
                    <p style={{ margin: '4px 0', fontSize: '0.825rem', color: '#334155' }}>
                      <strong>Scheduled Time:</strong> {emailPreviewReq.meetingScheduledTime || 'Upcoming Session'}
                    </p>
                    {emailPreviewReq.mentorResponseNote && (
                      <p style={{ margin: '4px 0', fontSize: '0.825rem', color: '#334155' }}>
                        <strong>Mentor Note:</strong> &ldquo;{emailPreviewReq.mentorResponseNote}&rdquo;
                      </p>
                    )}
                  </div>

                  <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
                    <a
                      href={emailPreviewReq.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-gmeet"
                      style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}
                    >
                      <VideoIcon size={18} />
                      <span>Join Google Meet Session</span>
                    </a>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.5rem' }}>
                      Direct Link: <span style={{ color: '#2563EB' }}>{emailPreviewReq.meetingLink}</span>
                    </div>
                  </div>

                  <div style={{ background: '#FFFBEB', borderLeft: '4px solid #F59E0B', padding: '0.75rem 1rem', borderRadius: '4px', margin: '1.25rem 0' }}>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#92400E', lineHeight: 1.5 }}>
                      <strong>Feedback Reminder:</strong> Once the session is over, your mentor will notify on the portal and you will be able to submit your star rating and feedback on your dashboard.
                    </p>
                  </div>

                  <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '1.5rem 0 0 0' }}>
                    Best wishes,<br />
                    <strong>Team PehliPeedhi</strong>
                  </p>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-cream"
                  onClick={() => setEmailPreviewReq(null)}
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: Feedback & Star Rating Modal */}
        {feedbackModalReq && (
          <div className="modal-overlay" onClick={() => setFeedbackModalReq(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '540px' }}>
              <div className="modal-header">
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                    Rate Mentorship with {feedbackModalReq.mentorName}
                  </h3>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {feedbackModalReq.mentorCollege || 'Graduate Mentor'} &bull; {feedbackModalReq.topic}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFeedbackModalReq(null)}
                  style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1, color: 'var(--text-muted)' }}
                >
                  &times;
                </button>
              </div>

              <div className="modal-body">
                {/* 5-Star Interactive Selector */}
                <div style={{ textAlign: 'center', marginBottom: '1.25rem', padding: '1.25rem', background: 'rgba(255, 255, 255, 0.65)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    How helpful was your mentor&apos;s guidance?
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', fontSize: '2.5rem', cursor: 'pointer', userSelect: 'none' }}>
                    {[1, 2, 3, 4, 5].map(star => {
                      const isFilled = (hoverRating || ratingScore) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRatingScore(star)}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: '0 4px',
                            cursor: 'pointer',
                            fontSize: '2.25rem',
                            color: isFilled ? '#F59E0B' : '#CBD5E1',
                            transition: 'transform 0.15s ease, color 0.15s ease',
                            transform: (hoverRating || ratingScore) === star ? 'scale(1.2)' : 'scale(1)'
                          }}
                          aria-label={`${star} star`}
                        >
                          ★
                        </button>
                      );
                    })}
                  </div>

                  <div style={{ marginTop: '0.5rem', fontWeight: 700, fontSize: '0.95rem', color: '#92400E' }}>
                    {(hoverRating || ratingScore) === 5 && '⭐⭐⭐⭐⭐ Exceptional & Inspiring!'}
                    {(hoverRating || ratingScore) === 4 && '⭐⭐⭐⭐ Very Helpful & Practical!'}
                    {(hoverRating || ratingScore) === 3 && '⭐⭐⭐ Good Guidance'}
                    {(hoverRating || ratingScore) === 2 && '⭐⭐ Fair Guidance'}
                    {(hoverRating || ratingScore) === 1 && '⭐ Needs Improvement'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    These stars update {feedbackModalReq.mentorName}&apos;s rating in &quot;Find Mentors&quot;.
                  </div>
                </div>

                {/* Quick Feedback Tags */}
                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label" style={{ marginBottom: '0.5rem' }}>
                    What made this mentorship valuable? (Select all that apply)
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {[
                      'Clear Roadmap',
                      'Scholarship Guidance',
                      'College Admission Tips',
                      'Career Motivation',
                      'Patient & Empathetic',
                      'Practical Next Steps'
                    ].map(tag => {
                      const isSelected = feedbackTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setFeedbackTags(feedbackTags.filter(t => t !== tag));
                            } else {
                              setFeedbackTags([...feedbackTags, tag]);
                            }
                          }}
                          style={{
                            background: isSelected ? 'var(--cream-gradient)' : 'rgba(255, 255, 255, 0.7)',
                            color: isSelected ? 'var(--cream-text)' : 'var(--text-secondary)',
                            border: isSelected ? '1px solid var(--cream-border)' : '1px solid var(--border-glass)',
                            borderRadius: '999px',
                            padding: '0.35rem 0.85rem',
                            fontSize: '0.785rem',
                            fontWeight: isSelected ? 700 : 500,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {isSelected ? '✓ ' : '+ '}{tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Optional Review Comment Box */}
                <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                  <label className="form-label" htmlFor="feedback-comment">
                    Private Notes or Comments (Optional)
                  </label>
                  <textarea
                    id="feedback-comment"
                    className="form-textarea"
                    rows={3}
                    placeholder="Add any personal notes about key takeaways or follow-ups (optional)..."
                    value={feedbackComment}
                    onChange={e => setFeedbackComment(e.target.value)}
                  />
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    🔒 Meet date, time, and your star rating will be recorded in the verified session history.
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setFeedbackModalReq(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-cream"
                  onClick={() => {
                    submitMentorFeedback(feedbackModalReq.id, ratingScore, feedbackComment.trim() || undefined, feedbackTags);
                    setFeedbackModalReq(null);
                  }}
                  id="submit-feedback-btn"
                >
                  Submit Meet Rating (★ {ratingScore}/5)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

