import { NextResponse } from 'next/server';
import { INITIAL_REQUESTS } from '../../../data/mockData';
import { MentorshipRequest } from '../../../types';

export async function GET() {
  return NextResponse.json({
    ok: true,
    requests: INITIAL_REQUESTS
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newRequest: MentorshipRequest = {
      id: `req-${Date.now()}`,
      studentId: body.studentId || 'student-1',
      studentName: body.studentName || 'Student Learner',
      studentEmail: body.studentEmail || 'student@pehlipedhi.demo',
      mentorId: body.mentorId,
      mentorName: body.mentorName,
      topic: body.topic,
      studentLanguage: body.studentLanguage || 'Hindi',
      preferredContact: body.preferredContact || 'Written Feedback',
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'Pending',
      statusMessage: 'Mentor has received your query and will respond soon.'
    };

    return NextResponse.json({ ok: true, request: newRequest }, { status: 201 });
  } catch {
    return NextResponse.json({ ok: false, message: 'Invalid request data' }, { status: 400 });
  }
}
