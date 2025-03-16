import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import clsx from 'clsx';

import BackBtn from './BackBtn';
import Nav from './Nav';

import { Logo } from '@components/common/Logo';
import MobileMenu from '@components/common/MobileMenu';
import BurgerMenu from '@components/header/BurgerMenu';

import useWindowWidth from '@hooks/useWindowWidth';

import { cn } from '@utils/cn';

const Topbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const location = useLocation();
  const windowWidth = useWindowWidth();

  const toggleMobileMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="flex flex-col border-b-2 border-neutral pb-[8px] md:pb-[14px] lg:h-[112px] lg:w-[calc(100vw-290px)] lg:flex-row lg:items-center lg:pl-[24px]">
      <div
        className={cn(
          'container',
          'flex items-center justify-between py-[8px] md:py-[14px] lg:hidden'
        )}
      >
        <Logo />
        <BurgerMenu handleToggleMobileMenu={toggleMobileMenu} />
      </div>
      {location.pathname === '/admin/all-products' ? (
        <h1
          className={clsx(
            'text-primiry text-[24px] font-semibold',
            windowWidth < 1178 && 'container'
          )}
        >
          Product List
        </h1>
      ) : (
        <BackBtn />
      )}

      <MobileMenu
        direction="right"
        isOpen={isOpen}
        handleToggleMenu={toggleMobileMenu}
      >
        <div className="px-[12px]">
          <Nav />
        </div>
      </MobileMenu>
    </div>
  );
};

export default Topbar;
