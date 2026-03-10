import type { FC } from 'react';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';

import DecorativeLine from '@components/common/DecorativeLine';

import type { IFactsAndFiguresItem } from '@constants/factsAndFiguresList';

interface IListItemSecPartProps {
  item: IFactsAndFiguresItem;
  index: number;
}

const ListItemSecPart: FC<IListItemSecPartProps> = ({ item, index }) => {
  const t = useTranslations();
  return (
    <li
      className={clsx(
        'relative flex items-center justify-center md:mb-0',
        index === 3 ? 'mb-0' : 'mb-[46px]'
      )}
    >
      <div className="max-w-[200px] text-center">
        <span className="text-primary mb-[2px] text-[44px] leading-tight font-black">
          {item.title}
        </span>
        <p className="text-desc text-[12px] leading-tight font-medium uppercase">
          {t(item.desc)}
        </p>
      </div>
      {index !== 3 && <DecorativeLine intent="factsAndFigures" />}
    </li>
  );
};

export default ListItemSecPart;
