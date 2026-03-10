import type { FC } from 'react';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';

import DecorativeLine from '@components/common/DecorativeLine';
import SvgIcon from '@components/common/SvgIcon';

import { Title } from '@enums/i18nConstants';
import { IconId } from '@enums/iconsSpriteId';

import type { IInstructionsItem } from '@constants/instructionsList';

interface IInstructionsItemProps {
  instructions: IInstructionsItem;
  step: number;
}

const InstructionsItem: FC<IInstructionsItemProps> = ({
  instructions: { iconId, iconSize, title, desc },
  step,
}) => {
  const t = useTranslations();

  return (
    <li className="shadow-card flex flex-col items-center rounded-[4px] px-[14px] pt-[16px] pb-[8px] lg:w-[calc((100%-2*30px)/3)]">
      <span className="bg-secondary mb-[22px] rounded-[32px] px-[12px] py-[2px] text-[12px] font-medium uppercase">
        {t(Title.Step, { number: step })}
      </span>
      <SvgIcon
        className="fill-primary mb-[16px]"
        iconId={IconId[iconId]}
        size={iconSize}
      />
      <h3 className="text-title mb-[12px] text-[18px] font-semibold">
        {t(title)}
      </h3>
      <p className="font-openSans text-desc mb-auto text-[14px]">{t(desc)}</p>

      <div className="flex w-full items-center gap-[6px]">
        <DecorativeLine intent="sellToUs" />

        <div
          className={clsx(
            'flex h-[32px] w-[32px] items-center justify-center rounded-full',
            step === 3 ? 'bg-primary' : 'bg-secondary'
          )}
        >
          {step === 3 ? (
            <SvgIcon
              className="fill-secondary"
              iconId={IconId.Check}
              size={{ width: 12, height: 10 }}
            />
          ) : (
            <>
              <SvgIcon
                className="lg:hidden"
                iconId={IconId.ArrowDown}
                size={{ width: 12, height: 10 }}
              />
              <SvgIcon
                className="hidden lg:block"
                iconId={IconId.ArrowRight}
                size={{ width: 12, height: 10 }}
              />
            </>
          )}
        </div>
      </div>
    </li>
  );
};

export default InstructionsItem;
