import { useTranslations } from 'next-intl';

import NavLinkBtn from '@components/common/NavLinkBtn';

import { Button, Description, NavBar } from '@enums/i18nConstants';

const AboutUs = () => {
  const t = useTranslations();

  return (
    <section className="pb-[48px] md:pb-[84px]">
      <div className="container text-center">
        <h2 className="color-title mb-[6px] text-[32px] leading-tight font-bold md:text-[48px]">
          {t(NavBar.AboutUs)}
        </h2>

        <p className="text-desc mb-[32px] text-[14px] leading-normal font-medium md:mb-[48px] md:text-[16px]">
          {t(Description.AboutUsShort)}
        </p>

        <div className="text-center lg:flex lg:justify-between lg:gap-[32px] lg:text-start">
          <picture>
            <source
              srcSet="/images/home/desktop-home-about-us.webp 1x, /images/home/desktop-home-about-us@2x.webp 2x, /images/home/desktop-home-about-us@3x.webp 3x"
              media="(min-width: 1178px)"
              type="image/webp"
            />
            <source
              srcSet="/images/home/tablet-home-about-us.webp 1x, /images/home/tablet-home-about-us@2x.webp 2x, /images/home/tablet-home-about-us@3x.webp 3x"
              media="(min-width: 768px)"
              type="image/webp"
            />
            <source
              srcSet="/images/home/mobile-home-about-us.webp 1x, /images/home/mobile-home-about-us@2x.webp 2x, /images/home/mobile-home-about-us@3x.webp 3x"
              media="(max-width: 767px)"
              type="image/webp"
            />

            <img
              src="/images/home/mobile-home-about-us.webp"
              alt="Common photo"
              className="mx-auto mb-[22px] h-[230px] w-full shrink-0 rounded-[4px] bg-slate-500 md:h-[384px] md:w-[538px] lg:mb-0 lg:h-[478px] lg:w-[686px]"
              loading="lazy"
            />
          </picture>

          <div className="about-us-text-btn-wrapper lg:w-[392px]">
            <div className="font-openSans text-longDesc mb-[10px] text-[14px] font-normal md:text-[16px]">
              {t.rich(Description.AboutUsLong, {
                p1: chunks => (
                  <span className="mb-[22px] inline-block">{chunks}</span>
                ),
                p2: chunks => (
                  <span className="mb-[22px] inline-block">{chunks}</span>
                ),
                p3: chunks => <span>{chunks}</span>,
              })}
            </div>

            <NavLinkBtn intent="showMore" href="/about-us">
              {t(Button.ShowMore)}
            </NavLinkBtn>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;