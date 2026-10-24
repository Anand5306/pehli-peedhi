'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ENTRANCE_EXAMS_DATA, EXAM_STREAMS } from '../data/mockData';
import { EntranceExam } from '../types';

export default function HomePage() {
  // 1. Interactive Entrance Exams Explorer States
  const [selectedStream, setSelectedStream] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // 2. Interactive Journey Switcher State
  const [journeyRole, setJourneyRole] = useState<'student' | 'mentor'>('student');

  // 3. Interactive FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Filter exams for the homepage explorer
  const filteredExams = useMemo(() => {
    return ENTRANCE_EXAMS_DATA.filter(exam => {
      const matchesStream = selectedStream === 'All' || exam.stream === selectedStream;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        exam.name.toLowerCase().includes(q) ||
        exam.fullName.toLowerCase().includes(q) ||
        exam.conductingBody.toLowerCase().includes(q) ||
        exam.targetCourses.toLowerCase().includes(q) ||
        exam.stream.toLowerCase().includes(q);
      return matchesStream && matchesSearch;
    });
  }, [selectedStream, searchQuery]);

  // Stream counts
  const streamCounts = useMemo(() => {
    const counts: Record<string, number> = { All: ENTRANCE_EXAMS_DATA.length };
    ENTRANCE_EXAMS_DATA.forEach(exam => {
      counts[exam.stream] = (counts[exam.stream] || 0) + 1;
    });
    return counts;
  }, []);

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const el = document.getElementById('entrance-exams-explorer');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const faqItems = [
    {
      question: "Is PehliPeedhi really 100% free for first-generation students?",
      answer: "Yes, absolutely 100% free. PehliPeedhi is a non-commercial educational initiative. No mentor is ever allowed to charge fees, and no student is ever asked for payment. All 1-on-1 calls, written guidance, and entrance exam resources are provided freely by graduate alumni volunteers."
    },
    {
      question: "How do mentor sessions and interactions take place?",
      answer: "When you browse the directory and request mentorship, you can choose between a scheduled Google Meet video/audio call (typically 30-45 minutes on weekends) or structured written Q&A. You'll receive instant WhatsApp and email notifications with the meeting details once your request is accepted."
    },
    {
      question: "I am not comfortable communicating in English. Can I talk in Hindi or my regional language?",
      answer: "Yes! Our platform is vernacular-first. Mentors come from across India and speak Hindi, Marathi, Tamil, Bengali, Telugu, Kannada, Gujarati, Malayalam, Bhojpuri, and more. You can filter mentors by their spoken languages so you can express your doubts freely without language anxiety."
    },
    {
      question: "How does PehliPeedhi verify that mentors are genuine graduates?",
      answer: "Every graduate who registers as a mentor must submit proof of their degree (e.g. college degree certificate, official university email, or alumni identification card). Profiles undergo manual verification before a green 'Verified Mentor' badge is awarded on their public profile."
    },
    {
      question: "Can mentors help with government scholarships and college fee waivers?",
      answer: "Yes. Many of our mentors are first-generation graduates who personally relied on scholarships. They provide practical, step-by-step guidance on the National Scholarship Portal (NSP), state post-matric tuition waivers, IIT/NIT fee remission, and obtaining local income/domicile affidavits."
    }
  ];

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Ambient Decorative Lighting */}
      <div 
        className="glow-orb" 
        style={{ 
          top: '-10%', 
          left: '15%', 
          width: '500px', 
          height: '500px', 
          background: 'rgba(200, 147, 50, 0.12)' 
        }} 
      />
      <div 
        className="glow-orb" 
        style={{ 
          top: '25%', 
          right: '5%', 
          width: '600px', 
          height: '600px', 
          background: 'rgba(15, 39, 68, 0.08)' 
        }} 
      />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION                                                           */}
      {/* ========================================================================= */}
      <section style={{ paddingTop: '4.5rem', paddingBottom: '4rem', position: 'relative', zIndex: 1 }}>
        <div className="container" style={{ maxWidth: '960px', textAlign: 'center' }}>
          
          {/* Trust Badge */}
          <div style={{ marginBottom: '1.25rem' }}>
            <span 
              className="badge badge-gold" 
              style={{ 
                padding: '0.45rem 1.15rem', 
                fontSize: '0.85rem', 
                boxShadow: '0 2px 10px rgba(200, 147, 50, 0.15)' 
              }}
            >
              🏛️ India&apos;s Non-Profit Mentorship Network for First-Gen Learners
            </span>
          </div>

          {/* Main Headline */}
          <h1 style={{
            fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.035em',
            color: 'var(--navy-primary)',
            marginBottom: '1.4rem'
          }}>
            Step Up to Higher Education with Alumni Who Walked Your Path
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
            lineHeight: 1.65,
            color: 'var(--text-secondary)',
            marginBottom: '2.5rem',
            maxWidth: '760px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            When no one in your family has attended college, navigating admissions, entrance exams, and fee waivers feels overwhelming. PehliPeedhi pairs you with verified graduates from IITs, AIIMS, NLUs, Central &amp; State Universities for free 1-on-1 guidance.
          </p>

          {/* Interactive Hero Quick-Search */}
          <div style={{ maxWidth: '640px', margin: '0 auto 2.5rem' }}>
            <form onSubmit={handleHeroSearchSubmit} style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search exams (JEE, NEET, CUET, CLAT) or fields..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '1rem 7.5rem 1rem 1.5rem',
                  fontSize: '1rem',
                  borderRadius: '9999px',
                  border: '1.5px solid rgba(200, 147, 50, 0.35)',
                  background: '#FFFFFF',
                  boxShadow: '0 8px 30px rgba(15, 39, 68, 0.08)',
                  outline: 'none',
                  color: 'var(--navy-primary)',
                  fontWeight: 500
                }}
              />
              <button
                type="submit"
                className="btn btn-navy"
                style={{
                  position: 'absolute',
                  right: '6px',
                  top: '6px',
                  bottom: '6px',
                  borderRadius: '9999px',
                  padding: '0 1.25rem',
                  fontSize: '0.875rem'
                }}
              >
                Explore 🔍
              </button>
            </form>
          </div>

          {/* Call to Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="#entrance-exams-explorer" className="btn btn-lg btn-navy">
              🎯 Explore Entrance Exams
            </a>
            <Link href="/find-mentors" className="btn btn-lg btn-gold">
              🧑‍🏫 Find a Verified Mentor
            </Link>
            <Link href="/auth" className="btn btn-lg btn-secondary">
              🎓 Join Network
            </Link>
          </div>

          {/* Live Trust Metrics Ribbon */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginTop: '3.5rem',
            padding: '1.25rem',
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(16px)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(200, 147, 50, 0.25)',
            boxShadow: 'var(--shadow-card)'
          }}>
            <div style={{ textAlign: 'center', padding: '0.5rem' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy-primary)' }}>100% Free</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>Zero Commercial Fees</div>
            </div>
            <div style={{ textAlign: 'center', padding: '0.5rem' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--gold-deep)' }}>50+ Gateways</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>Official Pan-India Portals</div>
            </div>
            <div style={{ textAlign: 'center', padding: '0.5rem' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy-primary)' }}>Verified Alumni</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>Degrees Authenticated</div>
            </div>
            <div style={{ textAlign: 'center', padding: '0.5rem' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--gold-deep)' }}>12+ Languages</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>Vernacular First Guidance</div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. INTERACTIVE STREAM & ENTRANCE EXAMS EXPLORER                           */}
      {/* ========================================================================= */}
      <section 
        id="entrance-exams-explorer" 
        style={{ 
          padding: '4.5rem 0 5rem', 
          background: 'rgba(255, 255, 255, 0.6)', 
          borderTop: '1px solid rgba(200, 147, 50, 0.15)',
          borderBottom: '1px solid rgba(200, 147, 50, 0.15)'
        }}
      >
        <div className="container">
          
          {/* Section Header */}
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 2.5rem' }}>
            <span className="badge badge-gold" style={{ marginBottom: '0.65rem' }}>
              🏛️ Pan-India Official Gateways
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--navy-primary)', letterSpacing: '-0.025em' }}>
              Explore Entrance Exams by Stream
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.65rem', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Select your target academic stream to view verified eligibility criteria, testing modes, key application dates, and official government links.
            </p>
          </div>

          {/* Interactive Stream Filter Tabs */}
          <div style={{ marginBottom: '1.75rem' }}>
            <div className="stream-tab-bar">
              {EXAM_STREAMS.map(stream => {
                const count = streamCounts[stream.id] || 0;
                const isActive = selectedStream === stream.id;
                return (
                  <button
                    key={stream.id}
                    type="button"
                    className={`stream-tab ${isActive ? 'active' : ''}`}
                    onClick={() => setSelectedStream(stream.id)}
                  >
                    <span>{stream.icon}</span>
                    <span>{stream.name}</span>
                    <span className="badge-count">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Query Filter Indicator */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            marginBottom: '1.75rem', 
            flexWrap: 'wrap', 
            gap: '0.75rem' 
          }}>
            <div style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Showing <strong style={{ color: 'var(--navy-primary)' }}>{filteredExams.length}</strong> exams in 
              <span style={{ color: 'var(--gold-deep)', marginLeft: '4px' }}>
                {selectedStream === 'All' ? 'All Academic Streams' : selectedStream}
              </span>
              {searchQuery && (
                <span> matching &ldquo;{searchQuery}&rdquo;</span>
              )}
            </div>

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--gold-deep)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Clear Search Filter
              </button>
            )}
          </div>

          {/* Exam Cards Grid */}
          {filteredExams.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔍</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy-primary)', marginBottom: '0.5rem' }}>
                No Exams Match Your Filter
              </h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 1.25rem' }}>
                Try selecting a different stream or clear your search keywords to view the directory.
              </p>
              <button 
                type="button" 
                className="btn btn-navy"
                onClick={() => {
                  setSelectedStream('All');
                  setSearchQuery('');
                }}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {filteredExams.slice(0, 6).map(exam => (
                <div key={exam.id} className="exam-interactive-card">
                  
                  {/* Card Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <span 
                      className="badge badge-gold" 
                      style={{ fontSize: '0.72rem', fontWeight: 700 }}
                    >
                      {exam.stream}
                    </span>
                    <span 
                      className="badge badge-navy"
                      style={{ fontSize: '0.72rem', fontWeight: 600 }}
                    >
                      {exam.examMode.includes('Computer') ? '💻 CBT' : '✍️ Pen & Paper'}
                    </span>
                  </div>

                  {/* Exam Title */}
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy-primary)', marginBottom: '0.2rem' }}>
                    {exam.name}
                  </h3>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.85rem' }}>
                    {exam.fullName} • <span style={{ color: 'var(--navy-royal)' }}>{exam.conductingBody}</span>
                  </div>

                  {/* Target Courses */}
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem', flex: 1 }}>
                    <strong>Target Degrees:</strong> {exam.targetCourses}
                  </p>

                  {/* First-Gen Guidance Tip Box */}
                  {exam.firstGenTips && (
                    <div style={{
                      background: 'rgba(250, 245, 235, 0.95)',
                      borderLeft: '3px solid var(--gold-primary)',
                      borderRadius: '0 8px 8px 0',
                      padding: '0.65rem 0.85rem',
                      marginBottom: '1.25rem',
                      fontSize: '0.8125rem',
                      lineHeight: 1.5,
                      color: '#4A3510'
                    }}>
                      <strong style={{ color: 'var(--gold-deep)' }}>💡 First-Gen Guidance: </strong>
                      {exam.firstGenTips}
                    </div>
                  )}

                  {/* Card Footer Actions */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    gap: '0.5rem', 
                    marginTop: 'auto',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid rgba(200, 147, 50, 0.15)'
                  }}>
                    <a
                      href={exam.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-portal"
                      style={{ flex: 1, justifyContent: 'center', color: '#FFFFFF' }}
                    >
                      <span style={{ color: '#FFFFFF' }}>Official Portal ↗</span>
                    </a>
                    <Link
                      href="/find-mentors"
                      className="btn btn-sm btn-secondary"
                      style={{ flex: 1, justifyContent: 'center' }}
                    >
                      Ask Mentor →
                    </Link>
                  </div>

                </div>
              ))}
            </div>
          )}

          {/* Full Directory CTA */}
          <div style={{ textAlign: 'center', marginTop: '2.75rem' }}>
            <Link href="/entrance-exams" className="btn btn-lg btn-gold">
              View All 50+ Pan-India Entrance Exams in Full Directory →
            </Link>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE JOURNEY SWITCHER ("How PehliPeedhi Works")                  */}
      {/* ========================================================================= */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container" style={{ maxWidth: '960px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>Structured Process</span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--navy-primary)', letterSpacing: '-0.025em' }}>
              How PehliPeedhi Works
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1.05rem' }}>
              Transparent, safe, and structured 1-on-1 mentorship for students and alumni.
            </p>

            {/* Interactive Role Switcher Pills */}
            <div style={{ marginTop: '1.75rem' }}>
              <div className="journey-switcher">
                <button
                  type="button"
                  className={`journey-tab-btn ${journeyRole === 'student' ? 'active' : ''}`}
                  onClick={() => setJourneyRole('student')}
                >
                  🎓 For First-Gen Students
                </button>
                <button
                  type="button"
                  className={`journey-tab-btn ${journeyRole === 'mentor' ? 'active' : ''}`}
                  onClick={() => setJourneyRole('mentor')}
                >
                  🧑‍🏫 For Alumni Mentors
                </button>
              </div>
            </div>
          </div>

          {/* Dynamic 3 Steps Display */}
          {journeyRole === 'student' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              <div className="card card-hover" style={{ borderTop: '4px solid var(--gold-primary)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📝</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--gold-deep)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Step 01</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy-primary)', margin: '0.35rem 0 0.65rem' }}>
                  Create Free Account
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Select your current education level, target field (Engineering, Medicine, Law, CUET, CA, etc.), and home state without any fees.
                </p>
              </div>

              <div className="card card-hover" style={{ borderTop: '4px solid var(--navy-royal)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🔍</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--navy-royal)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Step 02</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy-primary)', margin: '0.35rem 0 0.65rem' }}>
                  Select a Verified Mentor
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Filter alumni by academic stream, regional language, or alma mater, and submit your specific question or call request.
                </p>
              </div>

              <div className="card card-hover" style={{ borderTop: '4px solid #10B981' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📞</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Step 03</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy-primary)', margin: '0.35rem 0 0.65rem' }}>
                  Receive 1-on-1 Guidance
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Get scheduled Google Meet video/audio calls or detailed written advice directly with WhatsApp notifications for call links.
                </p>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              <div className="card card-hover" style={{ borderTop: '4px solid var(--gold-primary)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🎓</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--gold-deep)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Step 01</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy-primary)', margin: '0.35rem 0 0.65rem' }}>
                  Register Alumni Profile
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Share your college, degree, graduation year, spoken languages, and disciplines you can guide first-generation learners in.
                </p>
              </div>

              <div className="card card-hover" style={{ borderTop: '4px solid var(--navy-royal)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🛡️</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--navy-royal)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Step 02</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy-primary)', margin: '0.35rem 0 0.65rem' }}>
                  Get Verified
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Complete quick document verification to receive the verified mentor badge, establishing trust and authenticity with students.
                </p>
              </div>

              <div className="card card-hover" style={{ borderTop: '4px solid #10B981' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🤝</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Step 03</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy-primary)', margin: '0.35rem 0 0.65rem' }}>
                  Give Back on Your Schedule
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Commit just 1 to 2 hours per week. Accept student requests on your dashboard and share Google Meet links on weekend evenings.
                </p>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. FIRST-GEN PILLARS ("What PehliPeedhi Does")                             */}
      {/* ========================================================================= */}
      <section style={{ padding: '4.5rem 0', background: 'rgba(255, 255, 255, 0.6)' }}>
        <div className="container">
          
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem' }}>
            <span className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>Core Mission</span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--navy-primary)', letterSpacing: '-0.025em' }}>
              Why PehliPeedhi Exists
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1.05rem' }}>
              First-generation learners face unique systemic hurdles. We eliminate information barriers with verified peer counsel.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.75rem' }}>
            <div className="card card-hover">
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🏛️</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--navy-primary)', marginBottom: '0.65rem' }}>
                Direct Alumni Counsel
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Connect directly with graduates from premier national and state universities who navigated admissions without family precedent.
              </p>
            </div>

            <div className="card card-hover">
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🗣️</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--navy-primary)', marginBottom: '0.65rem' }}>
                Vernacular Languages
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Discuss your queries in Hindi, Marathi, Tamil, Bengali, Telugu, and other regional languages without English fluency pressure.
              </p>
            </div>

            <div className="card card-hover">
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>💰</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--navy-primary)', marginBottom: '0.65rem' }}>
                Scholarships &amp; Fee Remission
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Step-by-step guidance on National Scholarship Portal (NSP), state post-matric schemes, and income affidavit certification.
              </p>
            </div>

            <div className="card card-hover">
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🛡️</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--navy-primary)', marginBottom: '0.65rem' }}>
                Verified &amp; Safe Access
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                All mentors submit educational credentials for review. Student contact information remains protected and is only shared upon mutual consent.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. INTERACTIVE FAQ ACCORDION                                              */}
      {/* ========================================================================= */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container" style={{ maxWidth: '820px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>Frequently Asked Questions</span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--navy-primary)', letterSpacing: '-0.025em' }}>
              Everything First-Gen Learners Need to Know
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1.05rem' }}>
              Common questions answered openly and honestly.
            </p>
          </div>

          <div className="faq-accordion">
            {faqItems.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} className={`faq-item ${isOpen ? 'open' : ''}`}>
                  <button
                    type="button"
                    className="faq-question"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                  >
                    <span>{item.question}</span>
                    <span className="faq-icon">+</span>
                  </button>
                  {isOpen && (
                    <div className="faq-answer">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. CALL TO ACTION BANNER                                                  */}
      {/* ========================================================================= */}
      <section style={{ padding: '4rem 0 6rem' }}>
        <div className="container" style={{ maxWidth: '860px' }}>
          <div 
            style={{ 
              background: 'linear-gradient(135deg, #0F2744 0%, #071324 100%)', 
              borderRadius: 'var(--radius-lg)',
              padding: '3.5rem 2.5rem',
              color: '#FFFFFF',
              textAlign: 'center',
              border: '1.5px solid rgba(200, 147, 50, 0.4)',
              boxShadow: '0 20px 45px rgba(15, 39, 68, 0.25)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div 
              style={{
                position: 'absolute',
                top: '-30%',
                right: '-10%',
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                background: 'rgba(200, 147, 50, 0.2)',
                filter: 'blur(60px)'
              }}
            />

            <span 
              className="badge" 
              style={{ 
                background: 'rgba(200, 147, 50, 0.2)', 
                color: '#F7E4C4', 
                border: '1px solid rgba(200, 147, 50, 0.4)',
                marginBottom: '1rem' 
              }}
            >
              Start Free Today
            </span>

            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.025em', color: '#FFFFFF' }}>
              Begin Your Higher Education Journey
            </h2>

            <p style={{ fontSize: '1.05rem', color: '#CBD5E1', marginBottom: '2.25rem', maxWidth: '600px', margin: '0 auto 2.25rem', lineHeight: 1.6 }}>
              Whether you are preparing for your first entrance exam or are a graduate ready to guide students from your home region, join PehliPeedhi today.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/auth?role=student" className="btn btn-lg btn-gold">
                Join as Student (100% Free)
              </Link>
              <Link href="/auth?role=mentor" className="btn btn-lg btn-secondary">
                Register as Alumni Mentor
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

