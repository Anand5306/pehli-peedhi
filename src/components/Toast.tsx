'use client';

import React from 'react';
import { useApp } from '../context/AppContext';

export default function Toast() {
  const { toast } = useApp();

  if (!toast) return null;

  const bg = toast.type === 'error' ? '#DC2626' : toast.type === 'info' ? '#1E293B' : '#15803D';

  return (
    <div className="toast" style={{ background: bg }}>
      <span>{toast.text}</span>
    </div>
  );
}
