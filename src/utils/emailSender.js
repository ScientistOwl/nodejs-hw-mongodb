import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, html) => {
  try {
    const data = await resend.emails.send({
      from: process.env.RESEND_FROM,
      to,
      subject,
      html,
    });
    console.log('✅ Resend email sent:', data);
  } catch (error) {
    console.error('❌ Resend error:', error);
    throw new Error('Failed to send email via Resend');
  }
};

export default sendEmail;
