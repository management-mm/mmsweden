'use client';

import { useContext } from 'react';
import { LocaleContext } from 'app/providers';

export function useCurrentLocale() {
  return useContext(LocaleContext);
}