'use client';

import React, { createContext, useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Provider as ReduxProvider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PersistGate } from 'redux-persist/integration/react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import ScrollToTop from '@components/ScrollToTop';
import SessionExpiredModal from '@components/adminDashboard/statusModals/SessionExpiredModal';
import SvgIcon from '@components/common/SvgIcon';
import Loader from '@components/common/loaders/Loader';

import { setupApiInterceptors } from '@store/api';
import { persistor, store } from '@store/store';

import { IconId } from '@enums/iconsSpriteId';

import type { AppLocale } from '@i18n/config';

type Props = {
  children: React.ReactNode;
  locale: AppLocale;
};

export const LocaleContext = createContext<AppLocale>('en');

function AppContent({ children }: { children: React.ReactNode }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <HelmetProvider>
        <ScrollToTop />
        <SessionExpiredModal />

        {children}

        <ToastContainer
          closeButton={
            <SvgIcon
              iconId={IconId.Close}
              size={{ width: 36, height: 36 }}
              className="fill-white"
            />
          }
          icon={
            <SvgIcon
              iconId={IconId.Check}
              className="fill-white"
              size={{ width: 20, height: 20 }}
            />
          }
        />
      </HelmetProvider>
    </LocalizationProvider>
  );
}

export default function Providers({ children, locale }: Props) {
  useEffect(() => {
    setupApiInterceptors(store);
  }, []);

  return (
    <LocaleContext.Provider value={locale}>
      <ReduxProvider store={store}>
        {persistor ? (
          <PersistGate loading={<Loader />} persistor={persistor}>
            <AppContent>{children}</AppContent>
          </PersistGate>
        ) : (
          <AppContent>{children}</AppContent>
        )}
      </ReduxProvider>
    </LocaleContext.Provider>
  );
}
