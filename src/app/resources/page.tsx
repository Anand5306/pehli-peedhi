'use client';

import React, { useState } from 'react';
import { SAMPLE_RESOURCES } from '../../data/mockData';

export default function ResourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredResources = selectedCategory === 'All' 
    ? SAMPLE_RESOURCES 
    : SAMPLE_RESOURCES.filter(r => r.category === selectedCategory);

  return (
    <div style={{ padding: '3rem 0 5rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <span className="badge badge-cream" style={{ marginBottom: '0.5rem' }}>
            Knowledge Base
          </span>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Scholarships &amp; College Admission Roadmaps
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '680px', marginTop: '0.5rem' }}>
            Financial barriers should not prevent you from completing higher education. Explore verified government scholarships, fee waiver affidavits, and documentation guidelines.
          </p>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {['All', 'Scholarship', 'Financial Aid', 'College Life'].map(cat => (
            <button
              key={cat}
              type="button"
              className={`btn btn-sm ${selectedCategory === cat ? 'btn-cream' : 'btn-secondary'}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Resource Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem', marginBottom: '3.5rem' }}>
          {filteredResources.map(res => (
            <div key={res.id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span className="badge badge-cream">{res.category}</span>
                {res.featuredTag && (
                  <span className="badge badge-glass">{res.featuredTag}</span>
                )}
              </div>

              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                {res.title}
              </h2>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem', flex: 1 }}>
                {res.description}
              </p>

              <div style={{ 
                background: 'rgba(255, 255, 255, 0.65)', 
                padding: '0.85rem 1rem', 
                borderRadius: 'var(--radius-md)', 
                fontSize: '0.8125rem',
                marginBottom: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem'
              }}>
                <div>
                  <strong>Eligibility:</strong> {res.eligibility}
                </div>
                {res.amountOrBenefit && (
                  <div>
                    <strong>Financial Support:</strong> {res.amountOrBenefit}
                  </div>
                )}
                {res.deadline && (
                  <div>
                    <strong>Application Window:</strong> {res.deadline}
                  </div>
                )}
              </div>

              <a
                href={res.officialLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', marginTop: 'auto' }}
              >
                Official Portal Guidelines &rarr;
              </a>
            </div>
          ))}
        </div>

        {/* First-Gen Document Checklist Callout */}
        <div className="card" style={{ padding: '2.5rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
            Essential First-Generation Document Preparation Checklist
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Before admissions counseling begins, prepare the following original documents in physical and digital copies:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', fontSize: '0.875rem' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.7)', padding: '1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
              <strong>1. Family Income Certificate</strong>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginTop: '4px' }}>
                Issued by Revenue Officer, SDO, or Tehsildar (valid for the current financial year).
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.7)', padding: '1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
              <strong>2. Domicile / State Residence Certificate</strong>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginTop: '4px' }}>
                Required to verify eligibility for state quota seats in government engineering and medical institutions.
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.7)', padding: '1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
              <strong>3. Central / State Category Certificate</strong>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginTop: '4px' }}>
                For OBC-NCL, EWS, SC, or ST reservation. Must strictly conform to the national format.
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.7)', padding: '1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
              <strong>4. Student Bank Account with Aadhaar Seeding</strong>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginTop: '4px' }}>
                Active bank account in the student&apos;s own name linked via NPCI for Direct Benefit Transfer (DBT).
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
