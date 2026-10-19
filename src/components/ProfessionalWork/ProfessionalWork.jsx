import { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import "./ProfessionalWork.scss";

export function ProfessionalWork({ content }) {
  const { translate } = useLanguage();
  const [openId, setOpenId] = useState(null);
  const labels = content.labels;
  const [showAll, setShowAll] = useState(false);
  const remainingCount = Math.max(0, content.projects.length - 5);
  const renderProject = (project, index) => {
    const expanded = openId === project.id;
    const panelId = `contributions-${project.id}`;
    const buttonId = `${panelId}-button`;
    return (
      <article
        className={`professional-project reveal${expanded ? " is-expanded" : ""}`}
        key={project.id}
        aria-labelledby={`${project.id}-heading`}
      >
        <h3
          id={`${project.id}-heading`}
          className="professional-project-row-heading reveal-item"
          style={{ "--reveal-delay": `${(index % 3) * 60}ms` }}
        >
          <button
            id={buttonId}
            className="professional-project-trigger"
            aria-expanded={expanded}
            aria-controls={panelId}
            onClick={() => setOpenId(expanded ? null : project.id)}
          >
            <span className="professional-project-number" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="professional-project-row-copy">
              <span className="professional-project-title">
                {project.title}
              </span>
              <span className="professional-project-meta">
                {translate(project.category)}
                {project.year && <span> / {project.year}</span>}
              </span>
            </span>
            <span className="professional-sr-only">
              {translate(expanded ? labels.close : labels.open)}
            </span>
            <span className="professional-project-toggle" aria-hidden="true" />
          </button>
        </h3>
        <div
          id={panelId}
          role="region"
          aria-labelledby={buttonId}
          className={`professional-project-panel${expanded ? " is-open" : ""}`}
          inert={!expanded}
        >
          <div className="professional-project-panel-inner">
            <div className="professional-project-case-study">
              <div className="professional-project-details">
                <p className="professional-project-description">
                  {translate(project.description)}
                </p>
                <h4>{translate(labels.contributions)}</h4>
                <ul>
                  {project.contributions.map((item, i) => (
                    <li key={i}>{translate(item)}</li>
                  ))}
                </ul>
                {project.note && (
                  <p className="professional-project-note">
                    {translate(project.note)}
                  </p>
                )}
                {!!project.technologies.length && (
                  <ul
                    className="professional-project-tags"
                    aria-label={translate(labels.technologies)}
                  >
                    {project.technologies.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                )}
                {project.unavailable && (
                  <p className="professional-project-note">
                    {translate(labels.unavailable)}
                  </p>
                )}
                {!!project.links.length && (
                  <div className="professional-project-links">
                    {project.links.map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {translate(link.label)}{" "}
                        <span aria-hidden="true">↗</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
              <figure className="professional-project-media" hidden={!expanded}>
                {project.image ? (
                  <>
                    <img
                      className={
                        project.image.fit === "contain"
                          ? "is-contained"
                          : undefined
                      }
                      src={project.image.src}
                      alt={translate(project.image.alt)}
                      width={project.image.width}
                      height={project.image.height}
                      loading="lazy"
                      decoding="async"
                    />
                    <figcaption>
                      <span>{translate(project.image.caption)}</span>{" "}
                      <a
                        href={project.image.source}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {translate(project.image.credit)}{" "}
                        <span aria-hidden="true">↗</span>
                      </a>
                    </figcaption>
                  </>
                ) : (
                  <div className="professional-project-placeholder">
                    <span aria-hidden="true">{project.title}</span>
                    <p>{translate(labels.placeholder)}</p>
                  </div>
                )}
              </figure>
            </div>
          </div>
        </div>
      </article>
    );
  };

  return (
    <section
      id="professional-work"
      className="professional-work container"
      aria-labelledby="professional-work-heading"
    >
      <header className="professional-work-heading reveal">
        <h2 id="professional-work-heading" className="reveal-item">
          {translate(content.title)}
        </h2>
        <p className="reveal-item">{translate(content.subtitle)}</p>
      </header>
      <div className="professional-work-list">
        {content.projects.slice(0, 5).map(renderProject)}
        {remainingCount > 0 && (
          <>
            <div id="professional-work-additional-projects" hidden={!showAll}>
              {content.projects
                .slice(5)
                .map((project, index) => renderProject(project, index + 5))}
            </div>
            <button
              type="button"
              className="professional-work-more-button"
              aria-expanded={showAll}
              aria-controls="professional-work-additional-projects"
              onClick={() => {
                setShowAll(!showAll);
                if (
                  showAll &&
                  content.projects
                    .slice(5)
                    .some((project) => project.id === openId)
                ) {
                  setOpenId(null);
                }
              }}
            >
              {translate(
                showAll ? labels.fewerProjects : labels.moreProjects,
              ).replace("{count}", remainingCount)}
            </button>
          </>
        )}
      </div>
    </section>
  );
}
