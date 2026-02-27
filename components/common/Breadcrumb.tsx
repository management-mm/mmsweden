'use client';

import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { NavBar } from '@enums/i18nConstants';

interface IBreadcrumbProps {
  productId?: string;
  name?: string;
}

const Breadcrumb: FC<IBreadcrumbProps> = ({ productId, name }) => {
  const { t } = useTranslation();
  const pathname = usePathname();

  const isAllProducts = pathname.includes('/all-products');
  const isProductPage =
    productId && pathname.includes(`/all-products/${productId}`);

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

      {isProductPage && (
        <>
          <span className="mr-[12px]">/</span>
          <Link
            href={`/all-products/${productId}`}
            className={clsx('text-title')}
          >
            {name}
          </Link>
        </>
      )}
    </div>
  );
};

export default Breadcrumb;
