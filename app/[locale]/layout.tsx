import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import Providers from '../providers';

import { isAppLocale } from '@i18n/config';
import { messagesMap } from '@i18n/messages';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isAppLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = (await messagesMap[locale]()).default;

  return (
    <NextIntlClientProvider key={locale} locale={locale} messages={messages}>
      <Providers locale={locale}>
        {children}
        <div id="modal-root" />
      </Providers>
    </NextIntlClientProvider>
  );
}
