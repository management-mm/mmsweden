import { getLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';

import NavLinkBtn from '@components/common/NavLinkBtn';

import { Button, Description, NavBar } from '@enums/i18nConstants';

const AboutUs = async () => {
  const t = await getTranslations();
  const locale = await getLocale();

  return (
    <section>
      <div className="container">
        {/* Section heading */}
        <div className="text-center">
          <h2 className="color-title mb-[6px] text-[32px] leading-tight font-bold md:text-[48px]">
            {t(NavBar.AboutUs)}
          </h2>

          <p className="text-desc mb-[32px] text-[14px] leading-normal font-medium md:mb-[48px] md:text-[16px]">
            {t(Description.AboutUsShort)}
          </p>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-[22px] lg:grid lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-start lg:gap-[32px]">
          {/* Images */}
          <div className="w-full min-w-0">
            {/* Mobile */}
            <div className="md:hidden">
              <Image
                src="/images/home/mobile-home-about-us.webp"
                alt="Meat Machines Sweden team"
                width={320}
                height={230}
                unoptimized
                sizes="100vw"
                className="aspect-[320/230] h-auto w-full rounded-[4px] object-cover"
              />
            </div>

            {/* Tablet */}
            <div className="hidden md:block lg:hidden">
              <Image
                src="/images/home/tablet-home-about-us.webp"
                alt="Meat Machines Sweden team"
                width={538}
                height={384}
                unoptimized
                sizes="(max-width: 1023px) 100vw, 538px"
                className="aspect-[538/384] h-auto w-full rounded-[4px] object-cover"
              />
            </div>

            {/* Desktop */}
            <div className="hidden lg:block">
              <Image
                src="/images/home/desktop-home-about-us.webp"
                alt="Meat Machines Sweden team"
                width={686}
                height={478}
                unoptimized
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="aspect-[686/478] h-auto w-full rounded-[4px] object-cover"
              />
            </div>
          </div>

          {/* Text content */}
          <div className="about-us-text-btn-wrapper flex w-full min-w-0 flex-col items-center text-center lg:items-start lg:text-left">
            <div className="font-openSans text-longDesc mb-[10px] w-full text-[14px] leading-relaxed font-normal md:text-[16px]">
              {t.rich(Description.AboutUsLong, {
                p1: chunks => <span className="mb-[22px] block">{chunks}</span>,
                p2: chunks => <span className="mb-[22px] block">{chunks}</span>,
                p3: chunks => <span className="block">{chunks}</span>,
              })}
            </div>

            <NavLinkBtn intent="showMore" href={`/${locale}/about-us`}>
              {t(Button.ShowMore)}
            </NavLinkBtn>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
