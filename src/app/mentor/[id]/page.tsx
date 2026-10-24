'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '../../../context/AppContext';

function MentorDetailContent() {
  const params = useParams();
  const router = useRouter();
  const { mentors, openRequestModal } = useApp();

  const mentorId = params?.id as string;
  const mentor = mentors.find(m => m.id === mentorId);

  if (!mentor) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem' }}>Mentor Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          The mentor profile you are looking for does not exist or may have been updated.
        </p>
        <Link href="/find-mentors" className="btn btn-cream">
          Back to Mentors Directory
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '3rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '1.5rem' }}>
          <button 
            type="button" 
            onClick={() => router.back()} 
            className="btn btn-sm btn-secondary"
          >
            &larr; Back
          </button>
        </div>

        {/* Profile Card Header */}
        <div className="card" style={{ marginBottom: '2rem', padding: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{
              width: '84px',
              height: '84px',
              borderRadius: '20px',
              background: mentor.avatarColor || '#2563EB',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 800,
              flexShrink: 0,
              boxShadow: 'var(--shadow-md)'
            }}>
              {mentor.avatar}
            </div>

            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  {mentor.fullName}
                </h1>
                {mentor.verified && (
                  <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>
                    Verified First-Gen Graduate
                  </span>
                )}
              </div>

              <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                {mentor.degree}
              </div>
              <div style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                {mentor.graduationCollege} &bull; Class of {mentor.graduationYear}
              </div>

              {/* Star Rating Badge */}
              {(() => {
                const revCount = mentor.reviewCount ?? mentor.reviews?.length ?? 0;
                const hasReviews = revCount > 0 && Boolean(mentor.rating && mentor.rating > 0);
                const stars = hasReviews ? Math.min(5, Math.max(0, Math.round(mentor.rating || 0))) : 0;
                const ratingVal = hasReviews ? (mentor.rating || 0).toFixed(1) : '0.0';

                return (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', color: '#F59E0B', fontSize: '1.1rem', letterSpacing: '1px' }}>
                      {'★'.repeat(stars)}
                      {'☆'.repeat(5 - stars)}
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                      {ratingVal} / 5.0
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      &bull; {revCount} Student Review{revCount === 1 ? '' : 's'}
                    </span>
                  </div>
                );
              })()}

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <span className="badge badge-cream">{mentor.field}</span>
                <span className="badge badge-glass">
                  {mentor.city}, {mentor.state}
                </span>
                <span className="badge badge-glass">
                  {mentor.availability}
                </span>
              </div>

              <button
                type="button"
                className="btn btn-cream btn-lg"
                onClick={() => openRequestModal(mentor)}
                style={{ width: '100%', maxWidth: '320px' }}
              >
                Request Mentorship Session
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Story & Guidance Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          <div className="card">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
              First-Gen Journey &amp; Personal Story
            </h2>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>
              {mentor.shortBio}
            </p>
          </div>

          <div className="card">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
              Guidance Specialties &amp; Language
            </h2>
            
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                Core Expertise
              </div>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-main)', fontWeight: 500 }}>
                {mentor.expertise}
              </p>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                Languages Spoken Comfortably
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {mentor.languages.map(lang => (
                  <span key={lang} className="badge badge-glass">
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ 
              background: 'rgba(255, 255, 255, 0.65)', 
              padding: '1rem', 
              borderRadius: 'var(--radius-md)', 
              fontSize: '0.8125rem',
              color: 'var(--text-secondary)'
            }}>
              Guidance on PehliPeedhi is 100% free, volunteer-driven, and designed to support first-generation college aspirants.
            </div>
          </div>
        </div>

        {/* Student Reviews & Testimonials Section */}
        {/* Mentorship Meetings History & Ratings Section */}
        <div className="card" style={{ marginTop: '2rem', padding: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  Mentorship Meets History &amp; Ratings
                </h2>
                <span className="badge badge-cream" style={{ fontSize: '0.75rem' }}>
                  {mentor.reviews?.length || mentor.reviewCount || 0} Sessions Completed
                </span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
                Verified history of 1-on-1 higher education guidance meetings conducted by this mentor.
              </p>
            </div>

            {(() => {
              const revCount = mentor.reviewCount ?? mentor.reviews?.length ?? 0;
              const hasReviews = revCount > 0 && Boolean(mentor.rating && mentor.rating > 0);
              const stars = hasReviews ? Math.min(5, Math.max(0, Math.round(mentor.rating || 0))) : 0;
              const ratingVal = hasReviews ? (mentor.rating || 0).toFixed(1) : '0.0';

              return (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  background: 'linear-gradient(135deg, #FEF3C7 0%, #FFFBEB 100%)',
                  padding: '0.65rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #FCD34D'
                }}>
                  <span style={{ fontSize: '1.75rem', fontWeight: 900, color: '#92400E', lineHeight: 1 }}>
                    {ratingVal}
                  </span>
                  <div>
                    <div style={{ color: '#F59E0B', fontSize: '0.95rem', letterSpacing: '1px' }}>
                      {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#B45309', fontWeight: 700 }}>
                      AVERAGE SESSION RATING
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {mentor.reviews && mentor.reviews.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {mentor.reviews.map(review => (
                <div 
                  key={review.id} 
                  style={{
                    background: 'rgba(255, 255, 255, 0.85)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: '#EFF6FF',
                        color: '#1D4ED8',
                        border: '1px solid #BFDBFE',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.9rem',
                        fontWeight: 800
                      }}>
                        📹
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.925rem', color: 'var(--text-main)' }}>
                          Mentorship Session with {review.studentName}
                        </div>
                        <span className="badge badge-success" style={{ fontSize: '0.6875rem', marginTop: '2px' }}>
                          ✓ Completed &amp; Verified
                        </span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#F59E0B', fontSize: '1rem', letterSpacing: '1px' }}>
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#92400E' }}>
                        {review.rating} / 5 Rating
                      </div>
                    </div>
                  </div>

                  {/* Meeting Date & Time Details */}
                  <div style={{ 
                    background: '#F8FAFC', 
                    border: '1px solid #E2E8F0', 
                    borderRadius: 'var(--radius-sm)', 
                    padding: '0.75rem 1rem', 
                    fontSize: '0.8125rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#1E293B' }}>
                      <span>📅</span>
                      <strong>Meet Date:</strong>
                      <span style={{ color: '#334155' }}>{review.meetingDate || review.date}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#1E293B' }}>
                      <span>⏰</span>
                      <strong>Meet Time:</strong>
                      <span style={{ color: '#334155' }}>{review.meetingTime || review.meetingScheduledTime || 'Scheduled Session'}</span>
                    </div>

                    {review.topic && (
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem', color: '#1E293B', marginTop: '2px' }}>
                        <span>🎓</span>
                        <strong>Topic:</strong>
                        <span style={{ color: '#475569', fontStyle: 'italic' }}>&ldquo;{review.topic}&rdquo;</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No mentorship sessions completed yet. Request a guidance session to schedule the first meeting!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MentorDetailPage() {
  return (
    <Suspense fallback={
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading mentor profile...</p>
      </div>
    }>
      <MentorDetailContent />
    </Suspense>
  );
}
