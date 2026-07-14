import type { ReactElement } from 'react';

export interface ICountryOptionLabelProps {
  name: string;
  flag?: string;
  callingCode?: string;
  phoneFormat?: string | string[];
  formatIndex?: number;
}

export interface ICountryOption {
  value: string;
  label: ReactElement<ICountryOptionLabelProps>;
}
