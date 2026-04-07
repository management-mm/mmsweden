'use client';

import { Dispatch, SetStateAction } from 'react';

import { ISeoCategory } from '@interfaces/ISeoCategory';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import SvgIcon from '@components/common/SvgIcon';

import { Title } from '@enums/i18nConstants';
import { IconId } from '@enums/iconsSpriteId';

import { AppLocale } from '@i18n/config';

type Props = {
  categories: ISeoCategory[];
  subcategories: ISeoCategory[];
  selectedParentId: string | null;
  setSelectedParentId: Dispatch<SetStateAction<string | null>>;
  language: AppLocale;
  selectedParent?: ISeoCategory;
  mode: 'filters' | 'header';
};

export default function MobileCategoriesMenu({
  categories,
  subcategories,
  selectedParentId,
  setSelectedParentId,
  language,
  selectedParent,
  mode,
}: Props) {
  const handleToggleCategory = (id: string) => {
    setSelectedParentId(prev => (prev === id ? null : id));
  };

  const t = useTranslations();

  return (
    <div
      className={clsx(
        'w-full overflow-x-hidden',
        mode === 'filters' && 'h-[350px] overflow-y-scroll'
      )}
    >
      {categories.map(category => {
        const isOpen = String(category._id) === selectedParentId;

        return (
          <div key={String(category._id)} className="border-b border-slate-200">
            <button
              type="button"
              onClick={() => handleToggleCategory(String(category._id))}
              className={clsx(
                'text-primary flex w-full items-center justify-between py-[18px] pr-[24px] pl-[16px] text-start text-[12px] uppercase transition-colors',
                isOpen ? 'bg-secondary font-bold' : 'bg-white font-medium'
              )}
            >
              <span className="min-w-0 flex-1 pr-[12px] break-words whitespace-normal">
                {category.name[language]}
              </span>

              <div
                className={clsx(
                  'shrink-0 transition-transform duration-300 ease-in-out',
                  isOpen ? 'rotate-0' : 'rotate-45'
                )}
              >
                <SvgIcon
                  iconId={IconId.OpenClose}
                  size={{ width: 14, height: 14 }}
                />
              </div>
            </button>

            {isOpen && (
              <div className="overflow-x-hidden bg-white px-[16px] pb-[16px]">
                <div className="flex flex-col">
                  <Link
                    href={`/all-products/${selectedParent?.slug}`}
                    key={String(selectedParentId)}
                    className="block py-[8px] pl-[16px] text-[14px] break-words whitespace-normal"
                  >
                    {t(Title.All)}
                  </Link>
                  {subcategories.map(subcategory => (
                    <Link
                      href={`/all-products/${selectedParent?.slug}/${subcategory.slug}`}
                      key={String(subcategory._id)}
                      className="block py-[8px] pl-[16px] text-[14px] break-words whitespace-normal"
                    >
                      {subcategory.name[language]}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
