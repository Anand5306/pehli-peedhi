'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { FIELDS_OF_STUDY, INDIAN_STATES, LANGUAGES_LIST } from '../../data/mockData';
import MentorCard from '../../components/MentorCard';

export default function FindMentorsPage() {
  const { mentors } = useApp();

  const [search, setSearch] = useState('');
  const [selectedField, setSelectedField] = useState('All Fields');
  const [selectedState, setSelectedState] = useState('All States');
  const [selectedLanguage, setSelectedLanguage] = useState('All Languages');

  const filteredMentors = useMemo(() => {
    return mentors.filter(mentor => {
      const q = search.trim().toLowerCase();
      const matchesSearch = !q || (
        mentor.fullName.toLowerCase().includes(q) ||
        mentor.graduationCollege.toLowerCase().includes(q) ||
        mentor.degree.toLowerCase().includes(q) ||
        mentor.expertise.toLowerCase().includes(q) ||
        mentor.shortBio.toLowerCase().includes(q)
      );

      const matchesField = selectedField === 'All Fields' || mentor.field === selectedField;
      const matchesState = selectedState === 'All States' || mentor.state === selectedState;
      const matchesLanguage = selectedLanguage === 'All Languages' || mentor.languages.includes(selectedLanguage);

      return matchesSearch && matchesField && matchesState && matchesLanguage;
    });
  }, [mentors, search, selectedField, selectedState, selectedLanguage]);

  const resetFilters = () => {
    setSearch('');
    setSelectedField('All Fields');
    setSelectedState('All States');
    setSelectedLanguage('All Languages');
  };

  return (
    <div style={{ padding: '3rem 0 5rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <span className="badge badge-cream" style={{ marginBottom: '0.5rem' }}>
            Alumni Directory
          </span>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Find Your First-Generation Mentor
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', marginTop: '0.5rem' }}>
            Filter by academic stream, home state, or mother tongue. Connect directly with graduates who navigated the same entrance tests and college hurdles.
          </p>
        </div>

        {/* Filter Controls Card */}
        <div className="card" style={{ marginBottom: '2.5rem' }}>
          {/* Search bar */}
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" htmlFor="search-input">
              Search by Mentor Name, College, or Degree
            </label>
            <input
              id="search-input"
              type="text"
              className="form-input"
              placeholder="e.g. NIT Trichy, MBBS, CA Articleship, Computer Science, Engineering..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Filter Dropdowns Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="field-select">Field of Study</label>
              <select
                id="field-select"
                className="form-select"
                value={selectedField}
                onChange={e => setSelectedField(e.target.value)}
              >
                {FIELDS_OF_STUDY.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="state-select">Home State</label>
              <select
                id="state-select"
                className="form-select"
                value={selectedState}
                onChange={e => setSelectedState(e.target.value)}
              >
                {INDIAN_STATES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="lang-select">Language Comfort</label>
              <select
                id="lang-select"
                className="form-select"
                value={selectedLanguage}
                onChange={e => setSelectedLanguage(e.target.value)}
              >
                {LANGUAGES_LIST.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={resetFilters}
              style={{ height: '42px' }}
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Results Info */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Showing <strong>{filteredMentors.length}</strong> verified alumni
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            Free Peer Guidance &bull; Response within 48 hours
          </div>
        </div>

        {/* Mentors Grid */}
        {mentors.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4.5rem 2rem' }}>
            <div className="brand-monogram" style={{ margin: '0 auto 1.25rem', width: '56px', height: '56px', fontSize: '1.5rem' }}>
              PP
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
              No Mentors Registered Yet
            </h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 1.75rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
              All artificial and sample profiles have been removed. Only real, verified alumni who create an account or sign in appear here.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/auth?role=mentor" className="btn btn-cream">
                Register as a First-Gen Mentor
              </Link>
              <Link href="/auth?role=student" className="btn btn-secondary">
                Join as Student
              </Link>
            </div>
          </div>
        ) : filteredMentors.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.75rem' }}>
            {filteredMentors.map(mentor => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))}
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No mentors found matching your filters</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
              Try broadening your search or resetting the language and state filters to see mentors from other regions.
            </p>
            <button type="button" className="btn btn-cream" onClick={resetFilters}>
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
