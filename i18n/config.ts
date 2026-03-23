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

export type AppLocale = 'en' | 'sv' | 'de' | 'fr' | 'es' | 'ru' | 'uk' | 'pl';

export const DEFAULT_LOCALE: AppLocale = 'en';

export function isAppLocale(value: string): value is AppLocale {
  return SUPPORTED_LOCALES.includes(value as AppLocale);
}
