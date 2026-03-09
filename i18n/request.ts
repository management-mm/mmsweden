import { getRequestConfig } from 'next-intl/server';
import {
  DEFAULT_LOCALE,
  isAppLocale,
  type AppLocale
} from './config';

import { messagesMap } from './messages';

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  const resolvedLocale: AppLocale =
    locale && isAppLocale(locale) ? locale : DEFAULT_LOCALE;

  return {
    locale: resolvedLocale,
    messages: (await messagesMap[resolvedLocale]()).default
  };
});