# Portfolio (React + Node)

A single-page portfolio with a contact form. Emails are sent to the site owner and a copy is sent to the user.

## Structure

- `client/` — React (Vite)
- `server/` — Express API + Nodemailer

## Getting started

### 1. Backend (email)

```bash
cd server
copy .env.example .env
```

Fill in `.env` (SMTP and `OWNER_EMAIL`). For Gmail: enable 2FA and create an [app password](https://myaccount.google.com/apppasswords).

```bash
npm run dev
```

Server: http://localhost:3001

### 2. Frontend

In a second terminal:

```bash
cd client
npm run dev
```

Site: http://localhost:5173

## Contact form

Fields: name, phone, email, comment.

- `POST /api/contact` — validation, email to owner, copy to user
- Success and error states are shown in the UI

## AI assistant

Floating **AI** button — answers questions about skills, experience, and hiring (for recruiters).

1. Get an API key: https://platform.openai.com/api-keys
2. Add to `server/.env`:

```
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
```

3. Restart the server. Check: `GET http://localhost:3001/api/health` → `{ "ok": true, "ai": true }`

Endpoint: `POST /api/chat` with `{ "message": "...", "lang": "en"|"ru", "history": [] }`

## Content

Edit `client/src/data/portfolio.js` — name, stack, projects, contacts.

## Build

```bash
cd client && npm run build
```

For production, deploy `client/dist` and the API server; set `CLIENT_ORIGIN` in the server `.env`.
