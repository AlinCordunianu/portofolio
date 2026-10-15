import { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import "./Header.scss";
import logo from "../../assets/AC_logo.png";
export function Header({ content = {} }) {
  const { language, setLanguage, translate } = useLanguage();
  const [open, setOpen] = useState(false);
  return (
    <header className="header container">
      <a className="wordmark" href="#home" aria-label="Alin Cordunianu — home">
        <img src={logo} alt="" width="52" height="48" />
      </a>
      <nav
        id="main-navigation"
        className={open ? "navigation is-open" : "navigation"}
        aria-label={
          language === "en" ? "Main navigation" : "Navigație principala"
        }
      >
        {(content.navigation ?? []).map((item) => (
          <a
            key={item.target}
            href={item.target}
            onClick={() => setOpen(false)}
          >
            {translate(item.label)}
          </a>
        ))}
      </nav>
      <div className="header-end">
        <span className="availability">
          <i />
          {language === "en"
            ? "Open to opportunities"
            : "Deschis la oportunitați"}
        </span>
        <div className="languages" aria-label="Language">
          {["en", "ro"].map((value) => (
            <button
              key={value}
              aria-pressed={language === value}
              onClick={() => setLanguage(value)}
            >
              {value.toUpperCase()}
            </button>
          ))}
        </div>
        <button
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="main-navigation"
          aria-label={
            language === "en" ? "Toggle navigation" : "Deschide navigația"
          }
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
