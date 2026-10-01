import { useLanguage } from '../../context/LanguageContext';
import './Hero.scss';

export function Hero({ content = {} }) {
  const { translate } = useLanguage();

  return (
    <div className="hero-container container">
      <div className="hero-text-container">
        <h1>{translate(content.name)}</h1>
        <h2>{translate(content.role)}</h2>
        <p>{translate(content.description)}</p>
        <p className="hero-text-subparagraph">{translate(content.location)}</p>
        <div className="hero-button-container">
          <button
            className="hero-button-primary"
            onClick={() => { if (content.primaryAction?.target) window.location.hash = content.primaryAction.target; }}
          >
            {translate(content.primaryAction?.label)}
          </button>
          <a
            className="hero-linkedin-link"
            href={content.secondaryAction?.url}
            target={content.secondaryAction?.external ? '_blank' : undefined}
            rel={content.secondaryAction?.external ? 'noopener noreferrer' : undefined}
          >
            {translate(content.secondaryAction?.label)}
          </a>
        </div>
      </div>
      <img src={content.image?.src} className="hero-image" alt={translate(content.image?.alt)} />
    </div>
  );
}
