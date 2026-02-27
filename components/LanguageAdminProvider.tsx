'use client';

import React, { createContext, useEffect, useMemo, useState } from 'react';

import { LanguageKeys } from '@enums/languageKeys';

interface LanguageContextType {
  language: LanguageKeys;
  setLanguage: (language: LanguageKeys) => void;
}

export const LanguageContextAdmin = createContext<LanguageContextType>({
  language: LanguageKeys.EN,
  setLanguage: () => {},
});

function normalizeLng(stored: string | null): LanguageKeys {
  if (!stored) return LanguageKeys.EN;
  const short = stored.length > 2 ? stored.slice(0, 2) : stored;
  return short as LanguageKeys;
}

export default function LanguageAdminProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguage] = useState<LanguageKeys>(LanguageKeys.EN);

  useEffect(() => {
    const stored = window.localStorage.getItem('i18nextLng');
    setLanguage(normalizeLng(stored));
  }, []);

  const value = useMemo(() => ({ language, setLanguage }), [language]);

  return (
    <LanguageContextAdmin.Provider value={value}>
      {children}
    </LanguageContextAdmin.Provider>
  );
}
