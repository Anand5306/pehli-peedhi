'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser, role, logout } = useApp();

  return (
    <header className="site-header">
      <div className="container header-inner">
        {/* Brand Link */}
        <Link href="/" className="brand-link">
          <div className="brand-monogram">PP</div>
          <div className="brand-titles">
            <span className="brand-name">PehliPeedhi</span>
            <span className="brand-sub">Mentorship Network</span>
          </div>
        </Link>

        {/* Dynamic Navigation Links */}
        <nav className="site-nav">
          {!currentUser ? (
            <>
              <Link 
                href="/" 
                className={`nav-link ${pathname === '/' ? 'active' : ''}`}
              >
                Overview
              </Link>
              <Link 
                href="/#how-it-works" 
                className="nav-link"
              >
                How It Works
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
              {role === 'student' && (
                <Link 
                  href="/find-mentors" 
                  className={`nav-link ${pathname === '/find-mentors' ? 'active' : ''}`}
                >
                  Find Mentors
                </Link>
              )}
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
          {currentUser ? (
            <>
              <div className="badge badge-glass">
                {currentUser.role === 'mentor' ? 'Mentor' : 'Student'}: {currentUser.name}
              </div>
              <button 
                type="button" 
                className="btn btn-sm btn-secondary" 
                onClick={logout}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth" className="btn btn-sm btn-secondary">
                Sign In
              </Link>
              <Link href="/auth" className="btn btn-sm btn-cream">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
