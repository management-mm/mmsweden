import localFont from 'next/font/local';
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import Sprite from '../Sprite';
import Providers from '../providers';
import { cn } from '@utils/cn';
import { isAppLocale } from '@i18n/config';
import { messagesMap } from '@i18n/messages';

export const inter = localFont({
  src: [
    { path: '../../public/fonts/inter/Inter-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/inter/Inter-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../../public/fonts/inter/Inter-SemiBold.woff2', weight: '600', style: 'normal' },
    { path: '../../public/fonts/inter/Inter-Bold.woff2', weight: '700', style: 'normal' },
    { path: '../../public/fonts/inter/Inter-Black.woff2', weight: '900', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-inter',
});



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
    <html lang={locale} className={inter.variable}>
      <body className={cn(inter.className, 'bg-main')}>
        <Sprite />
        <NextIntlClientProvider
  key={locale}
  locale={locale}
  messages={messages}
>
  <Providers locale={locale}>
    {children}
    <div id="modal-root" />
  </Providers>
</NextIntlClientProvider>
      </body>
    </html>
  );
}