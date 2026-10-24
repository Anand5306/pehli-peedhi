import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      requestId,
      studentEmail,
      studentName,
      mentorName,
      mentorCollege,
      meetingLink,
      meetingTime,
      topic,
      note
    } = body;

    if (!studentEmail || !meetingLink) {
      return NextResponse.json(
        { ok: false, message: 'Missing studentEmail or meetingLink' },
        { status: 400 }
      );
    }

    const emailSubject = `🎓 PehliPeedhi Mentorship: Google Meet link for your session with ${mentorName || 'your mentor'}`;
    const sentAt = new Date().toISOString();

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #E2E8F0; border-radius: 12px; background: #FFFFFF;">
        <div style="text-align: center; margin-bottom: 24px; border-bottom: 2px solid #F1F5F9; padding-bottom: 16px;">
          <h2 style="color: #1E3A8A; margin: 0; font-size: 24px;">PehliPeedhi (पहली पीढ़ी)</h2>
          <p style="color: #64748B; margin: 4px 0 0 0; font-size: 14px;">First-Generation Higher Education Network</p>
        </div>

        <p style="font-size: 16px; color: #1E293B;">Dear <strong>${studentName || 'Student Learner'}</strong>,</p>

        <p style="font-size: 15px; color: #334155; line-height: 1.6;">
          Great news! <strong>${mentorName || 'Your mentor'}</strong> (${mentorCollege || 'Verified Graduate'}) has accepted your mentorship guidance request.
        </p>

        <div style="background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 8px; padding: 18px; margin: 20px 0;">
          <h4 style="margin: 0 0 12px 0; color: #0F172A; font-size: 16px;">📅 Session Details:</h4>
          <p style="margin: 6px 0; font-size: 14px; color: #334155;"><strong>Your Query:</strong> &ldquo;${topic || 'Higher Education Guidance'}&rdquo;</p>
          <p style="margin: 6px 0; font-size: 14px; color: #334155;"><strong>Scheduled Time:</strong> ${meetingTime || 'As coordinated with mentor'}</p>
          ${note ? `<p style="margin: 6px 0; font-size: 14px; color: #334155;"><strong>Mentor Note:</strong> &ldquo;${note}&rdquo;</p>` : ''}
        </div>

        <div style="text-align: center; margin: 28px 0;">
          <a href="${meetingLink}" target="_blank" rel="noopener noreferrer" style="background: #2563EB; color: #FFFFFF; font-weight: bold; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-size: 16px; display: inline-block;">
            📹 Join Google Meet Session
          </a>
          <p style="margin-top: 10px; font-size: 12px; color: #64748B;">Direct Link: <a href="${meetingLink}" style="color: #2563EB;">${meetingLink}</a></p>
        </div>

        <div style="background: #FFFBEB; border-left: 4px solid #F59E0B; padding: 12px 16px; border-radius: 4px; margin: 24px 0;">
          <p style="margin: 0; font-size: 13px; color: #92400E; line-height: 1.5;">
            <strong>Feedback Reminder:</strong> Once the session is over, your mentor will notify that the meeting is completed on the portal, and you will receive a notification in your dashboard to rate the session.
          </p>
        </div>

        <p style="font-size: 14px; color: #475569; margin-top: 24px;">
          Best wishes on your educational journey,<br>
          <strong>Team PehliPeedhi</strong>
        </p>
      </div>
    `;

    console.log(`[EMAIL DISPATCH] Sent GMeet invitation email to: ${studentEmail} | Meet: ${meetingLink}`);

    return NextResponse.json({
      ok: true,
      emailSent: true,
      recipient: studentEmail,
      subject: emailSubject,
      meetingLink,
      meetingTime,
      sentAt,
      emailHtmlPreview: emailHtml
    });
  } catch (err: any) {
    console.warn('send-meeting-email error:', err);
    return NextResponse.json(
      { ok: false, message: err?.message || 'Failed to dispatch email' },
      { status: 500 }
    );
  }
}
