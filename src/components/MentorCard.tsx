'use client';

import React from 'react';
import Link from 'next/link';
import { MentorProfile } from '../types';
import { useApp } from '../context/AppContext';

export default function MentorCard({ mentor }: { mentor: MentorProfile }) {
  const { openRequestModal } = useApp();

  return (
    <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '12px',
          background: mentor.avatarColor || '#2563EB',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          fontSize: '1.15rem',
          flexShrink: 0,
          boxShadow: 'var(--shadow-sm)'
        }}>
          {mentor.avatar}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
              {mentor.fullName}
            </h3>
            {mentor.verified && (
              <span className="badge badge-success" style={{ fontSize: '0.6875rem' }}>
                ✓ Verified Alumni
              </span>
            )}
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '2px' }}>
            {mentor.degree}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {mentor.graduationCollege}
          </div>

          {/* Star Rating & Reviews */}
          {(() => {
            const revCount = mentor.reviewCount ?? mentor.reviews?.length ?? 0;
            const hasReviews = revCount > 0 && Boolean(mentor.rating && mentor.rating > 0);
            const stars = hasReviews ? Math.min(5, Math.max(0, Math.round(mentor.rating || 0))) : 0;
            const ratingVal = hasReviews ? (mentor.rating || 0).toFixed(1) : '0.0';

            return (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '5px' }}>
                <div style={{ display: 'flex', color: '#F59E0B', fontSize: '0.9rem', letterSpacing: '0.5px' }}>
                  {'★'.repeat(stars)}
                  {'☆'.repeat(5 - stars)}
                </div>
                <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)' }}>
                  {ratingVal}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  ({revCount} review{revCount === 1 ? '' : 's'})
                </span>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Meta tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.85rem' }}>
        <span className="badge badge-cream">{mentor.field}</span>
        <span className="badge badge-glass">
          {mentor.city}, {mentor.state}
        </span>
      </div>

      {/* Bio excerpt */}
      <p style={{
        fontSize: '0.875rem',
        color: 'var(--text-secondary)',
        lineHeight: 1.5,
        marginBottom: '1rem',
        flex: 1,
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }}>
        {mentor.shortBio}
      </p>

      {/* Languages & Availability */}
      <div style={{ 
        paddingTop: '0.75rem', 
        borderTop: '1px solid var(--border-subtle)', 
        marginBottom: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.35rem',
        fontSize: '0.775rem',
        color: 'var(--text-muted)'
      }}>
        <div>
          <strong>Languages:</strong> {mentor.languages.join(', ')}
        </div>
        <div>
          <strong>Schedule:</strong> {mentor.availability}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '0.5rem', marginTop: 'auto' }}>
        <Link 
          href={`/mentor/${mentor.id}`} 
          className="btn btn-sm btn-secondary"
          style={{ width: '100%' }}
        >
          View Story
        </Link>
        <button
          type="button"
          className="btn btn-sm btn-cream"
          onClick={() => openRequestModal(mentor)}
          style={{ width: '100%' }}
        >
          Request Guidance
        </button>
      </div>
    </div>
  );
}
