import "./Footer.scss";
import { useLanguage } from "../../context/LanguageContext";

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}
export function Footer({ content = {} }) {
  const { language } = useLanguage();
  const email = `mailto:${content.email}`;
  return (
    <footer
      id={content.sectionId}
      className="contact"
      aria-labelledby="contact-heading"
    >
      <div className="container">
        <div className="contact-stage">
          <div className="contact-copy reveal">
            <p className="eyebrow reveal-item">
              <span>{language === "en" ? "Get in touch" : "Contact"}</span>
            </p>
            <h2
              id="contact-heading"
              className="reveal-item"
              style={{ "--reveal-delay": "70ms" }}
            >
              {language === "en" ? (
                <>
                  Let’s build something
                  <br />
                  interactive.
                </>
              ) : (
                <>
                  Hai să construim ceva
                  <br />
                  interactiv.
                </>
              )}
            </h2>
            <p
              className="contact-description reveal-item"
              style={{ "--reveal-delay": "120ms" }}
            >
              {language === "en"
                ? "Open to freelance projects, creative collaborations and full-time opportunities."
                : "Deschis la proiecte freelance, colaborări creative și oportunități full-time."}
            </p>
            <div
              className="contact-actions reveal-item"
              style={{ "--reveal-delay": "180ms" }}
            >
              <a
                className="button contact-cta"
                href={email}
                title={content.email}
              >
                {language === "en" ? "Send a message" : "Trimite un mesaj"}
                <span className="arrow" aria-hidden="true">
                  &#8594;
                </span>
              </a>
              <nav
                className="contact-socials"
                aria-label={
                  language === "en" ? "Contact links" : "Linkuri de contact"
                }
              >
                <a
                  className="contact-social"
                  href={email}
                  aria-label={`Email: ${content.email}`}
                  title={content.email}
                >
                  <MailIcon />
                </a>
                {(content.links ?? [])
                  .slice()
                  .sort((a, b) =>
                    a.label === "LinkedIn"
                      ? -1
                      : b.label === "LinkedIn"
                        ? 1
                        : 0,
                  )
                  .map((link) => (
                    <a
                      className="contact-social"
                      key={link.label}
                      href={link.url}
                      aria-label={link.label}
                      title={link.label}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={`/images/tech/${link.label.toLowerCase()}.svg`}
                        width="18"
                        height="18"
                        alt=""
                        aria-hidden="true"
                      />
                    </a>
                  ))}
              </nav>
            </div>
          </div>
          <div className="contact-art-entry reveal" aria-hidden="true">
            <div className="contact-art reveal-item">
              <img
                src="/images/glossy_neon_green.png"
                alt=""
                width="1254"
                height="1254"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Alin Cordunianu</span>
          <span>
            {language === "en"
              ? "Built with curiosity. Crafted with React."
              : "Creat cu pasiune. Construit cu React."}
          </span>
          <a href="#home">
            {language === "en" ? "Back to top" : "Înapoi sus"}{" "}
            <span aria-hidden="true">&#8593;</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
