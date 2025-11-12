import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { name, email, message } = req.body;

  // Configure transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER || process.env['GMAIL_USER'],
      pass: process.env.GMAIL_PASS || process.env['GMAIL_PASS'],
    },
  });

  try {
    await transporter.sendMail({
      from: email,
      to: process.env.GMAIL_USER || process.env['GMAIL_USER'],
      subject: `Portfolio Project: New Message from ${name}`,
      text: `Message from Portfolio Project\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: `<h2>Message from Portfolio Project</h2>
             <p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong><br/>${message}</p>`,
    });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Nodemailer error:', err);
    res.status(500).json({ error: 'Failed to send email.', details: err.message || err });
  }
}
