import { useState } from 'react';
import { LanguageContext } from './LanguageContext';

export function LanguageProvider({ children }) {
  const [language, updateLanguage] = useState('en');

  function setLanguage(value) {
    if (value === 'en' || value === 'ro') {
      updateLanguage(value);
    }
  }

  function translate(value) {
    if (typeof value === 'string') {
      return value;
    }

    if (!value || typeof value !== 'object') {
      return '';
    }

    return value[language] ?? value.en ?? '';
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        translate
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}