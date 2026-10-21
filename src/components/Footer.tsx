'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.85rem' }}>
              <div className="brand-monogram" style={{ width: '32px', height: '32px', fontSize: '0.9rem' }}>
                PP
              </div>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF' }}>
                PehliPeedhi
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#94A3B8', maxWidth: '380px' }}>
              Dedicated to higher education equity for first-generation learners across India. Free, structured peer guidance from graduates who walked the same journey.
            </p>
          </div>

          <div>
            <h4 style={{ color: '#F1F5F9', fontSize: '0.9rem', marginBottom: '1rem', fontWeight: 700 }}>Platform</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <Link href="/find-mentors" style={{ color: '#94A3B8', transition: 'color 0.2s' }}>Alumni Directory</Link>
              <Link href="/resources" style={{ color: '#94A3B8', transition: 'color 0.2s' }}>Scholarship Guides</Link>
              <Link href="/dashboard" style={{ color: '#94A3B8', transition: 'color 0.2s' }}>Student Portal</Link>
              <Link href="/auth" style={{ color: '#94A3B8', transition: 'color 0.2s' }}>Graduate Mentor Registration</Link>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#F1F5F9', fontSize: '0.9rem', marginBottom: '1rem', fontWeight: 700 }}>Focus Disciplines</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <span style={{ color: '#94A3B8' }}>Engineering &amp; Technology</span>
              <span style={{ color: '#94A3B8' }}>Medical &amp; Healthcare</span>
              <span style={{ color: '#94A3B8' }}>Commerce &amp; Chartered Accountancy</span>
              <span style={{ color: '#94A3B8' }}>Legal Studies &amp; Public Service</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            &copy; 2026 PehliPeedhi Network. Educational equity for first-generation learners across India.
          </div>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
