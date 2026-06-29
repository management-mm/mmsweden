export const SUPPORTED_LOCALES = [
  'en',
  'sv',
  'de',
  'fr',
  'es',
  'ru',
  'uk',
  'pl',
] as const;

export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale = 'en';

export const OG_LOCALE_BY_APP_LOCALE: Record<AppLocale, string> = {
  en: 'en_US',
  sv: 'sv_SE',
  de: 'de_DE',
  fr: 'fr_FR',
  es: 'es_ES',
  ru: 'ru_RU',
  uk: 'uk_UA',
  pl: 'pl_PL',
};

export function isAppLocale(value: string): value is AppLocale {
  return SUPPORTED_LOCALES.includes(value as AppLocale);
}
