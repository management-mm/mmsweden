'use client';

import React, { createContext, useEffect, useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Provider as ReduxProvider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PersistGate } from 'redux-persist/integration/react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import SessionExpiredModal from '@components/adminDashboard/statusModals/SessionExpiredModal';
import ScrollToTopButton from '@components/common/ScrollToTopButton';
import SvgIcon from '@components/common/SvgIcon';
import Loader from '@components/common/loaders/Loader';

import { setupApiInterceptors } from '@store/api';
import { persistor, store } from '@store/store';

import { useScrollToTop } from '@hooks/useScrollToTop';

import { IconId } from '@enums/iconsSpriteId';

import type { AppLocale } from '@i18n/config';

type Props = {
  children: React.ReactNode;
  locale: AppLocale;
};

export const LocaleContext = createContext<AppLocale>('en');

function AppContent({ children }: { children: React.ReactNode }) {
  useScrollToTop();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <HelmetProvider>
        <SessionExpiredModal />
        <ScrollToTopButton />
        {children}

        <ToastContainer
          closeButton={
            <SvgIcon
              iconId={IconId.Close}
              size={{ width: 36, height: 36 }}
              className="fill-white"
            />
          }
          icon={({ type }) => {
            if (type === 'success') {
              return (
                <SvgIcon
                  iconId={IconId.Check}
                  className="fill-white"
                  size={{ width: 20, height: 20 }}
                />
              );
            }

            return null;
          }}
        />
      </HelmetProvider>
    </LocalizationProvider>
  );
}

export default function Providers({ children, locale }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setupApiInterceptors(store);
    setMounted(true);
  }, []);

  return (
    <LocaleContext.Provider value={locale}>
      <ReduxProvider store={store}>
        {!mounted || !persistor ? (
          <Loader />
        ) : (
          <PersistGate persistor={persistor}>
            <AppContent>{children}</AppContent>
          </PersistGate>
        )}
      </ReduxProvider>
    </LocaleContext.Provider>
  );
}
