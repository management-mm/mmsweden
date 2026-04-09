'use client';

import React from 'react';

import BaseProviders from './BaseProviders';

import CookieConsent from '@components/CookieConsent';
import AppToastContainer from '@components/common/AppToastContainer';
import ScrollToTopButton from '@components/common/ScrollToTopButton';

import { useScrollToTop } from '@hooks/useScrollToTop';

import type { AppLocale } from '@i18n/config';

type Props = {
  children: React.ReactNode;
  locale: AppLocale;
};

function PublicAppContent({ children }: { children: React.ReactNode }) {
  useScrollToTop();

  return (
    <>
      <CookieConsent />
      <ScrollToTopButton />

      {children}

      <AppToastContainer />
    </>
  );
}

export default function PublicProviders({ children, locale }: Props) {
  return (
    <BaseProviders locale={locale}>
      <PublicAppContent>{children}</PublicAppContent>
    </BaseProviders>
  );
}
