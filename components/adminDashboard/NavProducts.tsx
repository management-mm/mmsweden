'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import SvgIcon from '@components/common/SvgIcon';

import { cn } from '@utils/cn';

import { IconId } from '@enums/iconsSpriteId';

const NavProducts = () => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (!pathname) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const getClass = (href: string) =>
    cn(
      'flex items-center gap-[12px] py-[8px] pl-[16px] transition-colors',
      isActive(href) &&
        'rounded-[20px] bg-secondary-accent fill-secondary text-secondary'
    );

  return (
    <>
      <Link
        href="/admin/all-products"
        className={getClass('/admin/all-products')}
      >
        <SvgIcon iconId={IconId.AllProducts} size={{ width: 18, height: 18 }} />
        Product List
      </Link>

      <Link
        href="/admin/new-product"
        className={getClass('/admin/new-product')}
      >
        <SvgIcon iconId={IconId.AddProduct} size={{ width: 18, height: 18 }} />
        New Product
      </Link>

      <Link
        href="/admin/filters-settings"
        className={getClass('/admin/filters-settings')}
      >
        <SvgIcon iconId={IconId.Filter} size={{ width: 14, height: 14 }} />
        Filters Settings
      </Link>
    </>
  );
};

export default NavProducts;
