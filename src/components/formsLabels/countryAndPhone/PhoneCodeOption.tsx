import { type FC } from 'react';

import Flag from './Flag';

interface IPhoneCodeOptionProps {
  name: string;
  flag: string;
  callingCode: string;
  phoneFormat: string | string[];
}
const PhoneCodeOption: FC<IPhoneCodeOptionProps> = ({
  name,
  flag,
  callingCode,
  phoneFormat,
}) => {
  return (
    <div className="flex items-center">
      <Flag name={name} flag={flag} />

      <span className="mr-[4px]">{name}</span>
      <span>{callingCode}</span>
      {Array.isArray(phoneFormat) && <span>{phoneFormat[0]}</span>}
    </div>
  );
};

export default PhoneCodeOption;
