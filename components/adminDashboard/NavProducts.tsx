'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import SvgIcon from '@components/common/SvgIcon';

import { cn } from '@utils/cn';

import { IconId } from '@enums/iconsSpriteId';

const NavProducts = () => {
  const pathname = usePathname();
  const locale = useLocale();

  const adminBasePath = `/${locale}/admin`;

  const links = [
    {
      href: `${adminBasePath}/all-products`,
      icon: IconId.AllProducts,
      iconSize: { width: 18, height: 18 },
      label: 'Product List',
    },
    {
      href: `${adminBasePath}/new-product`,
      icon: IconId.AddProduct,
      iconSize: { width: 18, height: 18 },
      label: 'New Product',
    },
    {
      href: `${adminBasePath}/filters-settings`,
      icon: IconId.Filter,
      iconSize: { width: 14, height: 14 },
      label: 'Filters Settings',
    },
  ];

  const isActive = (href: string) => {
    if (!pathname) {
      return false;
    }

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
      {links.map(({ href, icon, iconSize, label }) => (
        <Link key={href} href={href} className={getClass(href)}>
          <SvgIcon iconId={icon} size={iconSize} />
          {label}
        </Link>
      ))}
    </>
  );
};

export default NavProducts;
