import { Suspense, useState } from 'react';
import { createContext } from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import ScrollToTop from './ScrollToTop';
import SvgIcon from './common/SvgIcon';
import Footer from './footer/Footer';
import Header from './header/Header';

import { IconId } from '@enums/iconsSpriteId';
import type { LanguageKeys } from '@enums/languageKeys';

interface LanguageContextType {
  language: LanguageKeys;
  setLanguage: (language: LanguageKeys) => void;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: (() => {
    const storedLanguage = localStorage.getItem('i18nextLng');
    return storedLanguage && storedLanguage.length > 2
      ? (storedLanguage.slice(0, 2) as LanguageKeys)
      : (storedLanguage as LanguageKeys) || 'en';
  })(),
  setLanguage: () => {},
});

const SharedLayout = () => {
  const [language, setLanguage] = useState<LanguageKeys>(
    (() => {
      const storedLanguage = localStorage.getItem('i18nextLng');
      return storedLanguage && storedLanguage.length > 2
        ? (storedLanguage.slice(0, 2) as LanguageKeys)
        : (storedLanguage as LanguageKeys) || 'en';
    })()
  );

  return (
    <div className="bg-main font-inter">
      <ScrollToTop />
      <LanguageContext.Provider value={{ language, setLanguage }}>
        <Header />
        <main>
          <Suspense>
            <Outlet />
          </Suspense>
          <ToastContainer
            closeButton={
              <SvgIcon
                iconId={IconId.Close}
                size={{ width: 14, height: 14 }}
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
        </main>
        <Footer />
      </LanguageContext.Provider>
    </div>
  );
};

export default SharedLayout;
