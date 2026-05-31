import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
const apiUrl =process.env.VITE_API_URL

export default function AiAssistant() {
  const { t, lang } = useLanguage();
  const ai = t.ai;
  const { apiMessages } = t;

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([]);
  const listRef = useRef(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: 'assistant', content: ai.welcome }]);
    }
  }, [open, ai.welcome, messages.length]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const translateApi = (text) => apiMessages[text] ?? text;

  const sendMessage = async (text) => {
    const message = text.trim();
    if (!message || loading) return;

    setError('');
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: message }]);
    setLoading(true);

    const history = messages
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .slice(-8);

    try {
      const res = await fetch(apiUrl('/api/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, lang, history }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(translateApi(data.message) || ai.unavailable);
        return;
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setError(ai.unavailable);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="ai-assistant">
      {open && (
        <div className="ai-panel" role="dialog" aria-label={ai.title}>
          <header className="ai-panel__header">
            <div>
              <h3>{ai.title}</h3>
              <p>{ai.subtitle}</p>
            </div>
            <button type="button" className="ai-panel__close" onClick={() => setOpen(false)} aria-label={ai.close}>
              ×
            </button>
          </header>

          <div className="ai-panel__suggestions">
            {ai.suggestions.map((s) => (
              <button key={s} type="button" className="ai-chip" onClick={() => sendMessage(s)} disabled={loading}>
                {s}
              </button>
            ))}
          </div>

          <div className="ai-panel__messages" ref={listRef}>
            {messages.map((msg, i) => (
              <div key={`${msg.role}-${i}`} className={`ai-msg ai-msg--${msg.role}`}>
                <span className="ai-msg__label">{msg.role === 'user' ? ai.you : ai.assistant}</span>
                <p>{msg.content}</p>
              </div>
            ))}
            {loading && (
              <div className="ai-msg ai-msg--assistant">
                <span className="ai-msg__label">{ai.assistant}</span>
                <p className="ai-msg__typing">{ai.thinking}</p>
              </div>
            )}
          </div>

          {error && <p className="ai-panel__error">{error}</p>}

          <form className="ai-panel__form" onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={ai.placeholder}
              disabled={loading}
              maxLength={600}
            />
            <button type="submit" className="btn btn--primary" disabled={loading || !input.trim()}>
              {ai.send}
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        className="ai-fab"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? ai.close : ai.open}
      >
        {open ? '×' : 'AI'}
      </button>
    </div>
  );
}
