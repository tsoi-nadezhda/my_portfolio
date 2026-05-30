import { buildSystemPrompt } from './portfolioKnowledge.js';

const MAX_MESSAGE_LEN = 600;
const MAX_HISTORY = 8;

export function validateChatBody(body) {
  const message = typeof body?.message === 'string' ? body.message.trim() : '';
  const lang = body?.lang === 'ru' ? 'ru' : 'en';
  const history = Array.isArray(body?.history) ? body.history : [];

  if (!message || message.length < 2) {
    return { valid: false, error: 'Message is too short' };
  }
  if (message.length > MAX_MESSAGE_LEN) {
    return { valid: false, error: `Message must be under ${MAX_MESSAGE_LEN} characters` };
  }

  const sanitizedHistory = history
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-MAX_HISTORY)
    .map((m) => ({
      role: m.role,
      content: m.content.trim().slice(0, MAX_MESSAGE_LEN),
    }));

  return {
    valid: true,
    data: { message, lang, history: sanitizedHistory },
  };
}

export async function askPortfolioAssistant({ message, lang, history }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    const err = new Error('AI_NOT_CONFIGURED');
    err.code = 'AI_NOT_CONFIGURED';
    throw err;
  }

  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  const messages = [
    { role: 'system', content: buildSystemPrompt(lang) },
    ...history,
    { role: 'user', content: message },
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.4,
      max_tokens: 500,
    }),
  });

  const payload = await response.json();

  if (!response.ok) {
    const err = new Error(payload?.error?.message || 'OpenAI request failed');
    err.code = 'AI_PROVIDER_ERROR';
    throw err;
  }

  const reply = payload?.choices?.[0]?.message?.content?.trim();
  if (!reply) {
    const err = new Error('Empty AI response');
    err.code = 'AI_EMPTY';
    throw err;
  }

  return reply;
}
