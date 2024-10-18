import { useTranslation } from 'react-i18next';

import NavLinkBtn from '@components/common/NavLinkBtn';
import SvgIcon from '@components/common/SvgIcon';

import { Button, Description } from '@enums/i18nConstants';
import { IconId } from '@enums/iconsSpriteId';
import { cn } from '@utils/cn';

const FirstHeroPart = () => {
  const { t } = useTranslation();
  
  return (
    <div className={cn("min-h-fallback",
      "bg-primary relative md:static h-sm:static md:min-h-0 h-sm:min-h-0 bg-hero-mobile-1x md:bg-hero-tablet-1x lg:bg-hero-desktop-1x bg-cover bg-no-repeat pb-[90px] md:pb-[51px] pt-[90px] md:pt-[184px] retina:bg-hero-mobile-2x md:retina:bg-hero-tablet-2x lg:retina:bg-hero-desktop-2x"
    )}>
      <div className="container">
        <div className="md:mb-[164px] h-sm:mb-[32px]">
          <h1 className="mb-[6px] text-[64px] font-bold leading-tight text-secondary md:text-[84px]">
            Machines Sweden
          </h1>
          <p className="mb-[44px] text-[16px] font-medium leading-normal text-secondary">
            {t(Description.Hero)}
          </p>
          <div className="gap-[30px] md:flex">
            <NavLinkBtn
              intent="accent"
              path="all-products"
              className="mx-0 mb-[22px] shadow-none md:mb-0"
            >
              {t(Button.AllMachines)}
            </NavLinkBtn>
            <NavLinkBtn intent="allMachines" path="new-arrivals">
              {t(Button.NewArrivals)}
            </NavLinkBtn>
          </div>
        </div>
        <a
          className="absolute md:static h-sm:static bottom-[55px] flex min-w-[226px] items-center"
          href="https://www.youtube.com/@meatmachinesswedenab6915"
        >
          <div className="border-main mr-[12px] flex h-[44px] w-[44px] items-center justify-center rounded-full border bg-[rgba(252,252,252,0.12)]">
            <SvgIcon
              className="fill-secondary"
              iconId={IconId.Youtube}
              size={{ width: 20, height: 14 }}
            />
          </div>
          <p className="mr-[12px] text-[14px] font-semibold leading-tight text-secondary">
            {t(Button.WatchOnYoutube)}
          </p>
          <SvgIcon
            className="fill-secondary"
            iconId={IconId.ArrowRight}
            size={{ width: 8, height: 14 }}
          />
        </a>
      </div>
    </div>
  );
};

export default FirstHeroPart;
