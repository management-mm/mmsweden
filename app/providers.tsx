'use client';

import React, { createContext, useEffect, useMemo, useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Provider as ReduxProvider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PersistGate } from 'redux-persist/lib/integration/react';

import '@i18n';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';

import ScrollToTop from '@components/ScrollToTop';
import SvgIcon from '@components/common/SvgIcon';

import { persistor, store } from '@store/store';

import { IconId } from '@enums/iconsSpriteId';
import { LanguageKeys } from '@enums/languageKeys';
import Loader from '@components/common/loaders/Loader';

interface LanguageContextType {
  language: LanguageKeys;
  setLanguage: (language: LanguageKeys) => void;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: LanguageKeys.EN,
  setLanguage: () => {},
});

function getInitialLang(): LanguageKeys {
  if (typeof window === 'undefined') return LanguageKeys.EN;
  const storedLanguage = window.localStorage.getItem('i18nextLng') ?? 'en';
  return (
    storedLanguage.length > 2 ? storedLanguage.slice(0, 2) : storedLanguage
  ) as LanguageKeys;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<LanguageKeys>(LanguageKeys.EN);

  useEffect(() => {
    setLanguage(getInitialLang());
  }, []);

  const value = useMemo(() => ({ language, setLanguage }), [language]);

  return (
    <ReduxProvider store={store}>
      <PersistGate loading={<Loader />} persistor={persistor}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <HelmetProvider>
            <LanguageContext.Provider value={value}>
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
            </LanguageContext.Provider>
          </HelmetProvider>
        </LocalizationProvider>
      </PersistGate>
    </ReduxProvider>
  );
}
