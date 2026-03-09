import { useTranslations } from 'next-intl';

import SellToUsItem from './SellToUsItem';

import NavLinkBtn from '@components/common/NavLinkBtn';

import { cn } from '@utils/cn';

import { Description, NavBar } from '@enums/i18nConstants';

import sellToUsList from '@constants/sellToUsList';

const SellToUs = () => {
  const t = useTranslations();

  return (
    <section className="bg-primary py-[80px] text-center lg:text-start">
      <div
        className={cn(
          'container',
          'text-secondary md:items-center lg:flex lg:gap-[33px]'
        )}
      >
        <div className="lg:w-[457px]">
          <h2 className="mb-[22px] text-[48px] leading-tight font-bold">
            {t(NavBar.SellToUs)}
          </h2>

          <div className="mb-[32px] text-[16px] leading-normal font-medium">
            {t.rich(Description.SellToUs, {
              br: () => <br />,
            })}
          </div>

          <NavLinkBtn
            intent="sellToUs"
            className="hidden lg:inline-block"
            href="/sell-to-us"
          >
            {t(NavBar.SellToUs)}
          </NavLinkBtn>
        </div>

        <ul className="mb-[22px] md:mx-auto md:w-[calc(100%-200px)] lg:mx-0 lg:mb-0 lg:w-[656px]">
          {sellToUsList.map(sellToUsItem => {
            const { iconId, iconSize, iconClassName, title, desc, className } =
              sellToUsItem;

            return (
              <SellToUsItem
                key={title}
                iconId={iconId}
                iconClassName={iconClassName}
                iconSize={iconSize}
                title={title}
                desc={desc}
                className={className}
              />
            );
          })}
        </ul>

        <NavLinkBtn intent="sellToUs" className="lg:hidden" href="/sell-to-us">
          {t(NavBar.SellToUs)}
        </NavLinkBtn>
      </div>
    </section>
  );
};

export default SellToUs;