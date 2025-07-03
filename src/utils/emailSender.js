import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
  host: 'smtp.ukr.net',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    const info = await transport.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      html,
    });

    console.log('✅ Email sent via Ukr.net SMTP:');
    console.log('→ to:', to);
    console.log('→ messageId:', info.messageId);

    return info;
  } catch (error) {
    console.error('❌ SMTP email error:', error);
    throw new Error('Failed to send email via Ukr.net SMTP');
  }
};

export default sendEmail;
