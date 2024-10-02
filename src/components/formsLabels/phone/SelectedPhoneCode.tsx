import type { FC, ReactNode } from 'react';

import SvgIcon from '@components/common/SvgIcon';

import { IconId } from '@enums/iconsSpriteId';

interface ISelectedPhoneCodeProps {
  isOpen: boolean;
  selectedOption: ReactNode;
}

const SelectedPhoneCode: FC<ISelectedPhoneCodeProps> = ({
  isOpen,
  selectedOption,
}) => {
  return (
    <div className="flex items-center">
      <div className="relative mr-[4px] h-[20px] w-[20px] shrink-0">
        <img
          src={selectedOption?.label.props.flag}
          alt={`Flag of ${name}`}
          className="h-[20px] w-[20px] rounded-full object-cover"
        />
        <div className="absolute left-[-2px] top-[-2px] h-[24px] w-[24px] rounded-full border-[1px] border-[#999999]" />
      </div>
      <SvgIcon
        iconId={isOpen ? IconId.ArrowTop : IconId.ArrowDown}
        size={{ width: 8, height: 8 }}
        className="mr-[4px]"
      />
      <span className="font-openSans text-[14px]">
        {selectedOption?.label.props.callingCode}
      </span>
    </div>
  );
};

export default SelectedPhoneCode;
