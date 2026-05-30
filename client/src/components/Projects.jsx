import { useLanguage } from '../context/LanguageContext';

export default function Projects() {
  const { t } = useLanguage();
  const { projects } = t;

  return (
    <section className="section" id="projects">
      <div className="container">
        <h2 className="section__title">{projects.title}</h2>
        <p className="section__lead">{projects.lead}</p>

        <div className="grid grid--projects">
          {projects.items.map((project) => (
            <article className="card project-card" key={project.id}>
              <span className="project-card__type">{project.type}</span>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div>
                <h4>{projects.contribution}</h4>
                <ul className="list">
                  {project.personal.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="tags tags--compact">
                {(projects.tech[project.id] ?? []).map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
