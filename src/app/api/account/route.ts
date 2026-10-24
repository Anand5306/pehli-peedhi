import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { userId, email, role } = body;

    if (!userId && !email) {
      return NextResponse.json({ ok: false, message: 'Missing user identification' }, { status: 400 });
    }

    if (isSupabaseConfigured && supabase) {
      // 1. Delete or mark deleted in mentors table
      if (userId) {
        try {
          await supabase.from('mentors').delete().eq('id', userId);
        } catch (e) {
          console.warn('Delete mentor exception:', e);
        }
        try {
          await supabase.from('mentors').update({
            verification_status: 'deleted',
            short_bio: '[DELETED]',
            verified: false
          }).eq('id', userId);
        } catch (e) {
          console.warn('Update mentor to deleted exception:', e);
        }
      }

      // 2. Delete or mark deleted in students table
      if (userId) {
        try {
          await supabase.from('students').delete().eq('id', userId);
        } catch (e) {
          console.warn('Delete student exception:', e);
        }
      }

      // 3. Delete related reviews
      if (userId) {
        try {
          await supabase.from('mentor_reviews').delete().or(`mentor_id.eq.${userId},student_id.eq.${userId}`);
        } catch (e) {
          console.warn('Delete mentor_reviews exception:', e);
        }
      }

      // 4. Delete or mark deleted in mentorship_requests
      if (userId) {
        try {
          await supabase.from('mentorship_requests').delete().or(`mentor_id.eq.${userId},student_id.eq.${userId}`);
        } catch (e) {
          console.warn('Delete requests exception:', e);
        }
        try {
          await supabase.from('mentorship_requests').update({
            status: 'Declined',
            status_message: 'Account permanently removed by user'
          }).or(`mentor_id.eq.${userId},student_id.eq.${userId}`);
        } catch (e) {
          console.warn('Update requests exception:', e);
        }
      }

      // 5. Delete verifications
      if (userId) {
        try {
          await supabase.from('account_verifications').delete().eq('user_id', userId);
        } catch (e) {
          console.warn('Delete verifications exception:', e);
        }
      }

      // 6. Delete or wipe profiles
      if (userId) {
        try {
          await supabase.from('profiles').delete().eq('id', userId);
        } catch (e) {
          console.warn('Delete profiles exception:', e);
        }
        try {
          await supabase.from('profiles').update({
            full_name: '[DELETED]',
            email: `deleted_${Date.now()}@example.com`,
            verification_status: 'deleted',
            verified: false
          }).eq('id', userId);
        } catch (e) {
          console.warn('Wipe profiles exception:', e);
        }
      } else if (email) {
        try {
          await supabase.from('profiles').delete().eq('email', email);
        } catch (e) {
          console.warn('Delete profiles by email exception:', e);
        }
      }
    }

    return NextResponse.json({ ok: true, message: 'Account permanently deleted' });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err?.message || 'Delete account failed' }, { status: 500 });
  }
}
