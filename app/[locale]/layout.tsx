import React, { Suspense } from 'react';
import 'react-loading-skeleton/dist/skeleton.css';

import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import localFont from 'next/font/local';
import { notFound } from 'next/navigation';

import Sprite from '../Sprite';
import '../globals.css';
import GoogleTagManagerProvider from '../providers/GoogleTagManagerProvider';
import ReactQueryProvider from '../providers/ReactQueryProvider';

import { cn } from '@utils/cn';

import { type AppLocale, SUPPORTED_LOCALES, isAppLocale } from '@i18n/config';

const inter = localFont({
  src: [
    {
      path: '../../public/fonts/inter/Inter-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/inter/Inter-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/inter/Inter-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/inter/Inter-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/inter/Inter-Black.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-inter',
});

const siteUrl =
  process.env.SITE_URL?.replace(/\/$/, '') ?? 'https://www.mmsweden.se';

const defaultTitle = 'MM Sweden';
const defaultDescription =
  'Used food processing and packaging equipment from MM Sweden. Browse machinery for the food industry.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: '%s',
  },
  description: defaultDescription,
  applicationName: 'MM Sweden',
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    type: 'website',
    siteName: 'MM Sweden',
    title: defaultTitle,
    description: defaultDescription,
    url: siteUrl,
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: defaultDescription,
  },
};

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

  const safeLocale: AppLocale = locale;

  setRequestLocale(safeLocale);

  const messages = await getMessages();

  return (
    <html lang={safeLocale} suppressHydrationWarning className={inter.variable}>
      <body className={cn(inter.className, 'bg-main')}>
        <NextIntlClientProvider locale={safeLocale} messages={messages}>
          <GoogleTagManagerProvider />

          <Suspense fallback={null}>
            <Sprite />
          </Suspense>

          <ReactQueryProvider>{children}</ReactQueryProvider>

          <div id="modal-root" />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
