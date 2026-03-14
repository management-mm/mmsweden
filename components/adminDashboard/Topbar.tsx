'use client';

import { useState } from 'react';

import clsx from 'clsx';
import { usePathname } from 'next/navigation';

import BackBtn from './BackBtn';
import Nav from './Nav';
import LogoutButton from './common/Logout';

import LanguageSelect from '@components/common/LanguageSelect';
import { Logo } from '@components/common/Logo';
import MobileMenu from '@components/common/MobileMenu';
import BurgerMenu from '@components/header/BurgerMenu';

import useWindowWidth from '@hooks/useWindowWidth';

import { cn } from '@utils/cn';

const Topbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const windowWidth = useWindowWidth();

  const toggleMobileMenu = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <div className="border-neutral flex flex-col border-b-2 pb-[8px] md:pb-[14px] lg:h-[112px] lg:w-[calc(100vw-290px)] lg:flex-row lg:items-center lg:pl-[24px]">
      <div
        className={cn(
          'container',
          'flex items-center justify-between py-[8px] md:py-[14px] lg:hidden'
        )}
      >
        <Logo />
        <BurgerMenu handleToggleMobileMenu={toggleMobileMenu} />
      </div>

      {pathname === '/admin/all-products' ? (
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
          <div className="flex items-center justify-between pr-[16px]">
            <LogoutButton />
            <LanguageSelect />
          </div>
        </div>
      </MobileMenu>
    </div>
  );
};

export default Topbar;
