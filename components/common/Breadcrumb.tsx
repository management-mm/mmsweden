'use client';

import type { FC } from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { useCurrentLocale } from '@hooks/useCurrentLocale';

import { NavBar } from '@enums/i18nConstants';

interface IBreadcrumbItem {
  slug: string;
  label: string;
}

interface IBreadcrumbProps {
  category?: IBreadcrumbItem;
  subcategory?: IBreadcrumbItem;
  product?: {
    label: string;
  };
}

const Breadcrumb: FC<IBreadcrumbProps> = ({
  category,
  subcategory,
  product,
}) => {
  const t = useTranslations();
  const locale = useCurrentLocale();

  const items = [
    {
      href: '/',
      label: t(NavBar.Home),
    },
    {
      href: '/all-products',
      label: t(NavBar.AllProducts),
    },
  ];

  if (category) {
    items.push({
      href: `/${locale}/all-products/${category.slug}`,
      label: category.label,
    });
  }

  if (category && subcategory) {
    items.push({
      href: `/${locale}/all-products/${category.slug}/${subcategory.slug}`,
      label: subcategory.label,
    });
  }

  return (
    <div className="text-desc mb-[22px] flex flex-wrap items-center text-[14px] font-medium md:text-[16px]">
      {items.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index > 0 && <span className="mr-[12px]">/</span>}

          <Link href={item.href} className="mr-[12px] hover:text-black">
            {item.label}
          </Link>
        </div>
      ))}

      {product?.label && (
        <div className="flex items-center">
          <span className="mr-[12px]">/</span>
          <span className="text-title mr-[12px]">{product.label}</span>
        </div>
      )}
    </div>
  );
};

export default Breadcrumb;
