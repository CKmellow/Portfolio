/* global process */
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { name, email, message } = req.body;
  const gmailUser = process.env.GMAIL_USER || process.env['GMAIL_USER'];
  const gmailPass = process.env.GMAIL_PASS || process.env['GMAIL_PASS'];

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  if (!gmailUser || !gmailPass) {
    return res.status(500).json({
      error: 'Email service is not configured.',
      details: 'Missing GMAIL_USER or GMAIL_PASS environment variable.',
    });
  }

  // Configure transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailUser,
      pass: gmailPass,
    },
  });

  try {
    const info = await transporter.sendMail({
      // Use authenticated sender to avoid SPF/DMARC delivery issues.
      from: `Portfolio Contact <${gmailUser}>`,
      replyTo: email,
      to: gmailUser,
      subject: `Portfolio Project: 💼 New Message from Your Portfolio`,
      text: `Message from Portfolio Project\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: `<h2>Message from Portfolio Project</h2>
             <p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong><br/>${message}</p>`,
    });

    if (!info.accepted || info.accepted.length === 0) {
      return res.status(502).json({
        error: 'Mail was not accepted by SMTP server.',
        rejected: info.rejected || [],
        response: info.response,
      });
    }

    res.status(200).json({ success: true, messageId: info.messageId, response: info.response });
  } catch (err) {
    console.error('Nodemailer error:', err);
    res.status(500).json({ error: 'Failed to send email.', details: err.message || err });
  }
}
