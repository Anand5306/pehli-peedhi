import { NextResponse } from 'next/server';
import { INITIAL_REQUESTS } from '../../../data/mockData';
import { MentorshipRequest } from '../../../types';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';

export async function GET() {
  let requestsList: MentorshipRequest[] = [...INITIAL_REQUESTS];

  if (isSupabaseConfigured && supabase) {
    try {
      const { data: dbRequests, error } = await supabase
        .from('mentorship_requests')
        .select('*, student:profiles!student_id(*), mentor:profiles!mentor_id(*)');

      const { data: dbReviews } = await supabase
        .from('mentor_reviews')
        .select('*');

      if (!error && dbRequests && dbRequests.length > 0) {
        requestsList = dbRequests
          .filter((r: any) => r.mentor_id !== '443f5649-17c2-4d34-a253-43cb925c72d5' && r.status !== 'deleted')
          .map((r: any) => {
          const matchingReview = (dbReviews || []).find((rev: any) => 
            rev.request_id === r.id || (rev.mentor_id === r.mentor_id && rev.student_id === r.student_id)
          );

          const isCompleted = r.status === 'Completed' || !!matchingReview || !!r.feedback?.rating;
          const isMeetingDone = isCompleted || !!r.meeting_completed || !!r.feedback?.meetingCompleted;

          const feedbackObj = r.feedback || (matchingReview ? {
            rating: matchingReview.rating,
            meetingDate: matchingReview.meeting_date || new Date(matchingReview.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            meetingTime: matchingReview.meeting_time || r.meeting_scheduled_time || 'Scheduled Session',
            submittedAt: new Date(matchingReview.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            tags: matchingReview.tags || [],
            comment: matchingReview.comment || ''
          } : null);

          const meetDate = r.meeting_date || feedbackObj?.meetingDate || (matchingReview ? new Date(matchingReview.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '');
          const meetTime = r.meeting_time || r.meeting_scheduled_time || feedbackObj?.meetingTime || '';
          const meetRating = r.rating || feedbackObj?.rating || matchingReview?.rating;

          return {
            id: r.id,
            studentId: r.student_id,
            studentName: r.student?.full_name || 'Student Learner',
            studentEmail: r.student?.email || '',
            studentPhone: r.student?.phone || '',
            studentLocation: '',
            intendedCourse: '',
            mentorId: r.mentor_id,
            mentorName: r.mentor?.full_name || 'Mentor',
            mentorCollege: '',
            mentorField: '',
            mentorLocation: '',
            mentorEmail: r.mentor?.email || '',
            mentorPhone: r.mentor?.phone || '',
            topic: r.topic,
            studentLanguage: r.student_language || 'Hindi',
            preferredContact: r.preferred_contact || 'Written Feedback',
            date: new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            status: isCompleted ? 'Completed' : r.status,
            statusMessage: isCompleted 
              ? `Session completed & rated ${meetRating} stars.` 
              : (isMeetingDone ? 'Google Meet concluded. Awaiting student feedback and star rating.' : r.status_message),
            mentorResponseNote: r.mentor_response_note,
            meetingLink: r.meeting_link,
            meetingDate: meetDate,
            meetingTime: meetTime,
            meetingScheduledTime: r.meeting_scheduled_time,
            meetingEmailSent: !!r.meeting_email_sent,
            meetingCompleted: isMeetingDone,
            meetingCompletedAt: r.meeting_completed_at || feedbackObj?.meetingCompletedAt || (matchingReview ? new Date(matchingReview.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : undefined),
            rating: meetRating,
            feedback: feedbackObj
          };
        });
      }
    } catch (err) {
      console.warn('API requests Supabase query exception:', err);
    }
  }

  return NextResponse.json({
    ok: true,
    requests: requestsList
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const requestId = (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') 
      ? crypto.randomUUID() 
      : `req-${Date.now()}`;

    const newRequest: MentorshipRequest = {
      id: requestId,
      studentId: body.studentId || (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : `student-${Date.now()}`),
      studentName: body.studentName || 'Student Learner',
      studentEmail: body.studentEmail || '',
      mentorId: body.mentorId,
      mentorName: body.mentorName,
      topic: body.topic,
      studentLanguage: body.studentLanguage || 'Hindi',
      preferredContact: body.preferredContact || 'Written Feedback',
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'Pending',
      statusMessage: 'Mentor has received your query and will respond soon.'
    };

    if (isSupabaseConfigured && supabase) {
      const isUuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (isUuidRegex.test(newRequest.studentId) && isUuidRegex.test(newRequest.mentorId)) {
        await supabase
          .from('mentorship_requests')
          .insert({
            id: requestId,
            student_id: newRequest.studentId,
            mentor_id: newRequest.mentorId,
            topic: newRequest.topic,
            student_language: newRequest.studentLanguage,
            preferred_contact: newRequest.preferredContact,
            status: 'Pending',
            status_message: newRequest.statusMessage
          });
      }
    }

    return NextResponse.json({ ok: true, request: newRequest }, { status: 201 });
  } catch {
    return NextResponse.json({ ok: false, message: 'Invalid request data' }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { 
      id, 
      status, 
      statusMessage, 
      mentorResponseNote, 
      meetingLink, 
      meetingDate, 
      meetingTime, 
      meetingScheduledTime, 
      meetingCompleted, 
      meetingCompletedAt, 
      rating, 
      feedback 
    } = body;

    if (!id) {
      return NextResponse.json({ ok: false, message: 'Missing request id' }, { status: 400 });
    }

    if (isSupabaseConfigured && supabase) {
      // 1. Pack all metadata safely into feedback JSONB column (always guaranteed to exist)
      const mergedFeedback = {
        ...(feedback || {}),
        ...(meetingCompleted !== undefined ? { meetingCompleted } : {}),
        ...(meetingCompletedAt ? { meetingCompletedAt } : {}),
        ...(meetingDate ? { meetingDate } : {}),
        ...(meetingTime ? { meetingTime } : {}),
        ...(rating ? { rating } : {})
      };

      const updatePayload: any = {
        feedback: mergedFeedback,
        updated_at: new Date().toISOString()
      };
      if (status) updatePayload.status = status;
      if (statusMessage) updatePayload.status_message = statusMessage;
      if (mentorResponseNote) updatePayload.mentor_response_note = mentorResponseNote;

      await supabase
        .from('mentorship_requests')
        .update(updatePayload)
        .eq('id', id);

      // 2. Also try updating specific columns if they exist in schema
      try {
        const specificCols: any = {};
        if (meetingLink) specificCols.meeting_link = meetingLink;
        if (meetingDate) specificCols.meeting_date = meetingDate;
        if (meetingTime) specificCols.meeting_time = meetingTime;
        if (meetingScheduledTime) specificCols.meeting_scheduled_time = meetingScheduledTime;
        if (meetingCompleted !== undefined) specificCols.meeting_completed = meetingCompleted;
        if (meetingCompletedAt) specificCols.meeting_completed_at = meetingCompletedAt;
        if (rating) specificCols.rating = rating;

        if (Object.keys(specificCols).length > 0) {
          await supabase.from('mentorship_requests').update(specificCols).eq('id', id);
        }
      } catch {
        // Safe ignore if individual column names not yet migrated
      }

      // 3. If review rating provided, record into mentor_reviews and update mentors table
      const submittedRating = rating || feedback?.rating;
      if (submittedRating) {
        try {
          const ratingVal = Math.max(1, Math.min(5, Math.round(Number(submittedRating))));
          const { data: currentReq } = await supabase
            .from('mentorship_requests')
            .select('*, student:profiles!student_id(full_name), mentor:profiles!mentor_id(full_name)')
            .eq('id', id)
            .maybeSingle();

          if (currentReq && currentReq.mentor_id) {
            const studentName = currentReq.student?.full_name || feedback?.studentName || 'Student Learner';
            const meetDate = meetingDate || feedback?.meetingDate || currentReq.meeting_date || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
            const meetTime = meetingTime || feedback?.meetingTime || currentReq.meeting_time || 'Scheduled Session';
            
            // Upsert into mentor_reviews
            const { data: existingRev } = await supabase
              .from('mentor_reviews')
              .select('id')
              .eq('request_id', id)
              .maybeSingle();

            if (existingRev) {
              await supabase
                .from('mentor_reviews')
                .update({
                  rating: ratingVal,
                  meeting_date: meetDate,
                  meeting_time: meetTime,
                  topic: currentReq.topic || '',
                  comment: feedback?.comment || null,
                  tags: feedback?.tags || []
                })
                .eq('id', existingRev.id);
            } else {
              await supabase
                .from('mentor_reviews')
                .insert({
                  request_id: id,
                  mentor_id: currentReq.mentor_id,
                  student_id: currentReq.student_id,
                  student_name: studentName,
                  rating: ratingVal,
                  meeting_date: meetDate,
                  meeting_time: meetTime,
                  topic: currentReq.topic || '',
                  comment: feedback?.comment || null,
                  tags: feedback?.tags || []
                });
            }

            // Recalculate average rating & review count for this mentor
            const { data: allReviews } = await supabase
              .from('mentor_reviews')
              .select('rating')
              .eq('mentor_id', currentReq.mentor_id);

            if (allReviews && allReviews.length > 0) {
              const totalStars = allReviews.reduce((sum: number, rev: any) => sum + (Number(rev.rating) || 5), 0);
              const avgScore = Number((totalStars / allReviews.length).toFixed(1));
              await supabase
                .from('mentors')
                .update({
                  rating: avgScore,
                  review_count: allReviews.length,
                  updated_at: new Date().toISOString()
                })
                .eq('id', currentReq.mentor_id);
            }
          }
        } catch (revErr) {
          console.warn('API PATCH mentor review recording note:', revErr);
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err?.message || 'Update failed' }, { status: 500 });
  }
}

