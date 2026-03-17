import { Suspense } from 'react';

import type { Metadata } from 'next';
import localFont from 'next/font/local';

import Sprite from './Sprite';
import './globals.css';

import { cn } from '@utils/cn';

const inter = localFont({
  src: [
    {
      path: '../public/fonts/inter/Inter-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/inter/Inter-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/inter/Inter-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/inter/Inter-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/inter/Inter-Black.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-inter',
});

const siteUrl =
  process.env.SITE_URL?.replace(/\/$/, '') ?? 'https://www.mmsweden.se';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className={cn(inter.className, 'bg-main')}>
        <Suspense fallback={null}>
          <Sprite />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
