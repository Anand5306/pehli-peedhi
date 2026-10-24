'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, role, logout, studentProfile, mentorProfile } = useApp();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Defer auth state so initial client render matches server SSR exactly
  const user = mounted ? currentUser : null;
  const currentRole = mounted ? role : 'guest';
  const isVerified = mounted && ((role === 'mentor' && mentorProfile.verified) || (role === 'student' && studentProfile.verified));

  return (
    <header className="site-header">
      <div className="container header-inner">
        {/* Brand Link */}
        <Link href="/" className="brand-link">
          <div className="brand-monogram">
            <img src="/logo.png" alt="PehliPeedhi Logo" />
          </div>
          <div className="brand-titles">
            <span className="brand-name">PehliPeedhi</span>
            <span className="brand-sub">Mentorship Network</span>
          </div>
        </Link>

        {/* Dynamic Navigation Links */}
        <nav className="site-nav">
          {!user ? (
            <>
              <Link 
                href="/" 
                className={`nav-link ${pathname === '/' ? 'active' : ''}`}
              >
                Overview
              </Link>
              <Link 
                href="/entrance-exams" 
                className={`nav-link ${pathname === '/entrance-exams' ? 'active' : ''}`}
              >
                Entrance Exams
              </Link>
              <Link 
                href="/resources" 
                className={`nav-link ${pathname === '/resources' ? 'active' : ''}`}
              >
                Scholarships
              </Link>
            </>
          ) : (
            <>
              <Link 
                href="/dashboard" 
                className={`nav-link ${pathname === '/dashboard' ? 'active' : ''}`}
              >
                Dashboard
              </Link>
              {currentRole === 'student' && (
                <Link 
                  href="/find-mentors" 
                  className={`nav-link ${pathname === '/find-mentors' ? 'active' : ''}`}
                >
                  Find Mentors
                </Link>
              )}
              <Link 
                href="/entrance-exams" 
                className={`nav-link ${pathname === '/entrance-exams' ? 'active' : ''}`}
              >
                Entrance Exams
              </Link>
              <Link 
                href="/resources" 
                className={`nav-link ${pathname === '/resources' ? 'active' : ''}`}
              >
                Scholarships
              </Link>
              <Link 
                href="/profile" 
                className={`nav-link ${pathname === '/profile' ? 'active' : ''}`}
              >
                Profile
              </Link>
            </>
          )}
        </nav>

        {/* Actions */}
        <div className="header-actions">
          {user ? (
            <>
              <div className="badge badge-glass" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>{user.role === 'mentor' ? 'Mentor' : 'Student'}: {user.name}</span>
                {isVerified && (
                  <span 
                    title="Verified Account" 
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      width: '16px', 
                      height: '16px', 
                      borderRadius: '50%', 
                      background: '#10B981', 
                      color: '#ffffff', 
                      fontSize: '10px', 
                      fontWeight: 800 
                    }}
                  >
                    ✓
                  </span>
                )}
              </div>
              <button 
                type="button" 
                className="btn btn-sm btn-secondary" 
                onClick={() => {
                  logout();
                  router.replace('/');
                }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth" className="btn btn-sm btn-secondary">
                Sign In
              </Link>
              <Link href="/auth" className="btn btn-sm btn-gold">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
