import { useTranslation } from 'react-i18next';

import NavLinkBtn from '@components/common/NavLinkBtn';
import SvgIcon from '@components/common/SvgIcon';

import { Button, Description } from '@enums/i18nConstants';
import { IconId } from '@enums/iconsSpriteId';

const FirstHeroPart = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-primary bg-hero-mobile-1x bg-cover bg-no-repeat pb-[51px] pt-[184px] md:bg-hero-tablet-1x lg:bg-hero-desktop-1x retina-mobile:bg-hero-mobile-2x retina-tablet:bg-hero-tablet-2x retina-desktop:bg-hero-desktop-2x">
      <div className="container">
        <div className="mb-[164px]">
          <h1 className="mb-[6px] text-[64px] font-bold leading-tight text-secondary md:text-[84px]">
            Machines Sweden
          </h1>
          <p className="mb-[44px] text-[16px] font-medium leading-normal text-secondary">
            {t(Description.Hero)}
          </p>
          <div className="gap-[30px] md:flex">
            <NavLinkBtn
              intent="accent"
              className="mb-[22px] shadow-none md:mb-0"
              path="all-products"
            >
              {t(Button.NewArrivals)}
            </NavLinkBtn>
            <NavLinkBtn intent="allMachines" path="all-products">
              {t(Button.AllMachines)}
            </NavLinkBtn>
          </div>
        </div>
        <a
          className="flex min-w-[226px] items-center"
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
