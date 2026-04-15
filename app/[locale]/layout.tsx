import React from 'react';

import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

import {
  type AppLocale,
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  isAppLocale,
} from '@i18n/config';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map(locale => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  const safeLocale: AppLocale = isAppLocale(locale) ? locale : DEFAULT_LOCALE;
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={safeLocale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
