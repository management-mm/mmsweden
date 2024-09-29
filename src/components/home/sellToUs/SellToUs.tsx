import { Trans, useTranslation } from 'react-i18next';

import SellToUsItem from './SellToUsItem';

import NavLinkBtn from '@components/common/NavLinkBtn';

import { cn } from '@utils/cn';

import { Description, NavBar } from '@enums/i18nConstants';

import sellToUsList from '@constants/sellToUsList';

const SellToUs = () => {
  const { t } = useTranslation();
  return (
    <section className="bg-primary py-[80px] text-center lg:text-start">
      <div
        className={cn(
          'container',
          'text-secondary md:items-center lg:flex lg:gap-[33px]'
        )}
      >
        <div className="lg:w-[457px]">
          <h2 className="mb-[22px] text-[48px] font-bold leading-tight">
            {t(NavBar.SellToUs)}
          </h2>
          <p className="mb-[32px] text-[16px] font-medium leading-normal">
            <Trans i18nKey={Description.SellToUs}>
              Stop storing thousands of dollars in your warehouses when the
              price of your idle equipment decreases every year. <br />
              So what are you waiting for?
            </Trans>
          </p>
          <NavLinkBtn
            intent="sellToUs"
            className="hidden lg:block"
            path="sell-to-us"
          >
            Sell to Us
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
        <NavLinkBtn intent="sellToUs" className="lg:hidden" path="sell-to-us">
          {t(NavBar.SellToUs)}
        </NavLinkBtn>
      </div>
    </section>
  );
};

export default SellToUs;
