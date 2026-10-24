import { NextResponse } from 'next/server';
import { SAMPLE_MENTORS } from '../../../data/mockData';
import { MentorProfile } from '../../../types';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.toLowerCase() || '';
  const field = searchParams.get('field') || '';
  const state = searchParams.get('state') || '';
  const language = searchParams.get('language') || '';

  let mentorsList: MentorProfile[] = [...SAMPLE_MENTORS];

  // Fetch real mentors from Supabase PostgreSQL if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: dbMentors, error } = await supabase
        .from('mentors')
        .select('*, profiles(*)');

      const { data: dbReviews } = await supabase
        .from('mentor_reviews')
        .select('*');

      if (!error && dbMentors && dbMentors.length > 0) {
        mentorsList = dbMentors
          .filter((m: any) => 
            m.verification_status !== 'deleted' && 
            m.short_bio !== '[DELETED]' && 
            m.id !== '443f5649-17c2-4d34-a253-43cb925c72d5'
          )
          .map((m: any) => {
          const mentorReviews = (dbReviews || [])
            .filter((rev: any) => rev.mentor_id === m.id)
            .map((rev: any) => ({
              id: rev.id,
              mentorId: rev.mentor_id,
              studentId: rev.student_id,
              studentName: rev.student_name,
              rating: rev.rating,
              meetingDate: rev.meeting_date || new Date(rev.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
              meetingTime: rev.meeting_time || rev.meeting_scheduled_time || '',
              meetingScheduledTime: rev.meeting_scheduled_time || '',
              topic: rev.topic || '',
              date: new Date(rev.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
              requestId: rev.request_id
            }));

          return {
            id: m.id,
            fullName: m.profiles?.full_name || 'Graduate Mentor',
            avatar: (m.profiles?.full_name || 'M').slice(0, 2).toUpperCase(),
            avatarColor: '#2563EB',
            city: m.city || m.profiles?.city || '',
            district: m.district || m.profiles?.district || '',
            state: m.state || m.profiles?.state || 'Bihar',
            email: m.profiles?.email || '',
            phone: m.profiles?.phone || '',
            graduationCollege: m.graduation_college,
            degree: m.degree,
            field: m.field,
            expertise: m.expertise || 'First-Gen Mentorship Guidance',
            graduationYear: m.graduation_year || '2023',
            languages: m.languages || ['Hindi', 'English'],
            shortBio: m.short_bio || 'First-generation graduate mentor ready to guide aspiring students.',
            availability: m.availability || 'Available on Weekends',
            verified: !!m.verified,
            verificationStatus: m.verification_status || (m.verified ? 'verified' : 'unverified'),
            verificationData: m.verification_data,
            menteeCount: m.mentee_count || 0,
            featured: !!m.featured,
            rating: mentorReviews.length > 0 
              ? Number((mentorReviews.reduce((sum: number, r: any) => sum + (Number(r.rating) || 0), 0) / mentorReviews.length).toFixed(1))
              : (m.review_count && Number(m.review_count) > 0 ? (Number(m.rating) || 0) : 0),
            reviewCount: mentorReviews.length || m.review_count || 0,
            reviews: mentorReviews
          };
        });
      }
    } catch (err) {
      console.warn('API mentors Supabase query exception:', err);
    }
  }

  let filtered = mentorsList;

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

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ ok: false, message: 'Missing mentor id' }, { status: 400 });
    }
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('mentors').delete().eq('id', id);
      } catch (e) {
        console.warn('DELETE /api/mentors error:', e);
      }
      try {
        await supabase.from('mentors').update({
          verification_status: 'deleted',
          short_bio: '[DELETED]',
          verified: false
        }).eq('id', id);
      } catch (e) {
        console.warn('UPDATE /api/mentors error:', e);
      }
    }
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err?.message || 'Delete failed' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newId = (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') 
      ? crypto.randomUUID() 
      : `mentor-${Date.now()}`;

    const newMentor: MentorProfile = {
      id: newId,
      fullName: body.fullName,
      avatar: body.fullName.slice(0, 2).toUpperCase(),
      avatarColor: '#2563EB',
      city: body.city || '',
      district: body.district || '',
      state: body.state || 'Bihar',
      email: body.email,
      phone: body.phone || '',
      graduationCollege: body.graduationCollege,
      degree: body.degree,
      field: body.field || 'Engineering & Technology',
      expertise: body.expertise || 'First-gen higher education guidance',
      graduationYear: body.graduationYear || '2023',
      languages: body.languages || ['Hindi', 'English'],
      shortBio: body.shortBio || '',
      availability: body.availability || 'Available on Weekends',
      verified: true,
      menteeCount: 0,
      rating: 0,
      reviewCount: 0
    };

    if (isSupabaseConfigured && supabase) {
      await supabase.from('profiles').upsert({
        id: newId,
        full_name: body.fullName,
        email: body.email,
        role: 'mentor',
        phone: body.phone || null
      });

      await supabase.from('mentors').upsert({
        id: newId,
        graduation_college: body.graduationCollege,
        degree: body.degree,
        field: body.field || 'Engineering & Technology',
        expertise: body.expertise || null,
        graduation_year: body.graduationYear || '2023',
        languages: body.languages || ['Hindi', 'English'],
        short_bio: body.shortBio || null,
        availability: body.availability || 'Available on Weekends',
        verified: true
      });
    }

    return NextResponse.json({ ok: true, mentor: newMentor }, { status: 201 });
  } catch {
    return NextResponse.json({ ok: false, message: 'Invalid payload' }, { status: 400 });
  }
}
