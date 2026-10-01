import { useLanguage } from '../../context/LanguageContext';
import './TwoColumnCard.scss';

export function TwoColumnCard({ content = {} }) {
  const { translate } = useLanguage();

  return (
    <div id={content.sectionId} className="twocolumn-container container">
      {content.sectionTitle && (
        <h2 className="twocolumn-section-title">{translate(content.sectionTitle)}</h2>
      )}
      <div className="twocolumn-content">
        <div className="twocolumn-text-container">
          <h3 className="twocolumn-title"><span>{content.number}</span> {translate(content.title)}</h3>
          <p className="twocolumn-description">{translate(content.description)}</p>
          <p className="twocolumn-description">{(content.stack ?? []).join(' / ')}</p>
          <div className="twocolumn-button-container">
            {(content.links ?? []).map((link, index) => (
              <a key={`${link.url}-${index}`} href={link.url} target="_blank" rel="noopener noreferrer">
                {translate(link.label)}
              </a>
            ))}
          </div>
        </div>
        <img src={content.image?.src} alt={translate(content.image?.alt)} />
      </div>
    </div>
  );
}
