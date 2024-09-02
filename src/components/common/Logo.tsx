import { NavLink } from 'react-router-dom';

import SvgIcon from './SvgIcon';

import { cn } from '@utils/cn';

import { IconId } from '@enums/iconsSpriteId';

export const Logo = ({ className, iconClassName }) => {
  return (
    <NavLink to="./" className={className}>
      <SvgIcon
        iconId={IconId.Logo}
        size={{ width: 94, height: 48 }}
        className={cn('md:h-[84px] md:w-[166px]', iconClassName)}
      />
    </NavLink>
  );
};
