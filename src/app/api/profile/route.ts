import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const {
      userId,
      email,
      role,
      fullName,
      phone,
      city,
      district,
      state,
      // Mentor fields
      graduationCollege,
      degree,
      field,
      expertise,
      graduationYear,
      languages,
      shortBio,
      availability,
      // Student fields
      currentEducationLevel,
      intendedCourse,
      preferredLanguage,
      firstGenNote
    } = body;

    if (!userId && !email) {
      return NextResponse.json({ ok: false, message: 'Missing user identification' }, { status: 400 });
    }

    if (isSupabaseConfigured && supabase) {
      // 1. Update public.profiles
      const profileUpdates: any = {
        updated_at: new Date().toISOString()
      };
      if (fullName) profileUpdates.full_name = fullName.trim();
      if (phone !== undefined) profileUpdates.phone = phone;
      if (city !== undefined) profileUpdates.city = city;
      if (district !== undefined) profileUpdates.district = district;
      if (state !== undefined) profileUpdates.state = state;

      if (userId) {
        const { error: pErr } = await supabase
          .from('profiles')
          .update(profileUpdates)
          .eq('id', userId);

        if (pErr) console.warn('Supabase profiles update warning:', pErr);
      } else if (email) {
        const { error: pErr } = await supabase
          .from('profiles')
          .update(profileUpdates)
          .eq('email', email.trim().toLowerCase());

        if (pErr) console.warn('Supabase profiles email update warning:', pErr);
      }

      // 2. Role-specific table updates
      if (role === 'mentor' && userId) {
        const mentorUpdates: any = {
          updated_at: new Date().toISOString()
        };
        if (graduationCollege) mentorUpdates.graduation_college = graduationCollege;
        if (degree) mentorUpdates.degree = degree;
        if (field) mentorUpdates.field = field;
        if (expertise) mentorUpdates.expertise = expertise;
        if (graduationYear) mentorUpdates.graduation_year = graduationYear;
        if (languages) mentorUpdates.languages = languages;
        if (shortBio) mentorUpdates.short_bio = shortBio;
        if (availability) mentorUpdates.availability = availability;
        if (city !== undefined) mentorUpdates.city = city;
        if (district !== undefined) mentorUpdates.district = district;
        if (state !== undefined) mentorUpdates.state = state;

        await supabase
          .from('mentors')
          .update(mentorUpdates)
          .eq('id', userId);

        if (fullName) {
          // Update mentor name in requests
          await supabase
            .from('mentorship_requests')
            .update({ mentor_name: fullName.trim() })
            .eq('mentor_id', userId);
        }
      } else if (role === 'student' && userId) {
        const studentUpdates: any = {
          updated_at: new Date().toISOString()
        };
        if (currentEducationLevel) studentUpdates.current_education_level = currentEducationLevel;
        if (intendedCourse) studentUpdates.intended_course = intendedCourse;
        if (preferredLanguage) studentUpdates.preferred_language = preferredLanguage;
        if (firstGenNote) studentUpdates.first_gen_note = firstGenNote;
        if (city !== undefined) studentUpdates.city = city;
        if (district !== undefined) studentUpdates.district = district;
        if (state !== undefined) studentUpdates.state = state;

        await supabase
          .from('students')
          .update(studentUpdates)
          .eq('id', userId);

        if (fullName) {
          // Update student name in requests and reviews
          await supabase
            .from('mentorship_requests')
            .update({ student_name: fullName.trim() })
            .eq('student_id', userId);

          await supabase
            .from('mentor_reviews')
            .update({ student_name: fullName.trim() })
            .eq('student_id', userId);
        }
      }
    }

    return NextResponse.json({ ok: true, message: 'Profile updated in database successfully' });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err?.message || 'Profile update failed' }, { status: 500 });
  }
}
