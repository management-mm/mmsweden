'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import SvgIcon from '@components/common/SvgIcon';

import useWindowWidth from '@hooks/useWindowWidth';

import { cn } from '@utils/cn';

import { IconId } from '@enums/iconsSpriteId';

const BackBtn = () => {
  const pathname = usePathname();
  const windowWidth = useWindowWidth();

  let title = '';

  if (/^\/admin\/all-products\/edit-product\/[a-zA-Z0-9]+$/.test(pathname)) {
    title = 'Product Change';
  } else if (pathname === '/admin/new-product') {
    title = 'Add New Product';
  } else if (pathname === '/admin/filters-settings') {
    title = 'Filters Settings';
  }

  return (
    <div
      className={cn(
        'flex items-center gap-[12px]',
        windowWidth < 1178 && 'container'
      )}
    >
      <Link
        href="/admin/all-products"
        className="border-primary flex h-[52px] w-[52px] items-center justify-center rounded-full border"
      >
        <SvgIcon iconId={IconId.ArrowLeft} size={{ width: 16, height: 16 }} />
      </Link>

      <div>
        <p className="font-openSans text-desc">Back to List</p>
        <h1 className="text-primary text-[24px] font-semibold">{title}</h1>
      </div>
    </div>
  );
};

export default BackBtn;
