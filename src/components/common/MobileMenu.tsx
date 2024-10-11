import { type FC, type ReactNode, useEffect } from 'react';

import clsx from 'clsx';

import SvgIcon from './SvgIcon';

import useOutsideAlerter from '@hooks/useOutsideAlerter';

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
  const outsideAlerterRef = useOutsideAlerter(() => {
    if (!isOpen) return;
    handleToggleMenu();
  });
  useEffect(() => {
    if (isOpen) {
      document.querySelector('body').classList.add('overflow-y-hidden');
    } else {
      document.querySelector('body').classList.remove('overflow-y-hidden');
    }
  }, [isOpen]);
  return (
    <div
      ref={outsideAlerterRef}
      className={clsx(
        'scrollbar-none fixed z-10 bg-white py-[100px] transition-all ease-in-out',
        direction === 'left' &&
          'top-0 h-[100vh] w-[300px] overflow-y-auto duration-1000',
        direction === 'right' &&
          'top-0 h-[100vh] w-[250px] overflow-y-auto duration-1000',
        direction === 'bottom' &&
          'overflow-hidden- left-0 right-0 h-[80vh] w-full rounded-t-[22px] px-[20px] pt-[25px] duration-500',
        isOpen &&
          direction === 'right' &&
          'right-0 shadow-openMobileMenuShadow',
        !isOpen &&
          direction === 'right' &&
          'right-[-250px] shadow-closeMobileMenuShadow',
        isOpen && direction === 'left' && 'left-0 shadow-openMobileMenuShadow',
        !isOpen &&
          direction === 'left' &&
          'left-[-300px] shadow-closeMobileMenuShadow',
        isOpen &&
          direction === 'bottom' &&
          'shadow-openMobileMenuVerticalShadow bottom-0',
        !isOpen &&
          direction === 'bottom' &&
          'shadow-closeMobileMenuVerticalShadow bottom-[-80vh]'
      )}
    >
      <button
        type="button"
        onClick={() => {
          console.log(isOpen);
          handleToggleMenu();
        }}
        className="absolute right-[32px] top-[32px]"
      >
        <SvgIcon iconId={IconId.Close} size={{ width: 28, height: 28 }} />
      </button>
      {children}
    </div>
  );
};

export default MobileMenu;
