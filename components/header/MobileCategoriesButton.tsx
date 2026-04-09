'use client';

import { useEffect, useRef, useState } from 'react';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

import CategoriesBurgerMenu from './CategoriesBurgerMenu';
import CategoriesMenu from './CategoriesMenu';

import useLockBodyScroll from '@hooks/useLockBodyScroll';

import { Button } from '@enums/i18nConstants';

type MobileCategoriesButtonProps = {
  isSearchActive: boolean;
  onToggleBeforeOpen?: () => void;
};

export default function MobileCategoriesButton({
  isSearchActive,
  onToggleBeforeOpen,
}: MobileCategoriesButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const t = useTranslations();
  const pathname = usePathname();

  useLockBodyScroll(isOpen);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleToggle = () => {
    onToggleBeforeOpen?.();
    setIsOpen(prev => !prev);
  };

  return (
    <div className="relative shrink-0">
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-label="Toggle categories menu"
        className={clsx(
          'flex h-[44px] items-center justify-center rounded-full border border-slate-300 bg-white text-[15px] font-medium text-[#163A5F] transition-all duration-300 ease-in-out hover:bg-slate-50',
          isSearchActive ? 'px-3' : 'px-5'
        )}
      >
        <CategoriesBurgerMenu isOpen={isOpen} />

        <span
          className={clsx(
            'overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out',
            isSearchActive
              ? 'ml-0 max-w-0 opacity-0'
              : 'ml-2 max-w-[120px] opacity-100'
          )}
        >
          {t(Button.Categories)}
        </span>
      </button>

      {isOpen && (
        <CategoriesMenu
          mode="header"
          isOpenHeaderMenu={isOpen}
          onCloseHeaderMenu={() => setIsOpen(false)}
          triggerRef={triggerRef}
        />
      )}
    </div>
  );
}
