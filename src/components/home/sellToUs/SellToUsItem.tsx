import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import DecorativeLine from '@components/common/DecorativeLine';
import SvgIcon from '@components/common/SvgIcon';

import { cn } from '@utils/cn';

import { IconId } from '@enums/iconsSpriteId';

import type { ISellToUsItem } from '@constants/sellToUsList';

const SellToUsItem: FC<ISellToUsItem> = ({
  iconId,
  iconSize,
  iconClassName,
  title,
  desc,
  className,
}) => {
  const { t } = useTranslation();

  return (
    <li
      className={cn(
        'relative flex min-h-[352px] flex-col items-center justify-center rounded-[4px] bg-[rgba(252,252,252,0.06)] px-[14px] md:min-h-[268px] lg:min-h-[220px] lg:items-start lg:justify-start lg:pt-[25px]',
        className
      )}
    >
      <div className="mb-[12px] flex flex-col items-center justify-center md:mb-[22px] md:flex md:gap-[16px] lg:flex-row">
        <SvgIcon
          className={cn('mb-[14px] fill-secondary md:mb-0', iconClassName)}
          iconId={IconId[iconId]}
          size={iconSize}
        />
        <h3 className="text-[18px] font-semibold leading-tight md:text-[24px]">
          {t(title)}
        </h3>
      </div>
      <p className="font-openSans text-[16px] font-normal leading-normal text-secondaryDesc lg:text-[18px]">
        {t(desc)}
      </p>
      <DecorativeLine intent="sellToUsSecondary" />
    </li>
  );
};

export default SellToUsItem;
