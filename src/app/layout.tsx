import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '../context/AppContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RequestModal from '../components/RequestModal';
import Toast from '../components/Toast';

export const metadata: Metadata = {
  title: 'PehliPeedhi (पहली पीढ़ी) | Mentorship for First-Generation Learners',
  description: 'Connecting first-generation students across India with verified graduate mentors who walked the same journey. 100% free guidance on college admissions, scholarships, and careers.',
  keywords: ['first-generation learners', 'mentorship India', 'college guidance', 'national scholarship portal', 'NSP scholarship', 'engineering admission', 'NEET counseling'],
  authors: [{ name: 'PehliPeedhi Education Foundation' }],
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AppProvider>
          <React.Suspense fallback={null}>
            <Navbar />
          </React.Suspense>
          <main id="main-content" style={{ flex: 1 }}>
            {children}
          </main>
          <Footer />
          <RequestModal />
          <Toast />
        </AppProvider>
      </body>
    </html>
  );
}
