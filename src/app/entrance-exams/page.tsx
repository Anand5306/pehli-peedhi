'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ENTRANCE_EXAMS_DATA, EXAM_STREAMS } from '../../data/mockData';
import { EntranceExam } from '../../types';

export default function EntranceExamsPage() {
  const [selectedStream, setSelectedStream] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMode, setSelectedMode] = useState<string>('All');

  // Filter exams strictly by selected stream and search query
  const filteredExams = useMemo(() => {
    return ENTRANCE_EXAMS_DATA.filter(exam => {
      // 1. Stream filter
      const matchesStream = selectedStream === 'All' || exam.stream === selectedStream;

      // 2. Mode filter
      const matchesMode = selectedMode === 'All' || 
        (selectedMode === 'CBT' && exam.examMode.toLowerCase().includes('computer')) ||
        (selectedMode === 'PenPaper' && (exam.examMode.toLowerCase().includes('pen') || exam.examMode.toLowerCase().includes('omr') || exam.examMode.toLowerCase().includes('written')));

      // 3. Search query
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        exam.name.toLowerCase().includes(q) ||
        exam.fullName.toLowerCase().includes(q) ||
        exam.conductingBody.toLowerCase().includes(q) ||
        exam.targetCourses.toLowerCase().includes(q) ||
        exam.eligibility.toLowerCase().includes(q) ||
        exam.stream.toLowerCase().includes(q) ||
        (exam.firstGenTips && exam.firstGenTips.toLowerCase().includes(q));

      return matchesStream && matchesMode && matchesSearch;
    });
  }, [selectedStream, selectedMode, searchQuery]);

  // Counts per stream for the badge counters
  const streamCounts = useMemo(() => {
    const counts: Record<string, number> = { All: ENTRANCE_EXAMS_DATA.length };
    ENTRANCE_EXAMS_DATA.forEach(exam => {
      counts[exam.stream] = (counts[exam.stream] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div style={{ padding: '2.5rem 0 5rem', minHeight: '100vh' }}>
      <div className="container">
        {/* Page Header */}
        <div style={{ marginBottom: '2.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
            <span className="badge badge-cream">
              🏛️ Verified Official Gateways
            </span>
            <span className="badge badge-glass">
              Pan-India Entrance Directory
            </span>
          </div>

          <h1 style={{ 
            fontSize: '2.4rem', 
            fontWeight: 800, 
            color: 'var(--text-main)', 
            letterSpacing: '-0.025em',
            margin: '0 0 0.65rem 0',
            lineHeight: 1.2
          }}>
            All-India Entrance Examinations Directory
          </h1>

          <p style={{ color: 'var(--text-secondary)', maxWidth: '780px', margin: 0, fontSize: '1rem', lineHeight: 1.6 }}>
            Select your academic stream below to discover national and state-level competitive exams. Review eligibility rules, exam cycles, fee waiver benefits, and click direct links to open official government registration portals.
          </p>
        </div>

        {/* STREAM CHOOSER BARS */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '0.75rem',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Choose Academic Stream:
            </span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Showing {filteredExams.length} {filteredExams.length === 1 ? 'Exam' : 'Exams'}
            </span>
          </div>

          {/* Interactive Stream Selection Bars */}
          <div 
            role="tablist"
            aria-label="Stream selection bars"
            style={{ 
              display: 'flex', 
              gap: '0.65rem', 
              flexWrap: 'wrap',
              background: 'rgba(255, 255, 255, 0.65)',
              padding: '0.85rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-glass)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            {EXAM_STREAMS.map(stream => {
              const isSelected = selectedStream === stream.id;
              const count = streamCounts[stream.id] || 0;

              return (
                <button
                  key={stream.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  id={`stream-bar-${stream.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  onClick={() => setSelectedStream(stream.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.6rem 1.1rem',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '1.5px solid #2563EB' : '1px solid #E2E8F0',
                    background: isSelected 
                      ? 'linear-gradient(135deg, #1E40AF 0%, #2563EB 100%)' 
                      : '#FFFFFF',
                    color: isSelected ? '#FFFFFF' : 'var(--text-main)',
                    fontSize: '0.875rem',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 4px 12px rgba(37, 99, 235, 0.25)' : 'none'
                  }}
                >
                  <span style={{ fontSize: '1.05rem' }}>{stream.icon}</span>
                  <span>{stream.name}</span>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.5rem',
                    borderRadius: '12px',
                    background: isSelected ? 'rgba(255, 255, 255, 0.25)' : '#F1F5F9',
                    color: isSelected ? '#FFFFFF' : '#475569'
                  }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* SEARCH & QUICK FILTERS BAR */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          marginBottom: '2rem',
          background: '#FFFFFF',
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-glass)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          {/* Search Input */}
          <div style={{ flex: '1 1 320px', position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}>
              🔍
            </span>
            <input
              id="search-entrance-exams-input"
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by exam name (e.g. JEE, NEET, CLAT), conducting body, or degree..."
              style={{
                width: '100%',
                padding: '0.65rem 2.25rem 0.65rem 2.35rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid #CBD5E1',
                fontSize: '0.875rem',
                outline: 'none'
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                &times;
              </button>
            )}
          </div>

          {/* Mode Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>Test Mode:</span>
            <select
              id="exam-mode-select"
              value={selectedMode}
              onChange={e => setSelectedMode(e.target.value)}
              style={{
                padding: '0.55rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid #CBD5E1',
                fontSize: '0.8125rem',
                background: '#FFFFFF',
                color: 'var(--text-main)',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <option value="All">All Modes (CBT &amp; Offline)</option>
              <option value="CBT">Computer Based (CBT)</option>
              <option value="PenPaper">Pen &amp; Paper / OMR</option>
            </select>
          </div>

          {/* Reset button if filtered */}
          {(selectedStream !== 'All' || searchQuery || selectedMode !== 'All') && (
            <button
              type="button"
              onClick={() => {
                setSelectedStream('All');
                setSearchQuery('');
                setSelectedMode('All');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#2563EB',
                fontSize: '0.8125rem',
                fontWeight: 700,
                cursor: 'pointer',
                padding: '0.4rem 0.6rem'
              }}
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* EXAMS GRID */}
        {filteredExams.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '1.75rem',
            marginBottom: '3.5rem'
          }}>
            {filteredExams.map(exam => (
              <div 
                key={exam.id} 
                className="card card-hover" 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  position: 'relative',
                  borderTop: `4px solid ${exam.badgeColor || '#2563EB'}`,
                  background: '#FFFFFF',
                  padding: '1.65rem'
                }}
              >
                {/* Header Tag Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.85rem' }}>
                  <span className="badge badge-cream" style={{ fontSize: '0.72rem', fontWeight: 700 }}>
                    {exam.stream}
                  </span>
                  {exam.featuredTag && (
                    <span 
                      className="badge" 
                      style={{ 
                        fontSize: '0.7rem', 
                        fontWeight: 700,
                        background: 'rgba(37, 99, 235, 0.08)',
                        color: '#1D4ED8',
                        borderColor: '#BFDBFE'
                      }}
                    >
                      {exam.featuredTag}
                    </span>
                  )}
                </div>

                {/* Exam Acronym & Full Name */}
                <div style={{ marginBottom: '1rem' }}>
                  <h2 style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 800, 
                    color: 'var(--text-main)', 
                    margin: '0 0 0.25rem 0',
                    letterSpacing: '-0.015em'
                  }}>
                    {exam.name}
                  </h2>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {exam.fullName}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.25rem', fontWeight: 600 }}>
                    Conducted by: <strong>{exam.conductingBody}</strong>
                  </div>
                </div>

                {/* Target Courses Box */}
                <div style={{
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.75rem 0.9rem',
                  marginBottom: '1rem',
                  fontSize: '0.8125rem'
                }}>
                  <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 800, color: '#475569', letterSpacing: '0.5px', marginBottom: '2px' }}>
                    Target Degrees &amp; Colleges:
                  </div>
                  <div style={{ color: '#0F172A', fontWeight: 600, lineHeight: 1.45 }}>
                    {exam.targetCourses}
                  </div>
                </div>

                {/* Details Checklist Grid */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem',
                  fontSize: '0.8125rem',
                  color: 'var(--text-secondary)',
                  marginBottom: '1.25rem',
                  flex: 1
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                    <span style={{ fontSize: '0.95rem', lineHeight: 1 }}>📋</span>
                    <div>
                      <strong style={{ color: 'var(--text-main)' }}>Eligibility:</strong> {exam.eligibility}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                    <span style={{ fontSize: '0.95rem', lineHeight: 1 }}>🔄</span>
                    <div>
                      <strong style={{ color: 'var(--text-main)' }}>Frequency &amp; Mode:</strong> {exam.frequency} &bull; {exam.examMode}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                    <span style={{ fontSize: '0.95rem', lineHeight: 1 }}>📅</span>
                    <div>
                      <strong style={{ color: 'var(--text-main)' }}>Key Schedule:</strong> {exam.keyDates}
                    </div>
                  </div>

                  {exam.applicationFee && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                      <span style={{ fontSize: '0.95rem', lineHeight: 1 }}>💳</span>
                      <div>
                        <strong style={{ color: 'var(--text-main)' }}>Exam Fee:</strong> {exam.applicationFee}
                      </div>
                    </div>
                  )}
                </div>

                {/* First-Gen Advantage Highlight */}
                {exam.firstGenTips && (
                  <div style={{
                    background: 'rgba(21, 128, 61, 0.06)',
                    border: '1px solid rgba(21, 128, 61, 0.2)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.75rem 0.9rem',
                    marginBottom: '1.25rem',
                    fontSize: '0.78rem',
                    color: '#166534',
                    lineHeight: 1.45
                  }}>
                    <strong style={{ display: 'block', marginBottom: '2px', color: '#15803D' }}>
                      💡 First-Gen &amp; Fee Waiver Advantage:
                    </strong>
                    {exam.firstGenTips}
                  </div>
                )}

                {/* Direct Redirect Action to Official Portal */}
                <div style={{ marginTop: 'auto', paddingTop: '0.85rem', borderTop: '1px solid #F1F5F9' }}>
                  <a
                    href={exam.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    id={`visit-portal-${exam.id}`}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      textDecoration: 'none',
                      background: 'linear-gradient(135deg, #1E40AF 0%, #2563EB 100%)',
                      color: '#FFFFFF',
                      boxShadow: '0 4px 10px rgba(37, 99, 235, 0.25)'
                    }}
                  >
                    <span>Visit Official {exam.name} Portal</span>
                    <span style={{ fontSize: '1.1rem' }}>↗</span>
                  </a>
                  <div style={{ fontSize: '0.7rem', color: '#94A3B8', textAlign: 'center', marginTop: '0.35rem' }}>
                    Opens verified government portal ({new URL(exam.officialUrl).hostname}) in a new tab
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty Search / Filter State */
          <div className="card" style={{ textAlign: 'center', padding: '4rem 1.5rem', marginBottom: '3rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔎</div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              No Entrance Exams Found
            </h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
              We couldn&apos;t find any exams matching your current filters in <strong>{selectedStream}</strong>. Try choosing &quot;All Streams&quot; or clearing your search term.
            </p>
            <button
              type="button"
              className="btn btn-cream"
              onClick={() => {
                setSelectedStream('All');
                setSearchQuery('');
                setSelectedMode('All');
              }}
            >
              Reset to All Streams
            </button>
          </div>
        )}

        {/* First-Gen Aspirant Guidance Section */}
        <div style={{
          background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
          border: '1px solid #BFDBFE',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem'
        }}>
          <div>
            <div className="badge badge-cream" style={{ marginBottom: '0.75rem' }}>
              Statutory Fee Remissions &amp; Scholarships
            </div>
            <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#1E3A8A', margin: '0 0 0.75rem 0' }}>
              Don&apos;t Let Exam or College Fees Deter You
            </h3>
            <p style={{ color: '#1E40AF', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
              The Government of India and premier statutory institutions (IITs, NITs, AIIMS, Central Universities, NLUs) mandate <strong>100% tuition fee remission</strong> for students from families with annual income under ₹1 Lakh, as well as full exemptions for SC and ST candidates.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ background: '#FFFFFF', padding: '0.85rem 1.15rem', borderRadius: 'var(--radius-md)', border: '1px solid #BFDBFE' }}>
              <strong style={{ color: '#1E3A8A', display: 'block', fontSize: '0.875rem' }}>
                1. Central Sector Scholarship (CSSS)
              </strong>
              <span style={{ fontSize: '0.78rem', color: '#475569' }}>
                ₹12,000 to ₹20,000 per year directly into bank accounts via National Scholarship Portal (NSP).
              </span>
            </div>

            <div style={{ background: '#FFFFFF', padding: '0.85rem 1.15rem', borderRadius: 'var(--radius-md)', border: '1px solid #BFDBFE' }}>
              <strong style={{ color: '#1E3A8A', display: 'block', fontSize: '0.875rem' }}>
                2. SBI Scholar Loan Scheme (Collateral-Free)
              </strong>
              <span style={{ fontSize: '0.78rem', color: '#475569' }}>
                Zero collateral education loans up to ₹40 Lakhs with subsidized interest for top 150 institutes.
              </span>
            </div>

            <div style={{ marginTop: '0.5rem' }}>
              <Link href="/resources" className="btn btn-sm btn-cream" style={{ width: '100%', justifyContent: 'center' }}>
                Explore All Scholarships &amp; Fee Waiver Guides &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
