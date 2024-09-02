import type { FC } from 'react';

import clsx from 'clsx';

import Navbar from '@components/common/Navbar';
import SvgIcon from '@components/common/SvgIcon';

import { IconId } from '@enums/iconsSpriteId';

interface IMobileMenuProps {
  handleToggleMobileMenu: () => void;
  isOpen: boolean;
}

const MobileMenu: FC<IMobileMenuProps> = ({
  handleToggleMobileMenu,
  isOpen,
}) => {
  return (
    <div
      className={clsx(
        'fixed top-0 h-[100vh] w-[250px] bg-white py-[100px] transition-all duration-1000 ease-in-out',
        isOpen
          ? 'right-0 shadow-openMobileMenuShadow'
          : 'right-[-250px] shadow-closeMobileMenuShadow'
      )}
    >
      <button
        onClick={handleToggleMobileMenu}
        className="absolute right-[32px] top-[32px]"
      >
        <SvgIcon iconId={IconId.Close} size={{ width: 28, height: 28 }} />
      </button>
      <div className="flex items-center justify-center">
        <Navbar intent="mobileMenu" />
      </div>
    </div>
  );
};

export default MobileMenu;
