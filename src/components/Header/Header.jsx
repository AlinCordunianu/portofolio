import { useLanguage } from '../../context/LanguageContext';
import './Header.scss';

export function Header({ content = {} }) {
  const { language, setLanguage, translate } = useLanguage();

  function handleNavigation(target) {
    if (!target) return;
    const sectionId = target.replace(/^#/, '');
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  return (
    <div className="header-container container">
      <img className="header-logo" src={content.logo?.src} alt={translate(content.logo?.alt)} />
      <div className="header-button-container">
        {(content.navigation ?? []).map((item) => (
          <button
            key={item.target}
            className="header-button"
            onClick={() => handleNavigation(item.target)}
          >
            {translate(item.label)}
          </button>
        ))}
        {(content.languages ?? ['en', 'ro']).map((value, index) => (
          <span key={value}>
            {index > 0 && <span>/</span>}
            <button onClick={() => setLanguage(value)} aria-pressed={language === value}>
              {value.toUpperCase()}
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
