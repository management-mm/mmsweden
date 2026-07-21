import { type ReactNode, Suspense } from 'react';
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
import { getSiteUrl } from '@i18n/schema';

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

const siteUrl = getSiteUrl();

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
      {
        url: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
    ],
    apple: '/apple-icon.png',
  },

  openGraph: {
    type: 'website',
    siteName: 'MM Sweden',
    title: defaultTitle,
    description: defaultDescription,
  },

  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: defaultDescription,
  },
};

type Props = {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams(): Array<{ locale: AppLocale }> {
  return SUPPORTED_LOCALES.map(locale => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!isAppLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} className={inter.variable} suppressHydrationWarning>
      <body className={cn(inter.className, 'bg-main')}>
        <NextIntlClientProvider locale={locale} messages={messages}>
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
