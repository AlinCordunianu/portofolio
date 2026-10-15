import "./TextCard.scss";
import { useLanguage } from "../../context/LanguageContext";
export function TextCard({ content = {} }) {
  const { language, translate } = useLanguage();
  return (
    <section
      id={content.sectionId}
      className="about container reveal"
      aria-labelledby="about-heading"
    >
      <div className="reveal-item">
        <p className="eyebrow">
          <span>{translate(content.title)}</span>
        </p>
        <h2 id="about-heading">
          {language === "en" ? (
            <>
              Turning ideas into
              <br />
              <em>interactive experiences.</em>
            </>
          ) : (
            <>
              Transform idei în
              <br />
              <em>experiențe interactive.</em>
            </>
          )}
        </h2>
        <a href="#contact" className="button">
          {language === "en" ? "Let’s work together" : "Hai sa colaboram"}
          <span className="arrow" aria-hidden="true">
            &#8599;
          </span>
        </a>
      </div>
      <div
        className="about-body reveal-item"
        style={{ "--reveal-delay": "100ms" }}
      >
        <p>{translate(content.text)}</p>
        <div className="about-note">
          <span>React & JavaScript</span>
          <span>
            {language === "en" ? "Bucharest, Romania" : "București, România"}
          </span>
        </div>
      </div>
    </section>
  );
}
