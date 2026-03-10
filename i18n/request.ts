import { getRequestConfig } from 'next-intl/server';

import { type AppLocale, DEFAULT_LOCALE, isAppLocale } from './config';
import { messagesMap } from './messages';

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  const resolvedLocale: AppLocale =
    locale && isAppLocale(locale) ? locale : DEFAULT_LOCALE;

  return {
    locale: resolvedLocale,
    messages: (await messagesMap[resolvedLocale]()).default,
  };
});
