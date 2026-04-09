'use client';

import React, { createContext, useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Provider as ReduxProvider } from 'react-redux';

import { setupApiInterceptors } from '@store/api';
import { store } from '@store/store';

import type { AppLocale } from '@i18n/config';

type Props = {
  children: React.ReactNode;
  locale: AppLocale;
};

export const LocaleContext = createContext<AppLocale>('en');

let interceptorsInitialized = false;

export default function BaseProviders({ children, locale }: Props) {
  useEffect(() => {
    if (interceptorsInitialized) return;

    setupApiInterceptors(store);
    interceptorsInitialized = true;
  }, []);

  return (
    <LocaleContext.Provider value={locale}>
      <ReduxProvider store={store}>
        <HelmetProvider>{children}</HelmetProvider>
      </ReduxProvider>
    </LocaleContext.Provider>
  );
}
