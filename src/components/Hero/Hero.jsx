import { Component, lazy, Suspense, useEffect, useRef, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import "./Hero.scss";
import { HeroAtmosphere } from "./HeroAtmosphere";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useDeferredScene } from "../../hooks/useDeferredScene";
const StoneScene = lazy(() => import("./StoneScene"));
class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
function StoneFallback({ loading = false, language }) {
  return (
    <div className="stone-fallback">
      <span className="fallback-orbit" />
      <p>
        {language === "en"
          ? loading
            ? "Loading the experience"
            : "Creative work. In another dimension."
          : loading
            ? "Se încarca experiența"
            : "Creativitate. În alta dimensiune."}
      </p>
    </div>
  );
}
function HeroName({ name }) {
  const first = name.split(" ")[0];
  const last = name.slice(first.length + 1);
  return (
    <h1 aria-label={name}>
      <span className="name-lines" aria-hidden="true">
        <span className="name-line" data-name={first}>
          {first}
        </span>
        <span className="name-line" data-name={last}>
          {last}
          <span className="cursor">_</span>
        </span>
      </span>
    </h1>
  );
}
export function Hero({ content = {} }) {
  const { language, translate } = useLanguage();
  const [paused] = useState(false);
  const [active, setActive] = useState(true);
  const hero = useRef();
  const reducedMotion = useReducedMotion();
  const showScene = useDeferredScene(active);
  useEffect(() => {
    document.documentElement.dataset.motion = paused ? "paused" : "running";
    return () => {
      delete document.documentElement.dataset.motion;
    };
  }, [paused]);
  useEffect(() => {
    let inView = true;
    const update = () => setActive(inView && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      update();
    });
    observer.observe(hero.current);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  const fallback = <StoneFallback language={language} />;
  return (
    <section
      ref={hero}
      id="home"
      className={`hero-stage has-autoplay${paused || !active || reducedMotion ? " is-motion-paused" : ""}`}
      aria-label={translate(content.role)}
    >
      <HeroAtmosphere />
      <div className="hero container">
        <div className="hero-copy">
          <p className="eyebrow">
            <span>{translate(content.role)}</span>
          </p>
          <HeroName name={content.name} />
          <p className="hero-description">{translate(content.description)}</p>
          <div className="hero-actions">
            <a className="button" href="#work">
              {language === "en" ? "View projects" : "Vezi proiectele"}
              <span className="arrow" aria-hidden="true">
                &#8599;
              </span>
            </a>
            <a className="button secondary" href="#contact">
              {language === "en" ? "Get in touch" : "Hai sa vorbim"}
            </a>
          </div>
        </div>
        <div
          className="hero-art"
          role="group"
          aria-label={
            language === "en"
              ? "Animated green magic stone with orbiting fragments"
              : "Piatra magica verde animata cu fragmente orbitale"
          }
        >
          {showScene ? (
            <SceneBoundary fallback={fallback}>
              <Suspense
                fallback={
                  <div className="stone-fallback" aria-hidden="true">
                    <span className="fallback-orbit" />
                  </div>
                }
              >
                <StoneScene paused={paused || !active || reducedMotion} />
              </Suspense>
            </SceneBoundary>
          ) : (
            <div className="stone-fallback" aria-hidden="true">
              <span className="fallback-orbit" />
            </div>
          )}
        </div>
        <div className="hero-aside">
          <span>
            WebGL
            <br />
            Interactive UI
            <br />
            {language === "en"
              ? "A little more playful web"
              : "Un web mai creativ"}
          </span>
          <p>
            {language === "en"
              ? "Thoughtful interfaces. Unexpected interactions. Ideas brought to life in the browser."
              : "Interfețe atent construite. Interacțiuni neașteptate. Idei aduse la viața în browser."}
          </p>
        </div>
        <div className="hero-bottom">
          <span>{translate(content.location)}</span>
          {/* <div className="motion-controls">
            <button
              onClick={() => setPaused(!paused)}
              aria-pressed={paused}
              className="motion-control"
            >
              {language === "en"
                ? paused
                  ? "Resume animations"
                  : "Stop animations"
                : paused
                  ? "Reia animațiile"
                  : "Oprește animațiile"}{" "}
              <span aria-hidden="true">{paused ? "\u25b7" : "\u2161"}</span>
            </button>
          </div> */}
          <a href="#work">
            {language === "en" ? "Scroll to explore" : "Descopera proiectele"}{" "}
            <span aria-hidden="true">&#8595;</span>
          </a>
        </div>
      </div>
    </section>
  );
}
