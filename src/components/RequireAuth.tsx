'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Role } from '../types';
import { useApp } from '../context/AppContext';

type AccountRole = Exclude<Role, 'guest'>;

export default function RequireAuth({
  children,
  allowedRole
}: {
  children: React.ReactNode;
  allowedRole?: AccountRole;
}) {
  const router = useRouter();
  const { currentUser, isLoaded } = useApp();
  const isAuthenticated = currentUser && currentUser.role !== 'guest';
  const isAuthorized = isLoaded && isAuthenticated && (!allowedRole || currentUser.role === allowedRole);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isAuthenticated) {
      router.replace('/auth');
    } else if (allowedRole && currentUser.role !== allowedRole) {
      router.replace('/dashboard');
    }
  }, [allowedRole, currentUser, isAuthenticated, isLoaded, router]);

  return isAuthorized ? <>{children}</> : null;
}