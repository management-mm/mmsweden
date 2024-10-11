import { initReactI18next } from 'react-i18next';

import * as i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import { LOCALES } from './constans';
import { de, en, es, fr, ru, sv, uk } from './locales';

export const defaultNS = 'ns1';

export const resources = {
  [LOCALES.EN]: {
    translation: en,
  },
  [LOCALES.SV]: {
    translation: sv,
  },
  [LOCALES.RU]: {
    translation: ru,
  },
  [LOCALES.DE]: {
    translation: de,
  },
  [LOCALES.ES]: {
    translation: es,
  },
  [LOCALES.FR]: {
    translation: fr,
  },
  [LOCALES.UK]: {
    translation: uk,
  },
};

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    load: 'languageOnly',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      transKeepBasicHtmlNodesFor: ['span'],
    },
  });

export default i18n;
