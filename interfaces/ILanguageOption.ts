import type { ReactNode } from 'react';

import { AppLocale } from '@i18n/config';

export interface ILanguageOption {
  value: AppLocale;
  label: ReactNode;
}
