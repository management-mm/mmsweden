import { NavLink } from 'react-router-dom';

import SvgIcon from '@components/common/SvgIcon';

import { cn } from '@utils/cn';

import { IconId } from '@enums/iconsSpriteId';

const NavGeneral = () => {
  return (
    <NavLink
      to="settings"
      className={({ isActive }) =>
        cn(
          'flex items-center gap-[12px] py-[8px] pl-[16px]',
          isActive
            ? 'rounded-[20px] bg-secondaryAccent fill-secondary text-secondary'
            : ''
        )
      }
    >
      <SvgIcon iconId={IconId.Settings} size={{ width: 16, height: 16 }} />
      Settings
    </NavLink>
  );
};

export default NavGeneral;
