import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import clsx from 'clsx';

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
  const { t } = useTranslation();

  return (
    <li className="flex flex-col items-center rounded-[4px] px-[14px] pb-[8px] pt-[16px] shadow-card lg:w-[calc((100%-2*30px)/3)]">
      <span className="mb-[22px] rounded-[32px] bg-secondary px-[12px] py-[2px] text-[12px] font-medium uppercase">
        {t(Title.Step, { number: step })}
      </span>
      <SvgIcon
        className="mb-[16px] fill-primary"
        iconId={IconId[iconId]}
        size={iconSize}
      />
      <h3 className="mb-[12px] text-[18px] font-semibold text-title">
        {t(title)}
      </h3>
      <p className="mb-auto font-openSans text-[14px] text-desc">{t(desc)}</p>

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
