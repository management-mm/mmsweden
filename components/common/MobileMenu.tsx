'use client';

import { type FC, type ReactNode, useEffect } from 'react';

import clsx from 'clsx';

import SvgIcon from './SvgIcon';

import useOutsideAlerter from '@hooks/useOutsideAlerter';
import useWindowWidth from '@hooks/useWindowWidth';

import { IconId } from '@enums/iconsSpriteId';

interface IMobileMenuProps {
  children: ReactNode;
  direction: 'left' | 'right' | 'bottom';
  handleToggleMenu: () => void;
  isOpen: boolean;
}

const MobileMenu: FC<IMobileMenuProps> = ({
  children,
  direction,
  isOpen,
  handleToggleMenu,
}) => {
  const windowWidth = useWindowWidth();
  const outsideAlerterRef = useOutsideAlerter(() => {
    if (!isOpen || windowWidth > 1178) return;
    handleToggleMenu();
  }, isOpen);
  useEffect(() => {
    if (isOpen) {
      document.querySelector('body')?.classList.add('overflow-y-hidden');
    } else {
      document.querySelector('body')?.classList.remove('overflow-y-hidden');
    }
  }, [isOpen]);
  return (
    <div
      ref={outsideAlerterRef}
      className={clsx(
        'scrollbar-none fixed z-20 bg-white py-[100px] transition-all ease-in-out',
        direction === 'left' &&
          'top-0 h-[100vh] w-[300px] overflow-y-auto duration-1000',
        direction === 'right' &&
          'top-0 h-[100vh] w-[250px] overflow-y-auto duration-1000',
        direction === 'bottom' &&
          'right-0 left-0 h-[80vh] w-full overflow-hidden rounded-t-[22px] px-[20px] pt-[25px] duration-500',
        isOpen &&
          direction === 'right' &&
          'shadow-open-mobile-menu-shadow right-0',
        !isOpen &&
          direction === 'right' &&
          'shadow-close-mobile-menu-shadow right-[-250px]',
        isOpen &&
          direction === 'left' &&
          'shadow-open-mobile-menu-shadow left-0',
        !isOpen &&
          direction === 'left' &&
          'shadow-close-mobile-menu-shadow left-[-300px]',
        isOpen &&
          direction === 'bottom' &&
          'shadow-open-mobile-menu-vertical-shadow bottom-0',
        !isOpen &&
          direction === 'bottom' &&
          'shadow-close-mobile-menu-vertical-shadow bottom-[-80vh]'
      )}
    >
      <button
        type="button"
        onClick={() => {
          handleToggleMenu();
        }}
        className="absolute top-[32px] right-[32px]"
      >
        <SvgIcon iconId={IconId.Close} size={{ width: 28, height: 28 }} />
      </button>
      {children}
    </div>
  );
};

export default MobileMenu;
