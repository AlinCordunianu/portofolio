import "./App.scss";
import { useEffect } from "react";
import { Header } from "./components/Header/Header";
import { Hero } from "./components/Hero/Hero";
import { TwoColumnCard } from "./components/TwoColumnCard/TwoColumnCard";
import { ListComponent } from "./components/ListComponent/ListComponent";
import { TextCard } from "./components/TextCard/TextCard";
import { Footer } from "./components/Footer/Footer";
import { ProfessionalWork } from "./components/ProfessionalWork/ProfessionalWork";
import { Trivia } from "./components/Trivia/Trivia";
import { useLanguage } from "./context/LanguageContext";
import data from "./content.json";
function App() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    document
      .querySelectorAll(".reveal")
      .forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  const { language } = useLanguage();
  const find = (id) => data.find((item) => item.id === id)?.content;
  const projects = data.filter((item) => item.type === "twocolumncard");
  return (
    <>
      <a className="skip-link" href="#main">
        {language === "en" ? "Skip to content" : "Sari la con?inut"}
      </a>
      <Header content={find("header")} />
      <main id="main">
        <Hero content={find("hero")} />
        <TextCard content={find("about")} />
        <section
          id="work"
          className="work container reveal"
          aria-labelledby="work-heading"
        >
          <div className="section-heading reveal-item">
            <h2 id="work-heading" className="eyebrow">
              <span>
                {language === "en" ? "Featured projects" : "Proiecte selectate"}
              </span>
            </h2>
            <p className="note">
              {language === "en"
                ? "Real ideas. Interactive experiences."
                : "Idei reale. Experien?e interactive."}
            </p>
          </div>
          <div className="project-grid">
            {projects
              .filter((item) => item.id !== "3d-cv")
              .map((item) => (
                <TwoColumnCard key={item.id} content={item.content} />
              ))}
          </div>
        </section>
        <ProfessionalWork content={find("professional-work")} />
        <ListComponent content={find("skills")} />
        <Trivia content={find("trivia")} />
      </main>
      <Footer content={find("footer")} />
    </>
  );
}
export default App;
