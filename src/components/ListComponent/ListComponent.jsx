import "./ListComponent.scss";
import { useLanguage } from "../../context/LanguageContext";
import { useId, useState } from "react";

const logos = {
  React: { file: "react" },
  "Context API": { file: "react" },
  JavaScript: { file: "javascript" },
  TypeScript: { file: "typescript" },
  SCSS: { file: "sass" },
  HTML: { file: "html5" },
  CSS: { file: "css3" },
  Redux: { file: "redux" },
  Zustand: { file: "zustand" },
  GraphQL: { file: "graphql" },
  "Three.js": { file: "threejs", monochrome: true },
  WebGL: { file: "webgl", monochrome: true },
  "A-Frame": { file: "aframe", monochrome: true },
  Blender: { file: "blender" },
  Git: { file: "git" },
  Vite: { file: "vite" },
  npm: { file: "npm" },
  Figma: { file: "figma" },
  YOLO: { file: "yolo", monochrome: true },
};
const featured = [
  {
    name: "React",
    logo: "React",
    description: {
      en: "Modern frontend experiences",
      ro: "Experiențe frontend moderne",
    },
  },
  {
    name: "JavaScript",
    logo: "JavaScript",
    description: {
      en: "Interactive, performant web apps",
      ro: "Aplicații web interactive",
    },
  },
  {
    name: "TypeScript",
    logo: "TypeScript",
    description: {
      en: "Clear types. Confident code.",
      ro: "Tipuri clare. Cod robust.",
    },
  },
  {
    name: "SCSS",
    logo: "SCSS",
    description: {
      en: "Clean, maintainable styles",
      ro: "Stiluri clare și sustenabile",
    },
  },
  {
    name: "Three.js",
    logo: "Three.js",
    description: {
      en: "3D graphics and interactive UI",
      ro: "Grafică 3D și interfețe interactive",
    },
  },
  {
    name: "Computer vision",
    logo: "YOLO",
    description: {
      en: "YOLO object detection in the browser",
      ro: "Detecție de obiecte cu YOLO în browser",
    },
  },
];
function TechLogo({ name, size = 40 }) {
  const logo = logos[name];
  if (!logo) return null;
  return (
    <img
      src={`/images/tech/${logo.file}.svg`}
      className={`tech-logo${logo.monochrome ? " is-monochrome" : ""}`}
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
    />
  );
}
export function ListComponent({ content = {} }) {
  const { language, translate } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const toolkitId = useId();
  return (
    <section
      id="skills"
      className="skills container reveal"
      aria-labelledby="skills-heading"
    >
      <div className="section-heading reveal-item">
        <h2 className="eyebrow" id="skills-heading">
          <span>{language === "en" ? "Tech stack" : "Tehnologii"}</span>
        </h2>
        <p className="note">
          {language === "en" ? "Tools I work with" : "Uneltele mele"}
        </p>
      </div>
      <div className="featured-skills">
        {featured.map((skill, index) => (
          <div
            className="skill reveal-item"
            key={skill.name}
            style={{ "--reveal-delay": `${70 + index * 55}ms` }}
          >
            <span className="skill-icon">
              <TechLogo name={skill.logo} />
            </span>
            <div>
              <h3>{skill.name}</h3>
              <p>{translate(skill.description)}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="all-skills">
        <button
          type="button"
          className="toolkit-trigger"
          id={`${toolkitId}-trigger`}
          aria-expanded={expanded}
          aria-controls={`${toolkitId}-panel`}
          aria-labelledby={`${toolkitId}-title`}
          aria-describedby={`${toolkitId}-description`}
          onClick={() => setExpanded((open) => !open)}
        >
          <span className="toolkit-trigger-copy">
            <span className="toolkit-label">
              {language === "en" ? "Explore more" : "Descoperă mai mult"}
            </span>
            <span className="toolkit-title" id={`${toolkitId}-title`}>
              {language === "en"
                ? "Explore my full toolkit"
                : "Descoperă toate tehnologiile mele"}
            </span>
            <span
              className="toolkit-description"
              id={`${toolkitId}-description`}
            >
              {language === "en"
                ? "Frontend, state management, 3D, APIs & computer vision"
                : "Frontend, gestionarea stării, 3D, API-uri și computer vision"}
            </span>
          </span>
          <span className="toolkit-toggle" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 3v14M3 10h14"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </span>
        </button>
        <div
          className={`toolkit-panel${expanded ? " is-expanded" : ""}`}
          id={`${toolkitId}-panel`}
          role="region"
          aria-labelledby={`${toolkitId}-trigger`}
          aria-hidden={!expanded}
          inert={!expanded}
        >
          <div className="toolkit-panel-inner">
            <div className="skills-columns">
              {content.columns.map((column) => (
                <div key={column.title.en}>
                  <h3>{translate(column.title)}</h3>
                  <ul>
                    {column.items.map((item) => (
                      <li key={item}>
                        <TechLogo name={item} size={20} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
