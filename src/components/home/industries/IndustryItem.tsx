import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import DecorativeLine from '@components/common/DecorativeLine';
import SvgIcon from '@components/common/SvgIcon';

import { cn } from '@utils/cn';

import { IconId } from '@enums/iconsSpriteId';

import type { IIndustryItem } from '@constants/industriesList';

const IndustryItem: FC<IIndustryItem> = ({
  iconId,
  iconSize,
  title,
  desc,
  className,
}) => {
  const { t } = useTranslation();

  return (
    <li
      className={cn(
        'relative flex h-[316px] flex-col items-center justify-center rounded-[4px] px-[14px] py-[14px] shadow-card md:w-[calc((100%-30px)/2)] lg:w-[calc((100%-2*30px)/3)]',
        className
      )}
    >
      <SvgIcon
        className="mb-[12px] fill-primary"
        iconId={IconId[iconId]}
        size={iconSize}
      />
      <h3 className="mb-[12px] text-[24px] font-semibold text-title">
        {t(title)}
      </h3>
      <p className="text-des">{t(desc)}</p>
      <DecorativeLine intent="primary" />
    </li>
  );
};

export default IndustryItem;
