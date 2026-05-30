import { useLanguage } from '../context/LanguageContext';

export default function Workflow() {
  const { t } = useLanguage();
  const { workflow } = t;

  return (
    <section className="section section--alt" id="workflow">
      <div className="container">
        <h2 className="section__title">{workflow.title}</h2>

        <div className="grid grid--2">
          <article className="card">
            <h3>{workflow.approachTitle}</h3>
            <ol className="numbered">
              {workflow.approach.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </article>

          <article className="card card--accent">
            <h3>{workflow.aiTitle}</h3>
            <ul className="list">
              {workflow.aiUsage.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
