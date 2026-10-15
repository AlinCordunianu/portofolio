import { useLanguage } from "../../context/LanguageContext";
import "./TwoColumnCard.scss";
export function TwoColumnCard({ content = {}, compact = false }) {
  const { language, translate } = useLanguage();
  const isCoca = content.variant === "coca";
  const links = (content.links ?? []).filter(
    (link) => link.url && link.url !== "#",
  );
  if (compact)
    return (
      <article
        className="project-compact reveal-item"
        style={{ "--reveal-delay": "180ms" }}
      >
        <div>
          <span className="project-number">
            {language === "en" ? "Also exploring" : "Alte explorari"}
          </span>
          <h3>{translate(content.title)}</h3>
        </div>
        <p>{translate(content.description)}</p>
        <span className="compact-stack">{content.stack?.join(" / ")}</span>
      </article>
    );
  return (
    <article
      className={`project reveal-item ${isCoca ? "project-coca" : "project-scan"}`}
      style={{ "--reveal-delay": isCoca ? "140ms" : "70ms" }}
    >
      {isCoca ? (
        <img
          className="project-image"
          src="/images/cocapair-concept.webp"
          alt={
            language === "en"
              ? "Concept artwork: red and black soda cans with dramatic red lighting"
              : "Imagine de concept: doze roșii și negre în lumina roșie"
          }
          width="1536"
          height="1024"
          loading="lazy"
        />
      ) : (
        <>
          <img
            className="project-image"
            src="/images/scan-slay-concept.png"
            alt={translate(content.image?.alt)}
            width="1536"
            height="1024"
            loading="lazy"
          />
          
        </>
      )}
      <div className="project-shade" />
      <div className="project-top">
        <span>
          {isCoca
            ? "Computer vision · React"
            : "Web AR · Object detection · 3D"}
        </span>
      </div>
      <div className="project-copy">
        <div className="project-title-row">
          <h3>{translate(content.title)}</h3>
          {isCoca && (
            <span className="status">
              {language === "en" ? "In progress" : "În lucru"}
            </span>
          )}
        </div>
        <p>{translate(content.description)}</p>
        <div className="project-links">
          {links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target={link.url.startsWith("http") ? "_blank" : undefined}
              rel={
                link.url.startsWith("http") ? "noopener noreferrer" : undefined
              }
            >
              <span className="circle-arrow" aria-hidden="true">
                &#8599;
              </span>
              {translate(link.label)}
            </a>
          ))}
          {!links.length && (
            <span className="project-coming">
              {language === "en"
                ? "In development — stay curious"
                : "În dezvoltare — fii pe aproape"}
              <span aria-hidden="true">&#8599;</span>
            </span>
          )}
        </div>
      </div>
      <span className="project-caption">
        {language === "en"
          ? isCoca
            ? "Concept artwork"
            : "AR concept artwork / React / YOLO"
          : isCoca
            ? "Imagine de concept"
            : "Concept AR / React / YOLO"}
      </span>
    </article>
  );
}
