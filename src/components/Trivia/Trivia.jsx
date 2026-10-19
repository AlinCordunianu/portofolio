import { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import "./Trivia.scss";

export function Trivia({ content }) {
  const { translate } = useLanguage();
  const [openId, setOpenId] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const remainingCount = Math.max(0, content.items.length - 3);

  const renderItem = (item, index) => {
    const expanded = openId === item.id;
    const buttonId = `trivia-${item.id}-button`;
    const panelId = `trivia-${item.id}-panel`;
    return (
      <article className="trivia-story reveal" key={item.id}>
        <h3
          className="trivia-row-heading reveal-item"
          style={{ "--reveal-delay": `${index * 60}ms` }}
        >
          <button
            id={buttonId}
            className="trivia-trigger"
            aria-expanded={expanded}
            aria-controls={panelId}
            onClick={() => setOpenId(expanded ? null : item.id)}
          >
            <span className="trivia-number" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="trivia-row-copy">
              <span className="trivia-category">
                {translate(item.category)}
              </span>
              <span className="trivia-title">{translate(item.title)}</span>
            </span>
            <span className="trivia-toggle" aria-hidden="true" />
          </button>
        </h3>
        <div
          id={panelId}
          role="region"
          aria-labelledby={buttonId}
          className={`trivia-panel${expanded ? " is-open" : ""}`}
          inert={!expanded}
        >
          <div className="trivia-panel-inner">
            <div className="trivia-story-copy">
              <p>{translate(item.story)}</p>
              <span className="trivia-tag">{translate(item.tag)}</span>
            </div>
          </div>
        </div>
      </article>
    );
  };

  return (
    <section
      id="trivia"
      className="trivia container"
      aria-labelledby="trivia-heading"
    >
      <header className="trivia-heading reveal">
        <h2 id="trivia-heading" className="reveal-item">
          {translate(content.title)}
        </h2>
        <p className="reveal-item">{translate(content.subtitle)}</p>
      </header>
      <div className="trivia-stories">
        {content.items.slice(0, 3).map(renderItem)}
        {remainingCount > 0 && (
          <>
            <div id="trivia-additional-facts" hidden={!showAll}>
              {content.items
                .slice(3)
                .map((item, index) => renderItem(item, index + 3))}
            </div>
            <button
              type="button"
              className="trivia-more-button"
              aria-expanded={showAll}
              aria-controls="trivia-additional-facts"
              onClick={() => {
                setShowAll(!showAll);
                if (
                  showAll &&
                  content.items.slice(3).some((item) => item.id === openId)
                ) {
                  setOpenId(null);
                }
              }}
            >
              {translate(
                showAll ? content.labels.fewerFacts : content.labels.moreFacts,
              ).replace("{count}", remainingCount)}
            </button>
          </>
        )}
      </div>
    </section>
  );
}
