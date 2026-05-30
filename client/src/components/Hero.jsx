import { useLanguage } from '../context/LanguageContext';

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="hero" id="top">
      <p className="hero__eyebrow">{t.hero.eyebrow}</p>
      <h1>{t.profile.name}</h1>      <p className="hero__role">{t.profile.role}</p>
      <p className="hero__tagline">{t.profile.tagline}</p>
      <div className="hero__actions">
        <a className="btn btn--primary" href="#contact">
          {t.hero.ctaContact}
        </a>
        <a className="btn btn--ghost" href="#projects">
          {t.hero.ctaProjects}
        </a>
      </div>
    </section>
  );
}
