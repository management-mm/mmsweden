import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import Providers from '../providers';

import { type AppLocale, SUPPORTED_LOCALES, isAppLocale } from '@i18n/config';
import { messagesMap } from '@i18n/messages';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map(locale => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!isAppLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = (await messagesMap[locale as AppLocale]()).default;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Providers locale={locale}>
        {children}
        <div id="modal-root" />
      </Providers>
    </NextIntlClientProvider>
  );
}
