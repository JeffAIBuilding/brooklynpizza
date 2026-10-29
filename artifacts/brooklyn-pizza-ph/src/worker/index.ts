import { franchiseInquirySchema } from '../lib/franchise-inquiry';

const OWNER_EMAIL = 'jefflago@hotmail.com';
const SENDER_EMAIL = 'franchise@brooklynpizza.ph';
const SUCCESS_MESSAGE =
  'Thank you for your interest, We will review and contact you shortly.';
const MAX_BODY_BYTES = 8_192;

interface EmailAddress {
  email: string;
  name?: string;
}

interface EmailPayload {
  to: string;
  from: string | EmailAddress;
  replyTo?: string | EmailAddress;
  subject: string;
  text: string;
  html?: string;
}

interface EmailBinding {
  send(message: EmailPayload): Promise<{ messageId: string }>;
}

interface RateLimitBinding {
  limit(input: { key: string }): Promise<{ success: boolean }>;
}

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  EMAIL: EmailBinding;
  FRANCHISE_RATE_LIMITER: RateLimitBinding;
}

function jsonResponse(body: object, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return entities[character];
  });
}

async function submitFranchiseInquiry(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Use POST to submit an inquiry.' }, 405);
  }

  if (!request.headers.get('Content-Type')?.toLowerCase().includes('application/json')) {
    return jsonResponse({ error: 'Send the inquiry as JSON.' }, 415);
  }

  const declaredLength = Number(request.headers.get('Content-Length') ?? 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return jsonResponse({ error: 'The inquiry is too large.' }, 413);
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return jsonResponse({ error: 'The inquiry could not be read.' }, 400);
  }

  if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
    return jsonResponse({ error: 'The inquiry is too large.' }, 413);
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return jsonResponse({ error: 'The inquiry is not valid JSON.' }, 400);
  }

  const parsed = franchiseInquirySchema.safeParse(body);
  if (!parsed.success) {
    return jsonResponse({ error: 'Please check your details and try again.' }, 400);
  }

  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  const { success: withinLimit } = await env.FRANCHISE_RATE_LIMITER.limit({ key: ip });
  if (!withinLimit) {
    return jsonResponse({ error: 'Please wait before submitting another inquiry.' }, 429);
  }

  // Honeypot: silently discard bot submissions without sending email.
  if (parsed.data.website.trim()) {
    return jsonResponse({ message: SUCCESS_MESSAGE });
  }

  const { firstName, lastName, email, capital, location } = parsed.data;
  const fullName = `${firstName} ${lastName}`;
  const text = [
    'New Brooklyn Pizza PH franchise inquiry',
    '',
    `Name: ${fullName}`,
    `Email: ${email}`,
    `Available capital: ${capital}`,
    `Desired shop location: ${location}`,
  ].join('\n');
  const html = `
    <h2>New Brooklyn Pizza PH franchise inquiry</h2>
    <p><strong>Name:</strong> ${escapeHtml(fullName)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Available capital:</strong> ${escapeHtml(capital)}</p>
    <p><strong>Desired shop location:</strong> ${escapeHtml(location)}</p>
  `;

  try {
    await env.EMAIL.send({
      to: OWNER_EMAIL,
      from: { email: SENDER_EMAIL, name: 'Brooklyn Pizza PH' },
      replyTo: email,
      subject: 'Brooklyn Pizza PH — Franchise inquiry',
      text,
      html,
    });
    return jsonResponse({ message: SUCCESS_MESSAGE });
  } catch {
    return jsonResponse(
      { error: 'We could not send your inquiry right now. Please try again shortly.' },
      503,
    );
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/api/franchise-inquiries') {
      return submitFranchiseInquiry(request, env);
    }
    if (url.pathname.startsWith('/api/')) {
      return jsonResponse({ error: 'API endpoint not found.' }, 404);
    }

    return env.ASSETS.fetch(request);
  },
};
