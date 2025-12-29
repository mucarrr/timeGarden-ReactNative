import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Language } from '../types';
import tr from './tr.json';
import en from './en.json';

const resources = {
  tr: { translation: tr },
  en: { translation: en },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Varsayılan, detectLanguage ile güncellenecek
    fallbackLng: 'en',
    compatibilityJSON: 'v3', // React Native için v3 format kullan
    interpolation: {
      escapeValue: false,
    },
  });

export const changeLanguage = (lang: Language) => {
  i18n.changeLanguage(lang);
};

export default i18n;

