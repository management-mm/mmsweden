import React from 'react';

import PublicProviders from 'app/providers/PublicProviders';

import Footer from '@components/footer/Footer';
import Header from '@components/header/Header';

import type { AppLocale } from '@i18n/config';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function SiteLayout({ children, params }: Props) {
  const { locale } = await params;

  const safeLocale = locale as AppLocale;

  return (
    <PublicProviders locale={safeLocale}>
      <div className="bg-main font-inter">
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
    </PublicProviders>
  );
}
