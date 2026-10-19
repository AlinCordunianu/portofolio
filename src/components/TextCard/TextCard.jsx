import "./TextCard.scss";
import { useLanguage } from "../../context/LanguageContext";
import { DeferredMonogram } from "./DeferredMonogram";
export function TextCard({ content = {} }) {
  const { language, translate } = useLanguage();
  return (
    <div className="about-overflow">
      <section
        id={content.sectionId}
        className="about container reveal"
        aria-labelledby="about-heading"
      >
        <div className="about-copy reveal-item">
          <p className="eyebrow">
            {" "}
            {/* taste-skill-ignore: preserve the existing About label and reference treatment. */}
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
          <div className="about-body">
            <p>{translate(content.text)}</p>
          </div>
          <a href="#contact" className="button">
            {language === "en" ? "Let’s work together" : "Hai sa colaboram"}
            <span className="arrow" aria-hidden="true">
              &#8599;
            </span>
          </a>
        </div>
        <DeferredMonogram />
        <div className="about-note">
          <span>React & JavaScript</span>
          <span>
            {language === "en" ? "Bucharest, Romania" : "București, România"}
          </span>
        </div>
      </section>
    </div>
  );
}
