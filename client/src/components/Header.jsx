import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Header() {
  const [open, setOpen] = useState(false);
  const { t, toggleLang, lang } = useLanguage();
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };

  return (
    <header className="header">
      <a href="#top" className="logo" onClick={(e) => { e.preventDefault(); scrollTo('top'); }}>
        {t.header.logo}
      </a>

      <div className="header__actions">
        <button
          type="button"
          className="lang-toggle"
          onClick={toggleLang}
          aria-label={t.lang.aria}
        >
          {t.lang.switchTo}
        </button>

        <button
          type="button"
          className="menu-toggle"
          aria-label={t.header.menu}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav ${open ? 'nav--open' : ''}`} lang={lang}>
          <ul>
            {t.nav.map((item) => (
              <li key={item.id}>
                <button type="button" onClick={() => scrollTo(item.id)}>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
