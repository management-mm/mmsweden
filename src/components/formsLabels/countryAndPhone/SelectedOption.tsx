import type { FC } from 'react';

import clsx from 'clsx';

import Flag from './Flag';

import SvgIcon from '@components/common/SvgIcon';

import { IconId } from '@enums/iconsSpriteId';

interface ISelectedOptionProps {
  isOpen: boolean;
  name: string;
  flag: string;
  value: string;
  labelName: 'country' | 'phone';
}

const SelectedOption: FC<ISelectedOptionProps> = ({
  isOpen,
  name,
  flag,
  value,
  labelName,
}) => {
  return (
    <div
      className={clsx(
        'flex items-center',
        labelName === 'country' && 'w-full justify-between',
        labelName === 'phone' && 'w-[30px] gap-[8px]'
      )}
    >
      <div className="flex items-center">
        <Flag name={name} flag={flag} />
        <SvgIcon
          iconId={isOpen ? IconId.ArrowTop : IconId.ArrowDown}
          size={{ width: 8, height: 8 }}
          className={clsx(
            '',
            labelName === 'country' && 'hidden',
            labelName === 'phone' && 'mr-[4px]'
          )}
        />
        <span className="font-openSans text-[14px] leading-tight text-title">
          {value}
        </span>
      </div>

      <SvgIcon
        iconId={isOpen ? IconId.ArrowTop : IconId.ArrowDown}
        size={{ width: 8, height: 8 }}
        className={clsx(
          '',
          labelName === 'country' && '',
          labelName === 'phone' && 'hidden'
        )}
      />
    </div>
  );
};

export default SelectedOption;
