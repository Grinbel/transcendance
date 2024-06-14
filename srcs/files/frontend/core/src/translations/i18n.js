import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslations from './en.json';
import frTranslations from './fr.json';
import deTranslations from './de.json';

function initializeI18n(language) {
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: {
          translation: enTranslations,
        },
        fr: {
          translation: frTranslations,
        },
        de: {
          translation: deTranslations,
        },
      },
      lng: language, // Utilisez la langue de l'utilisateur
      fallbackLng: 'en', // langue de secours
      interpolation: {
        escapeValue: false,
      },
      returnEmptyString: false,
      returnNull: false,
    });

  return (key) => {
    if (!i18n.exists(key)) {
      return 'no translation found';
    }
    const translation = i18n.t(key);
    // Vérifie si la traduction est identique à la clé, ce qui signifie qu'elle n'a pas été trouvée
    return translation === key ? 'no translation found' : translation;
  };
}

export default initializeI18n;
