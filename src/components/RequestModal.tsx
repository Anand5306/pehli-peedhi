'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LANGUAGES_LIST } from '../data/mockData';

export default function RequestModal() {
  const { activeModalMentor, closeRequestModal, submitRequest } = useApp();
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState('Hindi');
  const [contactMode, setContactMode] = useState('Written Feedback');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!activeModalMentor) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      submitRequest(topic, language, contactMode);
      setTopic('');
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="modal-overlay" onClick={closeRequestModal} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="badge badge-cream" style={{ marginBottom: '0.25rem' }}>
              Free 1-on-1 Mentorship
            </span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
              Connect with {activeModalMentor.fullName}
            </h3>
          </div>
          <button 
            type="button" 
            onClick={closeRequestModal}
            style={{ 
              background: 'none', 
              border: 'none', 
              fontSize: '1.5rem', 
              color: 'var(--text-muted)', 
              cursor: 'pointer',
              lineHeight: 1 
            }}
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ 
              background: 'rgba(248, 250, 252, 0.9)', 
              padding: '0.85rem 1rem', 
              borderRadius: 'var(--radius-md)', 
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              marginBottom: '1.25rem',
              border: '1px solid var(--border-subtle)'
            }}>
              <strong>Alumni Background:</strong> {activeModalMentor.degree} from {activeModalMentor.graduationCollege}.
              Ask about college selection, fees, scholarships, or entrance exam preparation.
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="request-topic">
                What specific guidance do you need?
              </label>
              <textarea
                id="request-topic"
                className="form-textarea"
                rows={4}
                required
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="Explain your situation: college selection doubts, balancing boards with entrance prep, or applying for fee waivers."
              />
              <div className="form-hint">
                Be specific and concise so the mentor can provide actionable advice.
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="request-language">
                  Preferred Language
                </label>
                <select
                  id="request-language"
                  className="form-select"
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                >
                  {LANGUAGES_LIST.filter(l => l !== 'All Languages').map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="request-mode">
                  Guidance Format
                </label>
                <select
                  id="request-mode"
                  className="form-select"
                  value={contactMode}
                  onChange={e => setContactMode(e.target.value)}
                >
                  <option value="Written Feedback">Written Q&amp;A Feedback</option>
                  <option value="15-min Weekend Call">15-minute Weekend Phone Call</option>
                </select>
              </div>
            </div>

            <div style={{ 
              fontSize: '0.75rem', 
              color: 'var(--text-secondary)', 
              background: 'rgba(241, 245, 249, 0.7)', 
              padding: '0.65rem 0.85rem', 
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)'
            }}>
              Personal contact details remain protected and are only shared with the mentor once your request is accepted.
            </div>
          </div>

          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={closeRequestModal}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-cream"
              disabled={isSubmitting || !topic.trim()}
            >
              {isSubmitting ? 'Sending Request...' : 'Send Mentorship Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
