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

          const rawFeedback = (r.feedback && typeof r.feedback === 'object') ? r.feedback : null;

          const isCompleted = r.status === 'Completed' || !!matchingReview || !!rawFeedback?.rating;
          const isMeetingDone = isCompleted || !!rawFeedback?.meetingCompleted;

          const feedbackObj = rawFeedback || (matchingReview ? {
            rating: matchingReview.rating,
            meetingDate: new Date(matchingReview.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            meetingTime: 'Scheduled Session',
            submittedAt: new Date(matchingReview.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            tags: matchingReview.tags || [],
            comment: matchingReview.comment || '',
            meetingCompleted: true
          } : null);

          const meetDate = feedbackObj?.meetingDate || (matchingReview ? new Date(matchingReview.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : (r.created_at ? new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''));
          const meetTime = feedbackObj?.meetingTime || feedbackObj?.meetingScheduledTime || (feedbackObj?.meetingDate ? 'Scheduled Session' : '');
          const meetRating = feedbackObj?.rating || matchingReview?.rating;
          const meetLink = feedbackObj?.meetingLink || '';

          // Determine final resilient status:
          // Never allow a completed or concluded meeting to revert to 'Pending'!
          let derivedStatus = r.status;
          if (isCompleted) {
            derivedStatus = 'Completed';
          } else if (isMeetingDone || meetLink) {
            derivedStatus = 'Accepted';
          }

          let derivedStatusMsg = r.status_message;
          if (derivedStatus === 'Completed') {
            derivedStatusMsg = `Session completed & rated ${meetRating || 5} stars.`;
          } else if (isMeetingDone) {
            derivedStatusMsg = 'Google Meet concluded. Awaiting student feedback and star rating.';
          } else if (derivedStatus === 'Accepted' && meetTime) {
            derivedStatusMsg = derivedStatusMsg || `Session scheduled on Google Meet for ${meetTime}. Email invite dispatched.`;
          }

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
            status: derivedStatus,
            statusMessage: derivedStatusMsg,
            mentorResponseNote: r.mentor_response_note,
            meetingLink: meetLink,
            meetingDate: meetDate,
            meetingTime: meetTime,
            meetingScheduledTime: feedbackObj?.meetingScheduledTime || meetTime,
            meetingEmailSent: !!feedbackObj?.meetingEmailSent || !!meetLink,
            meetingCompleted: isMeetingDone,
            meetingCompletedAt: feedbackObj?.meetingCompletedAt || (isCompleted && matchingReview ? new Date(matchingReview.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : undefined),
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
      // 1. Fetch current request from Supabase to preserve existing fields
      const { data: currentReq } = await supabase
        .from('mentorship_requests')
        .select('*, student:profiles!student_id(full_name), mentor:profiles!mentor_id(full_name)')
        .eq('id', id)
        .maybeSingle();

      const existingFeedback = (currentReq?.feedback && typeof currentReq.feedback === 'object') 
        ? currentReq.feedback 
        : {};

      const cleanMeetingLink = meetingLink || feedback?.meetingLink || existingFeedback.meetingLink;
      const cleanMeetingDate = meetingDate || feedback?.meetingDate || existingFeedback.meetingDate;
      const cleanMeetingTime = meetingTime || feedback?.meetingTime || existingFeedback.meetingTime;
      const cleanMeetingScheduledTime = meetingScheduledTime || feedback?.meetingScheduledTime || existingFeedback.meetingScheduledTime || cleanMeetingTime;
      
      const isMeetingDone = meetingCompleted ?? feedback?.meetingCompleted ?? existingFeedback.meetingCompleted ?? (status === 'Completed');
      const cleanCompletedAt = meetingCompletedAt || feedback?.meetingCompletedAt || existingFeedback.meetingCompletedAt || (isMeetingDone ? new Date().toISOString() : undefined);
      
      const submittedRating = rating || feedback?.rating || existingFeedback.rating;
      const ratingVal = submittedRating ? Math.max(1, Math.min(5, Math.round(Number(submittedRating)))) : undefined;

      const mergedFeedback: any = {
        ...existingFeedback,
        ...(feedback || {}),
        ...(cleanMeetingLink ? { meetingLink: cleanMeetingLink } : {}),
        ...(cleanMeetingDate ? { meetingDate: cleanMeetingDate } : {}),
        ...(cleanMeetingTime ? { meetingTime: cleanMeetingTime } : {}),
        ...(cleanMeetingScheduledTime ? { meetingScheduledTime: cleanMeetingScheduledTime } : {}),
        ...(isMeetingDone !== undefined ? { meetingCompleted: !!isMeetingDone } : {}),
        ...(cleanCompletedAt ? { meetingCompletedAt: cleanCompletedAt } : {}),
        ...(ratingVal !== undefined ? { rating: ratingVal } : {})
      };

      if ((ratingVal || status === 'Completed') && !mergedFeedback.submittedAt) {
        mergedFeedback.submittedAt = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      }

      // Determine robust status
      let finalStatus = status || currentReq?.status || 'Pending';
      if (ratingVal !== undefined || status === 'Completed') {
        finalStatus = 'Completed';
      } else if (isMeetingDone || cleanMeetingLink) {
        finalStatus = 'Accepted';
      }

      let finalStatusMessage = statusMessage || currentReq?.status_message;
      if (finalStatus === 'Completed') {
        finalStatusMessage = `Session completed & rated ${ratingVal || 5} stars.`;
      } else if (isMeetingDone) {
        finalStatusMessage = 'Google Meet concluded. Awaiting student feedback and star rating.';
      } else if (finalStatus === 'Accepted' && cleanMeetingTime) {
        finalStatusMessage = `Session scheduled on Google Meet for ${cleanMeetingTime}. Email invite dispatched.`;
      }

      // Update mentorship_requests table (strictly valid schema columns: status, status_message, mentor_response_note, feedback, updated_at)
      const updatePayload: any = {
        status: finalStatus,
        status_message: finalStatusMessage,
        feedback: mergedFeedback,
        updated_at: new Date().toISOString()
      };
      if (mentorResponseNote) {
        updatePayload.mentor_response_note = mentorResponseNote;
      }

      const { error: updateError } = await supabase
        .from('mentorship_requests')
        .update(updatePayload)
        .eq('id', id);

      if (updateError) {
        console.warn('API PATCH mentorship_requests update error:', updateError);
      }

      // Upsert into mentor_reviews (strictly valid columns: request_id, mentor_id, student_id, student_name, rating, comment, tags)
      if (ratingVal && currentReq?.mentor_id) {
        try {
          const studentName = currentReq.student?.full_name || feedback?.studentName || 'Student Learner';
          
          const { data: existingRev } = await supabase
            .from('mentor_reviews')
            .select('id')
            .eq('request_id', id)
            .maybeSingle();

          const reviewPayload: any = {
            request_id: id,
            mentor_id: currentReq.mentor_id,
            student_id: currentReq.student_id,
            student_name: studentName,
            rating: ratingVal,
            comment: feedback?.comment || mergedFeedback.comment || null,
            tags: feedback?.tags || mergedFeedback.tags || []
          };

          if (existingRev) {
            await supabase
              .from('mentor_reviews')
              .update(reviewPayload)
              .eq('id', existingRev.id);
          } else {
            await supabase
              .from('mentor_reviews')
              .insert(reviewPayload);
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

