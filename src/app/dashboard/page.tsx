'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';

export default function DashboardPage() {
  const { role, setRole, requests, updateRequestStatus, studentProfile, mentorProfile } = useApp();
  const [responseModalReqId, setResponseModalReqId] = useState<string | null>(null);
  const [responseNote, setResponseNote] = useState('');

  // Filtering requests based on role
  const studentRequests = requests.filter(r => r.studentId === 'student-1' || r.studentName === studentProfile.fullName);
  const mentorRequests = requests.filter(r => r.mentorId === 'mentor-1' || r.mentorName === mentorProfile.fullName || r.id.startsWith('inc-'));

  const handleAcceptWithNote = (reqId: string) => {
    updateRequestStatus(reqId, 'Accepted', responseNote || 'Request accepted. Feel free to connect via WhatsApp or email for our guidance session.');
    setResponseModalReqId(null);
    setResponseNote('');
  };

  return (
    <div style={{ padding: '3rem 0 5rem' }}>
      <div className="container">
        {/* Top Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid var(--border-glass)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-cream">Dashboard</span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                Portal: <strong>{role === 'mentor' ? 'Graduate Mentor' : 'First-Gen Student'}</strong>
              </span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              {role === 'mentor' ? `${mentorProfile.fullName}'s Mentor Portal` : `${studentProfile.fullName}'s Student Portal`}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Switch View:</span>
            <button
              type="button"
              className={`btn btn-sm ${role === 'student' ? 'btn-cream' : 'btn-secondary'}`}
              onClick={() => setRole('student')}
            >
              Student View
            </button>
            <button
              type="button"
              className={`btn btn-sm ${role === 'mentor' ? 'btn-cream' : 'btn-secondary'}`}
              onClick={() => setRole('mentor')}
            >
              Mentor View
            </button>
          </div>
        </div>

        {/* STUDENT VIEW */}
        {role !== 'mentor' && (
          <div>
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
                  {studentRequests.filter(r => r.status === 'Accepted').length} Accepted Sessions
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)' }}>
                My Mentorship Requests &amp; Responses
              </h2>
              <Link href="/find-mentors" className="btn btn-sm btn-cream">
                Browse Verified Mentors
              </Link>
            </div>

            {studentRequests.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {studentRequests.map(req => {
                  const isAccepted = req.status === 'Accepted';
                  const isDeclined = req.status === 'Declined';
                  const isPending = req.status === 'Pending';

                  return (
                    <div 
                      key={req.id} 
                      className="card" 
                      style={{ 
                        borderLeft: isAccepted ? '4px solid var(--success)' : isDeclined ? '4px solid #DC2626' : '4px solid #D97706'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                              Mentor: {req.mentorName}
                            </h3>
                            <span className={`badge ${isAccepted ? 'badge-success' : 'badge-glass'}`}>
                              {req.status}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {req.mentorCollege} &bull; Submitted {req.date} &bull; Format: {req.preferredContact}
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

                      {/* Mentor Response */}
                      {isAccepted && (
                        <div style={{
                          background: 'var(--success-bg)',
                          border: '1px solid var(--success-border)',
                          padding: '1rem',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '0.875rem',
                          color: '#14532D'
                        }}>
                          <div style={{ fontWeight: 700, marginBottom: '0.35rem' }}>
                            Mentorship Approved by {req.mentorName}
                          </div>
                          <p style={{ marginBottom: '0.75rem', lineHeight: 1.5 }}>
                            {req.mentorResponseNote || 'Mentor approved your guidance request. Contact details are available below.'}
                          </p>
                          <div style={{ 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            gap: '1.25rem', 
                            paddingTop: '0.5rem', 
                            borderTop: '1px solid rgba(21, 128, 61, 0.2)',
                            fontSize: '0.8125rem',
                            fontWeight: 600
                          }}>
                            {req.mentorPhone && <span>Phone / WhatsApp: <strong>{req.mentorPhone}</strong></span>}
                            {req.mentorEmail && <span>Email: <strong>{req.mentorEmail}</strong></span>}
                          </div>
                        </div>
                      )}

                      {isPending && (
                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                          Status: Awaiting review. First-generation mentors typically review and respond within 48 hours.
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
                  {mentorProfile.graduationCollege}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {mentorProfile.degree} ({mentorProfile.graduationYear})
                </div>
              </div>

              <div className="card">
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>Availability Window</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '6px' }}>
                  {mentorProfile.availability}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Volunteer Mentorship Commitment
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
                  const isAccepted = req.status === 'Accepted';

                  return (
                    <div key={req.id} className="card" style={{ borderLeft: isPending ? '4px solid #2563EB' : isAccepted ? '4px solid var(--success)' : '4px solid var(--border-glass)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                              Student: {req.studentName}
                            </h3>
                            <span className={`badge ${isAccepted ? 'badge-success' : 'badge-glass'}`}>
                              {req.status}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            Location: {req.studentLocation || 'India'} &bull; Aiming for: <strong>{req.intendedCourse || 'Higher Education'}</strong> &bull; Language: {req.studentLanguage}
                          </div>
                        </div>

                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Submitted: {req.date} &bull; Preferred Mode: {req.preferredContact}
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
                            onClick={() => {
                              setResponseModalReqId(req.id);
                              setResponseNote('Happy to guide you. Please connect via WhatsApp or email to schedule our call.');
                            }}
                          >
                            Accept &amp; Reply
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
                          padding: '0.75rem 1rem',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '0.8125rem',
                          color: '#14532D'
                        }}>
                          <strong>Your Note to Student:</strong> &ldquo;{req.mentorResponseNote}&rdquo;
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

        {/* Modal for replying/accepting student request */}
        {responseModalReqId && (
          <div className="modal-overlay" onClick={() => setResponseModalReqId(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                  Accept Request &amp; Share Guidance Instructions
                </h3>
                <button 
                  type="button" 
                  onClick={() => setResponseModalReqId(null)}
                  style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1 }}
                >
                  &times;
                </button>
              </div>

              <div className="modal-body">
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  Provide clear instructions on how the student can connect with you (e.g. WhatsApp, phone call timing, or email).
                </p>

                <div className="form-group">
                  <label className="form-label" htmlFor="response-note">
                    Your Instructions / Note to Student
                  </label>
                  <textarea
                    id="response-note"
                    className="form-textarea"
                    rows={4}
                    value={responseNote}
                    onChange={e => setResponseNote(e.target.value)}
                    placeholder="e.g. Send me a message on WhatsApp at +91 98111 22334 on Saturday between 4 PM and 6 PM."
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setResponseModalReqId(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-cream"
                  onClick={() => handleAcceptWithNote(responseModalReqId)}
                >
                  Confirm &amp; Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
