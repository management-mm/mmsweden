import { type FC } from 'react';
import { useTranslation } from 'react-i18next';

import Flag from './Flag';

import { Title } from '@enums/i18nConstants';

interface IPhoneCodeOptionProps {
  name: string;
  flag: string;
  callingCode: string;
  phoneFormat: string | string[];
  formatIndex?: number;
}
const PhoneCodeOption: FC<IPhoneCodeOptionProps> = ({
  name,
  flag,
  callingCode,
  phoneFormat,
  formatIndex = 0,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap items-center">
      <Flag name={name} flag={flag} />

      <span className="mr-[4px]">{name}</span>
      {Array.isArray(phoneFormat) && (
        <span>({t(Title.Format, { number: formatIndex + 1 })})</span>
      )}
      <div>
        <span>{callingCode}</span>
        {Array.isArray(phoneFormat) && (
          <span> {phoneFormat[formatIndex ?? 0]}</span>
        )}
      </div>
    </div>
  );
};

export default PhoneCodeOption;
