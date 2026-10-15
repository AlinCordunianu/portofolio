import { useEffect, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";

const storageKey = "portfolio-ambient-motion";

export function AmbientMotionControl() {
  const { language } = useLanguage();
  const [enabled, setEnabled] = useState(() => {
    try {
      return localStorage.getItem(storageKey) !== "paused";
    } catch {
      return true;
    }
  });

  useEffect(() => {
    const value = enabled ? "running" : "paused";
    document.documentElement.dataset.ambientMotion = value;
    try {
      localStorage.setItem(storageKey, value);
    } catch {
      // Motion controls still work when browser storage is unavailable.
    }
    return () => delete document.documentElement.dataset.ambientMotion;
  }, [enabled]);

  return (
    <button
      type="button"
      className="ambient-motion-control"
      aria-pressed={enabled}
      aria-label={language === "en" ? "Ambient motion" : "Mișcare ambientală"}
      onClick={() => setEnabled((previous) => !previous)}
    >
      <span aria-hidden="true">{enabled ? "Ⅱ" : "▷"}</span>
      {language === "en"
        ? enabled
          ? "Pause atmosphere"
          : "Play atmosphere"
        : enabled
          ? "Oprește atmosfera"
          : "Pornește atmosfera"}
    </button>
  );
}
