import { type FC } from 'react';

interface IPhoneCodeOptionProps {
  name: string;
  flag: string;
  callingCode: string;
}
const PhoneCodeOption: FC<IPhoneCodeOptionProps> = ({
  name,
  flag,
  callingCode,
}) => {
  return (
    <div className="flex items-center">
      <div className="relative mr-[4px] flex h-[20px] w-[20px] shrink-0 items-center justify-center">
        <img
          src={flag}
          alt={`Flag of ${name}`}
          className="h-[18px] w-[18px] rounded-full border border-secondaryDesc object-cover"
        />
        <div className="absolute top-0 h-[20px] w-[20px] rounded-full border border-[#999999]" />
      </div>

      <span className="mr-[4px]">{name}</span>
      <span>{callingCode}</span>
    </div>
  );
};

export default PhoneCodeOption;
