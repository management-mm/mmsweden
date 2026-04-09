'use client';

import { useContext } from 'react';

import { LocaleContext } from 'app/providers/BaseProviders';

import type { AppLocale } from '@i18n/config';

export const useCurrentLocale = (): AppLocale => {
  return useContext(LocaleContext);
};
