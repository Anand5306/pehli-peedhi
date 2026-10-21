import { NextResponse } from 'next/server';
import { SAMPLE_MENTORS } from '../../../data/mockData';
import { MentorProfile } from '../../../types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.toLowerCase() || '';
  const field = searchParams.get('field') || '';
  const state = searchParams.get('state') || '';
  const language = searchParams.get('language') || '';

  let filtered = [...SAMPLE_MENTORS];

  if (q) {
    filtered = filtered.filter(m => 
      m.fullName.toLowerCase().includes(q) ||
      m.graduationCollege.toLowerCase().includes(q) ||
      m.degree.toLowerCase().includes(q) ||
      m.expertise.toLowerCase().includes(q)
    );
  }

  if (field && field !== 'All Fields') {
    filtered = filtered.filter(m => m.field === field);
  }

  if (state && state !== 'All States') {
    filtered = filtered.filter(m => m.state === state);
  }

  if (language && language !== 'All Languages') {
    filtered = filtered.filter(m => m.languages.includes(language));
  }

  return NextResponse.json({
    ok: true,
    count: filtered.length,
    mentors: filtered
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newMentor: MentorProfile = {
      id: `mentor-${Date.now()}`,
      fullName: body.fullName,
      avatar: body.fullName.slice(0, 2).toUpperCase(),
      avatarColor: '#2563EB',
      city: body.city || 'Patna',
      district: body.district || 'Patna',
      state: body.state || 'Bihar',
      email: body.email,
      phone: body.phone || '+91 98000 00000',
      graduationCollege: body.graduationCollege,
      degree: body.degree,
      field: body.field || 'Engineering & Technology',
      expertise: body.expertise || 'First-gen higher education guidance',
      graduationYear: body.graduationYear || '2023',
      languages: body.languages || ['Hindi', 'English'],
      shortBio: body.shortBio,
      availability: body.availability || 'Weekends',
      verified: true,
      menteeCount: 0
    };

    return NextResponse.json({ ok: true, mentor: newMentor }, { status: 201 });
  } catch {
    return NextResponse.json({ ok: false, message: 'Invalid payload' }, { status: 400 });
  }
}
