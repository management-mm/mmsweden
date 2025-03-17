import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import clsx from 'clsx';

import ConditionItem from './ConditionItem';

import SvgIcon from '@components/common/SvgIcon';

import { Filter } from '@enums/i18nConstants';
import { IconId } from '@enums/iconsSpriteId';

const Condition = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <fieldset>
      <div
        className="flex items-center justify-between py-[10px]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <legend className="font-openSans text-[14px] font-semibold text-title">
          {t(Filter.Condition)}
        </legend>

        <SvgIcon
          iconId={isOpen ? IconId.ArrowTop : IconId.ArrowDown}
          size={{ width: 10, height: 10 }}
        />
      </div>

      <div
        className={clsx(
          'flex h-[150px] flex-col gap-[16px] overflow-hidden transition-all duration-500 ease-in-out',
          isOpen ? 'max-h-[150px]' : 'max-h-0'
        )}
      >
        <ConditionItem condition="new" />
        <ConditionItem condition="used" />
      </div>
    </fieldset>
  );
};

export default Condition;
