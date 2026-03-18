'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import SvgIcon from '@components/common/SvgIcon';

import { cn } from '@utils/cn';

import { IconId } from '@enums/iconsSpriteId';

type NavItemProps = {
  href: string;
  icon: IconId;
  children: React.ReactNode;
};

const NavItem = ({ href, icon, children }: NavItemProps) => {
  const pathname = usePathname();

  const isActive = pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-[12px] py-[8px] pl-[16px]',
        isActive &&
          'bg-secondary-accent fill-secondary text-secondary rounded-[20px]'
      )}
    >
      <SvgIcon iconId={icon} size={{ width: 16, height: 16 }} />
      {children}
    </Link>
  );
};

export default NavItem;
