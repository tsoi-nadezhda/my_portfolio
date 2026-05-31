import dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import { BrevoClient } from '@getbrevo/brevo';

import { askPortfolioAssistant, validateChatBody } from './ai/chat.js';
import { corsOptions } from './cors.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

const requiredEnv = ['BREVO_API_KEY', 'OWNER_EMAIL', 'MAIL_FROM'];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length > 0) {
  console.warn(
    `Warning: missing env variables: ${missingEnv.join(', ')}. Contact form will not send emails until configured.`,
  );
}

app.use(cors(corsOptions));
app.use(express.json({ limit: '32kb' }));

function createBrevoClient() {
  return new BrevoClient({
    apiKey: process.env.BREVO_API_KEY,
  });
}

function validateContact(body) {
  const errors = {};
  const { name, phone, email, comment } = body ?? {};

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.name = 'Please enter your name (at least 2 characters)';
  }

  if (!phone || typeof phone !== 'string' || phone.trim().length < 6) {
    errors.phone = 'Please enter a valid phone number';
  }

  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = 'Please enter a valid email address';
  }

  if (!comment || typeof comment !== 'string' || comment.trim().length < 10) {
    errors.comment = 'Comment must be at least 10 characters';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    data: {
      name: name?.trim(),
      phone: phone?.trim(),
      email: email?.trim(),
      comment: comment?.trim(),
    },
  };
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, ai: Boolean(process.env.OPENAI_API_KEY) });
});

app.get('/api/contact', (_req, res) => {
  res.json({
    ok: true,
    message: 'Contact API is running. Send POST with JSON: name, phone, email, comment.',
  });
});

app.post('/api/chat', async (req, res) => {
  const validation = validateChatBody(req.body);

  if (!validation.valid) {
    return res.status(400).json({ success: false, message: validation.error });
  }

  try {
    const reply = await askPortfolioAssistant(validation.data);
    return res.json({ success: true, reply });
  } catch (err) {
    if (err.code === 'AI_NOT_CONFIGURED') {
      return res.status(503).json({
        success: false,
        message: 'AI assistant is not configured on the server.',
      });
    }

    console.error('AI chat error:', err);

    return res.status(500).json({
      success: false,
      message: 'AI assistant is temporarily unavailable. Please try again or use the contact form.',
    });
  }
});

app.post('/api/contact', async (req, res) => {
  const { valid, errors, data } = validateContact(req.body);

  if (!valid) {
    return res.status(400).json({
      success: false,
      message: 'Please check the form fields',
      errors,
    });
  }

  if (missingEnv.length > 0) {
    return res.status(503).json({
      success: false,
      message: 'Email service is not configured. Please contact the site owner directly.',
    });
  }

  const ownerEmail = process.env.OWNER_EMAIL;
  const siteName = process.env.SITE_NAME || 'Portfolio';
  const from = process.env.MAIL_FROM;

  const ownerHtml = `
    <h2>New inquiry from the website</h2>
    <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Comment:</strong></p>
    <p>${escapeHtml(data.comment).replace(/\n/g, '<br>')}</p>
  `;

  const userHtml = `
    <h2>Thank you for reaching out!</h2>
    <p>We received your message on «${escapeHtml(siteName)}».</p>
    <p><strong>Your details:</strong></p>
    <ul>
      <li>Name: ${escapeHtml(data.name)}</li>
      <li>Phone: ${escapeHtml(data.phone)}</li>
      <li>Email: ${escapeHtml(data.email)}</li>
    </ul>
    <p><strong>Your comment:</strong></p>
    <p>${escapeHtml(data.comment).replace(/\n/g, '<br>')}</p>
    <p>We will get back to you soon.</p>
  `;

  try {
    const brevo = createBrevoClient();

    await brevo.transactionalEmails.sendTransacEmail({
      sender: {
        email: from,
        name: siteName,
      },
      to: [
        {
          email: ownerEmail,
        },
      ],
      replyTo: {
        email: data.email,
        name: data.name,
      },
      subject: `[${siteName}] New inquiry from ${data.name}`,
      htmlContent: ownerHtml,
      textContent: stripHtml(ownerHtml),
    });

    await brevo.transactionalEmails.sendTransacEmail({
      sender: {
        email: from,
        name: siteName,
      },
      to: [
        {
          email: data.email,
        },
      ],
      subject: `[${siteName}] Copy of your message`,
      htmlContent: userHtml,
      textContent: stripHtml(userHtml),
    });

    return res.json({
      success: true,
      message: 'Message sent. A copy will be delivered to your email.',
    });
  } catch (err) {
    console.error('Contact form error:', err);

    return res.status(500).json({
      success: false,
      message: 'Failed to send the message. Please try again later or contact us directly.',
    });
  }
});

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, '').replace(/\s+\n/g, '\n').trim();
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});