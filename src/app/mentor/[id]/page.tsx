'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '../../../context/AppContext';
import RequireAuth from '../../../components/RequireAuth';

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
              <div style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                {mentor.graduationCollege} &bull; Class of {mentor.graduationYear}
              </div>

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
      <RequireAuth allowedRole="student">
        <MentorDetailContent />
      </RequireAuth>
    </Suspense>
  );
}
