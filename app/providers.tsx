'use client';

import React, { createContext } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Provider as ReduxProvider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PersistGate } from 'redux-persist/lib/integration/react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import ScrollToTop from '@components/ScrollToTop';
import SvgIcon from '@components/common/SvgIcon';
import Loader from '@components/common/loaders/Loader';

import { persistor, store } from '@store/store';
import { IconId } from '@enums/iconsSpriteId';
import type { AppLocale } from '@i18n/config';

type Props = {
  children: React.ReactNode;
  locale: AppLocale;
};

export const LocaleContext = createContext<AppLocale>('en');

export default function Providers({ children, locale }: Props) {
  return (
    <LocaleContext.Provider value={locale}>
      <ReduxProvider store={store}>
        <PersistGate loading={<Loader />} persistor={persistor}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <HelmetProvider>
              <ScrollToTop />
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
        </PersistGate>
      </ReduxProvider>
    </LocaleContext.Provider>
  );
}