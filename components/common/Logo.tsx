'use client';

import type { FC } from 'react';

import Link from 'next/link';

import SvgIcon from './SvgIcon';

import { cn } from '@utils/cn';

import { IconId } from '@enums/iconsSpriteId';

interface ILogogProps {
  className?: string;
  iconClassName?: string;
}

export const Logo: FC<ILogogProps> = ({ className, iconClassName }) => {
  return (
    <Link href="/" className={className}>
      <SvgIcon
        iconId={IconId.Logo}
        size={{ width: 94, height: 48 }}
        className={cn('md:h-[84px] md:w-[166px]', iconClassName)}
      />
    </Link>
  );
};
