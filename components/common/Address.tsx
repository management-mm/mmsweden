import type { FC } from 'react';

import SvgIcon from './SvgIcon';

import { cn } from '@utils/cn';

import { IconId } from '@enums/iconsSpriteId';

interface IAddressProps {
  containerClassName?: string;
  iconClassName?: string;
}

const Address: FC<IAddressProps> = ({ containerClassName, iconClassName }) => {
  return (
    <div className={cn('mb-[12px] flex items-baseline', containerClassName)}>
      <SvgIcon
        className={cn('fill-secondary mr-[9px]', iconClassName)}
        iconId={IconId.Location}
        size={{ width: 12, height: 16 }}
      />
      <address className="not-italic">
        Kronoholmsvägen 4 <br />
        27144 YSTAD, SWEDEN
      </address>
    </div>
  );
};

export default Address;
