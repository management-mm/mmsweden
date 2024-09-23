import type { FC } from 'react';

import SvgIcon from './SvgIcon';

import { cn } from '@utils/cn';

import { IconId } from '@enums/iconsSpriteId';

interface IMainContactsProps {
  containerClassName?: string;
  iconClassName?: string;
}

const MainContacts: FC<IMainContactsProps> = ({
  containerClassName,
  iconClassName,
}) => {
  return (
    <address
      className={cn('mb-[22px] flex flex-col gap-[22px]', containerClassName)}
    >
      <a className="flex items-center not-italic" href="tel:+4641119900">
        <SvgIcon
          className={cn('mr-[5px] fill-secondary', iconClassName)}
          iconId={IconId.Phone}
          size={{ width: 16, height: 16 }}
        />
        <span className="sr-only">Phone: </span> +46 411 199 00
      </a>
      <a
        className="flex items-center not-italic"
        href="mailto:info@mmsweden.se"
      >
        <SvgIcon
          className={cn('mr-[5px] fill-secondary', iconClassName)}
          iconId={IconId.Email}
          size={{ width: 15, height: 15 }}
        />
        <span className="sr-only">Email: </span> info@mmsweden.se
      </a>
    </address>
  );
};

export default MainContacts;
