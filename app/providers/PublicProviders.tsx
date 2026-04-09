'use client';

import React from 'react';

import dynamic from 'next/dynamic';

import BaseProviders from './BaseProviders';

import { useScrollToTop } from '@hooks/useScrollToTop';

import type { AppLocale } from '@i18n/config';

type Props = {
  children: React.ReactNode;
  locale: AppLocale;
};

const CookieConsent = dynamic(() => import('@components/CookieConsent'), {
  ssr: false,
});

const ScrollToTopButton = dynamic(
  () => import('@components/common/ScrollToTopButton'),
  {
    ssr: false,
  }
);

const AppToastContainer = dynamic(
  () => import('@components/common/AppToastContainer'),
  {
    ssr: false,
  }
);

function PublicUiEnhancements() {
  useScrollToTop();

  return (
    <>
      <CookieConsent />
      <ScrollToTopButton />
      <AppToastContainer />
    </>
  );
}

export default function PublicProviders({ children, locale }: Props) {
  return (
    <BaseProviders locale={locale}>
      {children}
      <PublicUiEnhancements />
    </BaseProviders>
  );
}
