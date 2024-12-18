import type { FC } from 'react';

import Flag from './Flag';

interface ICountryOptionProps {
  flag: string;
  name: string;
}

const CountryOption: FC<ICountryOptionProps> = ({ flag, name }) => {
  return (
    <div className="flex">
      <Flag name={name} flag={flag} />

      <span>{name}</span>
    </div>
  );
};

export default CountryOption;
