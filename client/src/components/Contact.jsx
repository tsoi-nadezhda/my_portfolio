import { contacts } from '../data/shared';
import { useLanguage } from '../context/LanguageContext';
import ContactForm from './ContactForm';

export default function Contact() {
  const { t } = useLanguage();
  const c = t.contact;

  return (
    <section className="section section--alt" id="contact">
      <div className="container">
        <h2 className="section__title">{c.title}</h2>

        <div className="grid grid--contact">
          <div className="contact-info">
            <p className="section__lead">{c.lead}</p>
            <ul className="contact-links">
              <li>
                <span>{c.email}</span>
                <a href={`mailto:${contacts.email}`}>{contacts.email}</a>
              </li>
              <li>
                <span>{c.phone}</span>
                <a href={`tel:${contacts.phone}`}>{c.phoneDisplay}</a>
              </li>
              <li>
                <span>{c.telegram}</span>
                <a href={contacts.telegram} target="_blank" rel="noreferrer">
                  {c.telegramLink}
                </a>
              </li>
              <li>
                <span>{c.github}</span>
                <a href={contacts.github} target="_blank" rel="noreferrer">
                  {c.githubLink}
                </a>
              </li>
            </ul>
          </div>

          <ContactForm />
        </div>
      </div>
    </section>
  );
}
