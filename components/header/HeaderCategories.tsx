'use client';

import { useEffect, useRef, useState } from 'react';

import type { CategoryNavigationNode } from '@lib/serverCategoryNavigation';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

import CategoriesBurgerMenu from './CategoriesBurgerMenu';
import CategoriesMenu from './CategoriesMenu';

import { Button } from '@enums/i18nConstants';

const HeaderCategories = ({
  categories,
}: {
  categories: CategoryNavigationNode[];
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const t = useTranslations();
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsOpen(prev => !prev);
  };

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

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

      <div className={isOpen ? undefined : 'hidden'}>
        <CategoriesMenu
          initialCategories={categories}
          mode="header"
          isOpenHeaderMenu={isOpen}
          onCloseHeaderMenu={() => setIsOpen(false)}
          triggerRef={triggerRef}
        />
      </div>
    </div>
  );
};

export default HeaderCategories;
