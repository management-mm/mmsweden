import { useTranslations } from 'next-intl';
import Image from 'next/image';

import NavLinkBtn from '@components/common/NavLinkBtn';
import SvgIcon from '@components/common/SvgIcon';

import { cn } from '@utils/cn';

import { Button, Description } from '@enums/i18nConstants';
import { IconId } from '@enums/iconsSpriteId';

const heroDesktop = '/images/heros/desktop-home-bg.webp';

const FirstHeroPart = () => {
  const t = useTranslations();

  return (
    <section
      className={cn('min-h-fallback', 'bg-primary relative overflow-hidden')}
    >
      <div className="absolute inset-0 z-0">
<Image
  src={heroDesktop}
  alt=""
  fill
  priority
  fetchPriority="high"
  sizes="100vw"
  className="object-cover"
/>

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,32,59,0.7)_0%,rgba(0,87,161,0.5)_100%)]" />
      </div>

      <div className="relative z-10 container">
        <div className="flex min-h-[calc(100svh-56px)] flex-col justify-between pt-[90px] pb-[55px] md:block md:min-h-0 md:pt-[184px] md:pb-[51px]">
          <div className="h-sm:mb-[32px] md:mb-[164px]">
            <h1 className="text-secondary mb-[6px] text-[64px] leading-tight font-bold md:text-[84px]">
              Machines Sweden
            </h1>

            <p className="text-secondary mb-[44px] text-[16px] leading-normal font-medium">
              {t(Description.Hero)}
            </p>

            <div className="gap-[30px] md:flex">
              <NavLinkBtn
                intent="accent"
                href="/all-products"
                className="mx-0 mb-[22px] shadow-none md:mb-0"
              >
                {t(Button.AllMachines)}
              </NavLinkBtn>

              <NavLinkBtn intent="allMachines" href="/new-arrivals">
                {t(Button.NewArrivals)}
              </NavLinkBtn>
            </div>
          </div>

          <a
            className="flex min-w-[226px] items-center md:absolute md:bottom-[55px]"
            href="https://www.youtube.com/@meatmachinesswedenab6915"
            target="_blank"
            rel="noreferrer noopener"
          >
            <div className="border-main mr-[12px] flex h-[44px] w-[44px] items-center justify-center rounded-full border bg-[rgba(252,252,252,0.12)]">
              <SvgIcon
                className="fill-secondary"
                iconId={IconId.Youtube}
                size={{ width: 20, height: 14 }}
              />
            </div>

            <p className="text-secondary mr-[12px] text-[14px] leading-tight font-semibold">
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
    </section>
  );
};

export default FirstHeroPart;
