'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import SvgIcon from '@components/common/SvgIcon';

import { cn } from '@utils/cn';

import { IconId } from '@enums/iconsSpriteId';

const NavGeneral = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (!pathname) return false;
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <>
      <Link
        href="/admin/email-newsletter"
        className={cn(
          'flex items-center gap-[12px] py-[8px] pl-[16px]',
          isActive('/admin/email-newsletter') &&
            'bg-secondary-accent fill-secondary text-secondary rounded-[20px]'
        )}
      >
        <SvgIcon iconId={IconId.Email} size={{ width: 16, height: 16 }} />
        Email newsletter
      </Link>

      <Link
        href="/admin/settings"
        className={cn(
          'flex items-center gap-[12px] py-[8px] pl-[16px]',
          isActive('/admin/settings') &&
            'bg-secondary-accent fill-secondary text-secondary rounded-[20px]'
        )}
      >
        <SvgIcon iconId={IconId.Settings} size={{ width: 16, height: 16 }} />
        Settings
      </Link>
    </>
  );
};

export default NavGeneral;
