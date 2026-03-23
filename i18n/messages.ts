import type { AppLocale } from './config';

export const messagesMap: Record<AppLocale, () => Promise<{ default: any }>> = {
  en: () => import('@messages/en.json'),
  sv: () => import('@messages/sv.json'),
  de: () => import('@messages/de.json'),
  fr: () => import('@messages/fr.json'),
  es: () => import('@messages/es.json'),
  ru: () => import('@messages/ru.json'),
  uk: () => import('@messages/uk.json'),
  pl: () => import('@messages/pl.json'),
};
