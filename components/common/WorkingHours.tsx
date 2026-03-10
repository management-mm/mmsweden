import type { FC } from 'react';

import { useTranslations } from 'next-intl';

import SvgIcon from './SvgIcon';

import { cn } from '@utils/cn';

import { ContactUs } from '@enums/i18nConstants';
import { IconId } from '@enums/iconsSpriteId';

interface IWorkingHoursProps {
  containerClassName?: string;
  iconClassName?: string;
}

const WorkingHours: FC<IWorkingHoursProps> = ({
  containerClassName,
  iconClassName,
}) => {
  const t = useTranslations();

  return (
    <div className={cn('mb-[22px] flex', containerClassName)}>
      <SvgIcon
        className={cn('fill-secondary mr-[9px]', iconClassName)}
        iconId={IconId.Clock}
        size={{ width: 18, height: 18 }}
      />
      <p>
        {t(ContactUs.WorkingHours)} <br /> {t(ContactUs.MonFri)}{' '}
        <span className="font-semibold">09:00 - 17:00</span>
      </p>
    </div>
  );
};

export default WorkingHours;
