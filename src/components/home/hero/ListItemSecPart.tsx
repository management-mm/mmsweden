import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import clsx from 'clsx';

import DecorativeLine from '@components/common/DecorativeLine';

import type { IFactsAndFiguresItem } from '@constants/factsAndFiguresList';

interface IListItemSecPartProps {
  item: IFactsAndFiguresItem;
  index: number;
}

const ListItemSecPart: FC<IListItemSecPartProps> = ({ item, index }) => {
  const { t } = useTranslation();
  return (
    <li
      className={clsx(
        'relative flex items-center justify-center md:mb-0',
        index === 3 ? 'mb-0' : 'mb-[46px]'
      )}
    >
      <div className="w-[166px]">
        <span className="mb-[2px] text-[44px] font-black leading-tight text-primary">
          {item.title}
        </span>
        <p className="text-[12px] font-medium uppercase leading-tight text-desc">
          {t(item.desc)}
        </p>
      </div>
      {index !== 3 && <DecorativeLine intent="factsAndFigures" />}
    </li>
  );
};

export default ListItemSecPart;
