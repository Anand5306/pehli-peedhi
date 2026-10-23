'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EDUCATION_LEVELS, INDIAN_STATES, LANGUAGES_LIST } from '../../data/mockData';
import RequireAuth from '../../components/RequireAuth';

function ProfileContent() {
  const { role, studentProfile, mentorProfile, updateStudentProfile, updateMentorProfile } = useApp();

  const [studentForm, setStudentForm] = useState(studentProfile);
  const [mentorForm, setMentorForm] = useState(mentorProfile);

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudentProfile(studentForm);
  };

  const handleMentorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMentorProfile(mentorForm);
  };

  return (
    <div style={{ padding: '3rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge badge-cream" style={{ marginBottom: '0.4rem' }}>
              Account Settings
            </span>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              {role === 'mentor' ? 'Mentor Profile & Availability' : 'Student Learner Profile'}
            </h1>
          </div>

        </div>

        {/* STUDENT PROFILE FORM */}
        {role !== 'mentor' ? (
          <form onSubmit={handleStudentSubmit} className="card" style={{ padding: '2.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem' }}>
              Personal &amp; Educational Background
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="student-name">Full Name</label>
                <input
                  id="student-name"
                  type="text"
                  className="form-input"
                  required
                  value={studentForm.fullName}
                  onChange={e => setStudentForm({ ...studentForm, fullName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="student-email">Email Address</label>
                <input
                  id="student-email"
                  type="email"
                  className="form-input"
                  required
                  value={studentForm.email}
                  onChange={e => setStudentForm({ ...studentForm, email: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="student-phone">Phone / WhatsApp Number</label>
                <input
                  id="student-phone"
                  type="text"
                  className="form-input"
                  value={studentForm.phone}
                  onChange={e => setStudentForm({ ...studentForm, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="student-state">Home State</label>
                <select
                  id="student-state"
                  className="form-select"
                  value={studentForm.state}
                  onChange={e => setStudentForm({ ...studentForm, state: e.target.value })}
                >
                  {INDIAN_STATES.filter(s => s !== 'All States').map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="student-city">City / District</label>
                <input
                  id="student-city"
                  type="text"
                  className="form-input"
                  value={studentForm.city}
                  onChange={e => setStudentForm({ ...studentForm, city: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="student-level">Current Education Level</label>
                <select
                  id="student-level"
                  className="form-select"
                  value={studentForm.currentEducationLevel}
                  onChange={e => setStudentForm({ ...studentForm, currentEducationLevel: e.target.value })}
                >
                  {EDUCATION_LEVELS.map(lvl => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="student-course">Target Degree / Course</label>
                <input
                  id="student-course"
                  type="text"
                  className="form-input"
                  placeholder="e.g. B.Tech Computer Science, MBBS, BCA, State PSC"
                  value={studentForm.intendedCourse}
                  onChange={e => setStudentForm({ ...studentForm, intendedCourse: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="student-lang">Preferred Language for Mentorship</label>
              <select
                id="student-lang"
                className="form-select"
                value={studentForm.preferredLanguage}
                onChange={e => setStudentForm({ ...studentForm, preferredLanguage: e.target.value })}
              >
                {LANGUAGES_LIST.filter(l => l !== 'All Languages').map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="student-notes">First-Gen Family Background (Optional)</label>
              <textarea
                id="student-notes"
                className="form-textarea"
                rows={3}
                placeholder="Share your background or the specific hurdles you are facing."
                value={studentForm.firstGenNote || ''}
                onChange={e => setStudentForm({ ...studentForm, firstGenNote: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-cream">
                Save Student Profile
              </button>
            </div>
          </form>
        ) : (
          /* MENTOR PROFILE FORM */
          <form onSubmit={handleMentorSubmit} className="card" style={{ padding: '2.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem' }}>
              Graduate Alumni Credentials &amp; Bio
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="mentor-name">Full Name</label>
                <input
                  id="mentor-name"
                  type="text"
                  className="form-input"
                  required
                  value={mentorForm.fullName}
                  onChange={e => setMentorForm({ ...mentorForm, fullName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="mentor-email">Email Address</label>
                <input
                  id="mentor-email"
                  type="email"
                  className="form-input"
                  required
                  value={mentorForm.email}
                  onChange={e => setMentorForm({ ...mentorForm, email: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="mentor-college">Graduation Alma Mater</label>
                <input
                  id="mentor-college"
                  type="text"
                  className="form-input"
                  required
                  value={mentorForm.graduationCollege}
                  onChange={e => setMentorForm({ ...mentorForm, graduationCollege: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="mentor-degree">Degree &amp; Branch</label>
                <input
                  id="mentor-degree"
                  type="text"
                  className="form-input"
                  required
                  value={mentorForm.degree}
                  onChange={e => setMentorForm({ ...mentorForm, degree: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="mentor-expertise">Core Guidance Expertise</label>
                <input
                  id="mentor-expertise"
                  type="text"
                  className="form-input"
                  value={mentorForm.expertise}
                  onChange={e => setMentorForm({ ...mentorForm, expertise: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="mentor-avail">Weekly Availability Window</label>
                <input
                  id="mentor-avail"
                  type="text"
                  className="form-input"
                  value={mentorForm.availability}
                  onChange={e => setMentorForm({ ...mentorForm, availability: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="mentor-bio">Your First-Gen Journey &amp; Advice</label>
              <textarea
                id="mentor-bio"
                className="form-textarea"
                rows={4}
                value={mentorForm.shortBio}
                onChange={e => setMentorForm({ ...mentorForm, shortBio: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-cream">
                Save Mentor Profile
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <RequireAuth>
      <ProfileContent />
    </RequireAuth>
  );
}
