import { stack } from '../data/shared';
import { useLanguage } from '../context/LanguageContext';

export default function About() {
  const { t } = useLanguage();
  const { profile, about } = t;

  return (
    <section className="section" id="about">
      <div className="container">
        <h2 className="section__title">{about.title}</h2>
        <p className="section__lead">{profile.about}</p>

        <div className="grid grid--about">
          <article className="card">
            <h3>{about.stack}</h3>
            <ul className="tags">
              {stack.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="card">
            <h3>{about.experience}</h3>
            <ul className="timeline">
              {profile.experience.map((item) => (
                <li key={item.period + item.title}>
                  <span className="timeline__period">{item.period}</span>
                  <strong>{item.title}</strong>
                  <p>{item.detail}</p>
                </li>
              ))}
            </ul>
          </article>

          <article className="card">
            <h3>{about.education}</h3>
            <ul className="timeline">
              {profile.education.map((item) => (
                <li key={item.period + item.title}>
                  <span className="timeline__period">{item.period}</span>
                  <strong>{item.title}</strong>
                  <p>{item.detail}</p>
                </li>
              ))}
            </ul>
          </article>

          <article className="card">
            <h3>{about.directions}</h3>
            <ul className="list">
              {profile.directions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
