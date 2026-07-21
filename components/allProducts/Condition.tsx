'use client';

import { useId, useState } from 'react';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';

import ConditionItem from './ConditionItem';

import SvgIcon from '@components/common/SvgIcon';

import { Filter } from '@enums/i18nConstants';
import { IconId } from '@enums/iconsSpriteId';

const Condition = () => {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();
  const t = useTranslations();

  const title = t(Filter.Condition);

  return (
    <fieldset>
      <legend className="sr-only">{title}</legend>

      <button
        type="button"
        className="flex w-full items-center justify-between py-[10px]"
        onClick={() => setIsOpen(currentValue => !currentValue)}
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        <span className="font-openSans text-title text-[14px] font-semibold">
          {title}
        </span>

        <SvgIcon
          iconId={isOpen ? IconId.ArrowTop : IconId.ArrowDown}
          size={{ width: 10, height: 10 }}
        />
      </button>

      <div
        id={panelId}
        className={clsx(
          'flex flex-col gap-[16px] overflow-hidden transition-all duration-500 ease-in-out',
          isOpen ? 'max-h-[150px] pb-[10px] opacity-100' : 'max-h-0 opacity-0'
        )}
        aria-hidden={!isOpen}
      >
        <ConditionItem condition="new" />
        <ConditionItem condition="used" />
      </div>
    </fieldset>
  );
};

export default Condition;
