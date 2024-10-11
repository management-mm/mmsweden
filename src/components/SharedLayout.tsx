import { Suspense, useState } from 'react';
import { createContext } from 'react';
import { Outlet } from 'react-router-dom';

import ScrollToTop from './ScrollToTop';
import Footer from './footer/Footer';
import Header from './header/Header';

import type { LanguageKeys } from '@enums/languageKeys';

interface LanguageContextType {
  language: LanguageKeys;
  setLanguage: (language: LanguageKeys) => void;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: (localStorage.getItem('i18nextLng') as LanguageKeys) || 'en',
  setLanguage: () => {},
});

const SharedLayout = () => {
  const [language, setLanguage] = useState<LanguageKeys>(
    (localStorage.getItem('i18nextLng') as LanguageKeys) || 'en'
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
        </main>
        <Footer />
      </LanguageContext.Provider>
    </div>
  );
};

export default SharedLayout;
