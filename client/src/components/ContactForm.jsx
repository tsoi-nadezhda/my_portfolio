import { useState } from 'react';
import { apiUrl } from '../config/api';
import { useLanguage } from '../context/LanguageContext';

const initialForm = { name: '', phone: '', email: '', comment: '' };

export default function ContactForm() {
  const { t, lang } = useLanguage();
  const { form: f, apiMessages } = t;

  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const translateApi = (text) => apiMessages[text] ?? text;

  const translateFieldErrors = (errors) => {
    if (!errors) return {};
    return Object.fromEntries(
      Object.entries(errors).map(([key, value]) => [key, translateApi(value)]),
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');
    setFieldErrors({});

    const clientErrors = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      clientErrors.name = translateApi('Please enter your name (at least 2 characters)');
    }
    if (!form.phone.trim() || form.phone.trim().length < 6) {
      clientErrors.phone = translateApi('Please enter a valid phone number');
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      clientErrors.email = translateApi('Please enter a valid email address');
    }
    if (!form.comment.trim() || form.comment.trim().length < 10) {
      clientErrors.comment = translateApi('Comment must be at least 10 characters');
    }
    if (Object.keys(clientErrors).length > 0) {
      setStatus('error');
      setMessage(translateApi('Please check the form fields'));
      setFieldErrors(clientErrors);
      return;
    }

    try {
      const res = await fetch(apiUrl('/api/contact'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, lang }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setMessage(translateApi(data.message) || f.failed);
        if (data.errors) setFieldErrors(translateFieldErrors(data.errors));
        return;
      }

      setStatus('success');
      setMessage(translateApi(data.message));
      setForm(initialForm);
    } catch {
      setStatus('error');
      setMessage(f.serverUnavailable);
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        <label htmlFor="name">{f.name}</label>
        <input
          id="name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          placeholder={f.namePlaceholder}
          disabled={status === 'loading'}
          aria-invalid={!!fieldErrors.name}
          minLength={2}
          required
        />
        {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
      </div>

      <div className="form-row">
        <label htmlFor="phone">{f.phone}</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          placeholder={f.phonePlaceholder}
          disabled={status === 'loading'}
          aria-invalid={!!fieldErrors.phone}
          minLength={6}
          required
        />
        {fieldErrors.phone && <span className="field-error">{fieldErrors.phone}</span>}
      </div>

      <div className="form-row">
        <label htmlFor="email">{f.email}</label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder={f.emailPlaceholder}
          disabled={status === 'loading'}
          aria-invalid={!!fieldErrors.email}
          required
        />
        {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
      </div>

      <div className="form-row">
        <label htmlFor="comment">{f.comment}</label>
        <textarea
          id="comment"
          name="comment"
          rows={5}
          value={form.comment}
          onChange={handleChange}
          placeholder={f.commentPlaceholder}
          disabled={status === 'loading'}
          aria-invalid={!!fieldErrors.comment}
          minLength={10}
          required
        />
        {fieldErrors.comment && <span className="field-error">{fieldErrors.comment}</span>}
      </div>

      <button type="submit" className="btn btn--primary btn--block" disabled={status === 'loading'}>
        {status === 'loading' ? f.sending : f.send}
      </button>

      {status === 'success' && (
        <p className="form-alert form-alert--success" role="status">
          {message}
        </p>
      )}
      {status === 'error' && (
        <p className="form-alert form-alert--error" role="alert">
          {message}
        </p>
      )}
    </form>
  );
}
