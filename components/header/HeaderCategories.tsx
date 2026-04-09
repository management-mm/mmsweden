'use client';

import { useRef, useState } from 'react';

import { useTranslations } from 'next-intl';

import CategoriesBurgerMenu from './CategoriesBurgerMenu';
import CategoriesMenu from './CategoriesMenu';

import { Button } from '@enums/i18nConstants';

const HeaderCategories = () => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const t = useTranslations();

  const toggleMenu = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <div className="relative shrink-0">
      <button
        ref={triggerRef}
        type="button"
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-label="Toggle categories menu"
        className="flex h-[48px] items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 text-[15px] font-medium text-[#163A5F] transition hover:bg-slate-50"
      >
        <CategoriesBurgerMenu isOpen={isOpen} />
        {t(Button.Categories)}
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
};

export default HeaderCategories;
