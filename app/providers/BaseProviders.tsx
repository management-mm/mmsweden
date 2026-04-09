'use client';

import React, { createContext, useEffect } from 'react';
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

function InterceptorsInitializer() {
  useEffect(() => {
    if (interceptorsInitialized) return;

    setupApiInterceptors(store);
    interceptorsInitialized = true;
  }, []);

  return null;
}

export default function BaseProviders({ children, locale }: Props) {
  return (
    <LocaleContext.Provider value={locale}>
      <ReduxProvider store={store}>
        <InterceptorsInitializer />
        {children}
      </ReduxProvider>
    </LocaleContext.Provider>
  );
}
