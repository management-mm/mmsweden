'use client';

import type { FC } from 'react';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { NavBar } from '@enums/i18nConstants';

interface IBreadcrumbProps {
  slug?: string;
  name?: string;
}

const Breadcrumb: FC<IBreadcrumbProps> = ({ slug, name }) => {
  const t = useTranslations();
  const pathname = usePathname();

  const isAllProducts = pathname.includes('/all-products');

  const isProductPage = slug && pathname.includes(`/all-products/${slug}`);

  return (
    <div className="text-desc mb-[22px] flex flex-wrap items-center text-[14px] font-medium md:text-[16px]">
      <Link href="/" className="mr-[12px] cursor-pointer hover:text-black">
        {t(NavBar.Home)}
      </Link>

      {isAllProducts && (
        <>
          <span className="mr-[12px]">/</span>
          <Link
            href="/all-products"
            className={clsx(
              'mr-[12px]',
              pathname === '/all-products' && 'text-title'
            )}
          >
            {t(NavBar.AllProducts)}
          </Link>
        </>
      )}

      {isProductPage && name && (
        <>
          <span className="mr-[12px]">/</span>
          <span className="text-title">{name}</span>
        </>
      )}
    </div>
  );
};

export default Breadcrumb;
