import { useTranslations } from 'next-intl';
import clsx from 'clsx';

import DecorativeLine from '@components/common/DecorativeLine';
import SvgIcon from '@components/common/SvgIcon';

import { cn } from '@utils/cn';
import { IconId } from '@enums/iconsSpriteId';

import whyChooseUsList, {
  type IWhyChooseUsItem,
} from '@constants/whyChooseUsList';

const WhyChooseUs = () => {
  const t = useTranslations();

  return (
    <div className="bg-primary mb-[32px] bg-[linear-gradient(90deg,rgba(0,32,59,1)0%,rgba(0,87,161,1)100%)] py-[54px]">
      <h3 className="sr-only">Why choose us</h3>

      <ul className="px-auto container flex max-w-[calc(100%/1.2)] flex-col md:max-w-[768px] md:flex-row lg:max-w-[calc(100%/1.2)] lg:justify-center">
        {whyChooseUsList.map((item: IWhyChooseUsItem, index) => {
          const translatedTitle =
            item.title === '20+' ? item.title : t(item.title);

          return (
            <li
              key={`${item.title}-${index}`}
              className={clsx(
                'relative flex items-center md:mb-0',
                index === 2 ? 'mb-0' : 'mb-[46px]'
              )}
            >
              <SvgIcon
                className={cn('shrink-0', item.iconClassName)}
                iconId={IconId[item.iconId]}
                size={item.iconSize}
              />

              <div>
                <h2 className="text-secondary text-[22px] font-black">
                  {translatedTitle}
                </h2>
                <p className="text-secondary text-[12px] font-medium uppercase">
                  {t(item.desc)}
                </p>
              </div>

              {index !== 2 && (
                <DecorativeLine
                  intent="factsAndFigures"
                  className="w-full border-[rgba(252,252,252,.2)] md:mx-[32px] lg:mx-[64px]"
                />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default WhyChooseUs;