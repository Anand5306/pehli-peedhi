'use client';

import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section style={{
        paddingTop: '5rem',
        paddingBottom: '5rem',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '860px' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <span className="badge badge-cream" style={{ fontSize: '0.8125rem', padding: '0.35rem 0.9rem' }}>
              First-Generation Education Network
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            color: 'var(--text-main)',
            marginBottom: '1.5rem'
          }}>
            Higher Education Guidance for First-Generation Learners
          </h1>

          <p style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
            marginBottom: '2.5rem',
            maxWidth: '720px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            PehliPeedhi connects students from non-graduate families with verified graduates across India. 
            Free, accessible 1-on-1 mentorship on college choices, admissions, and scholarships.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/auth" className="btn btn-lg btn-cream">
              Join as a Student
            </Link>
            <Link href="/auth" className="btn btn-lg btn-secondary">
              Join as a Mentor
            </Link>
            <Link href="/entrance-exams" className="btn btn-lg btn-outline" style={{ background: '#FFFFFF', borderColor: '#2563EB', color: '#1D4ED8', fontWeight: 700 }}>
              🎯 Entrance Exams Directory
            </Link>
            <Link href="/resources" className="btn btn-lg btn-outline">
              Explore Scholarships
            </Link>
          </div>
        </div>
      </section>

      {/* What the Platform Does */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem' }}>
            <span className="badge badge-glass" style={{ marginBottom: '0.5rem' }}>Core Purpose</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
              What PehliPeedhi Does
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.75rem' }}>
              When nobody at home has completed a college degree, navigating cutoffs, entrance exams, and fee structures can feel overwhelming. We bridge that gap through structured peer guidance.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.75rem' }}>
            <div className="card card-hover">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.65rem' }}>Direct Alumni Counsel</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Connect directly with graduates from leading national and state universities who navigated higher education without family precedent.
              </p>
            </div>

            <div className="card card-hover">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.65rem' }}>Vernacular Language Support</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Discuss your questions in Hindi, Marathi, Tamil, Bengali, Telugu, and other regional languages without English language pressure.
              </p>
            </div>

            <div className="card card-hover">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.65rem' }}>Scholarship &amp; Fee Navigation</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Step-by-step guidance on National Scholarship Portal (NSP), state post-matric tuition waivers, and income affidavit procedures.
              </p>
            </div>

            <div className="card card-hover">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.65rem' }}>Verified &amp; Safe Access</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Mentor credentials and degree certificates are checked. Student contact details remain protected and are only shared upon mutual confirmation.
              </p>
            </div>

            <Link href="/entrance-exams" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card card-hover" style={{ borderLeft: '4px solid #2563EB', background: 'linear-gradient(135deg, #EFF6FF 0%, #FFFFFF 100%)', height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span className="badge badge-cream" style={{ fontSize: '0.72rem' }}>Stream Directory</span>
                  <span style={{ fontSize: '1rem', color: '#2563EB', fontWeight: 800 }}>↗</span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.65rem', color: '#1E40AF' }}>
                  Entrance Exams Hub
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  Choose your stream (Engineering, Medical, CUET, Law, Commerce, Design, Science, Defense) to explore eligibility, key dates, and direct links to official government portals.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem' }}>
            <span className="badge badge-glass" style={{ marginBottom: '0.5rem' }}>Structured Process</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              How PehliPeedhi Works
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Simple, transparent connection between students and alumni mentors.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {/* For Students */}
            <div className="card">
              <span className="badge badge-cream" style={{ marginBottom: '1rem' }}>For Students</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>3 Steps for Learners</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.9rem' }}>
                <div>
                  <strong>1. Create an Account</strong>
                  <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Select your current education level, target field (Engineering, Medicine, Law, Commerce, etc.), and home state.
                  </div>
                </div>

                <div>
                  <strong>2. Select a Verified Mentor</strong>
                  <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Browse alumni profiles filtered by discipline, language, or alma mater, and submit your specific question.
                  </div>
                </div>

                <div>
                  <strong>3. Receive 1-on-1 Advice</strong>
                  <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Get detailed written feedback or a scheduled weekend phone call directly from your mentor.
                  </div>
                </div>
              </div>
            </div>

            {/* For Mentors */}
            <div className="card">
              <span className="badge badge-cream" style={{ marginBottom: '1rem' }}>For Alumni Mentors</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>3 Steps to Mentor</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.9rem' }}>
                <div>
                  <strong>1. Register Alumni Profile</strong>
                  <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Share your college, degree, graduation year, and the field you can guide first-generation students in.
                  </div>
                </div>

                <div>
                  <strong>2. Set Your Availability</strong>
                  <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Commit 1 to 2 hours per week on your preferred schedule (e.g. Saturday evenings or written Q&amp;A).
                  </div>
                </div>

                <div>
                  <strong>3. Guide Aspiring Learners</strong>
                  <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Review incoming queries, accept requests within your domain, and empower the next generation.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section style={{ padding: '4rem 0 6rem', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '780px' }}>
          <div className="card" style={{ padding: '3.5rem 2rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
              Begin Your Mentorship Journey
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
              Whether you are preparing for your first college entrance exam or are a graduate ready to give back, join our network today.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/auth" className="btn btn-lg btn-cream">
                Create Free Account
              </Link>
              <Link href="/auth" className="btn btn-lg btn-secondary">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
