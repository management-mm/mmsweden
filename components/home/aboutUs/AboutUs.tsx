import { useTranslations } from 'next-intl';
import Image from 'next/image';

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
          <div className="mx-auto mb-[22px] shrink-0 lg:mb-0">
            <div className="md:hidden">
              <Image
                src="/images/home/mobile-home-about-us.webp"
                alt="Common photo"
                width={320}
                height={230}
                className="h-[230px] w-full rounded-[4px] bg-slate-500 object-cover"
                sizes="100vw"
              />
            </div>

            <div className="hidden md:block lg:hidden">
              <Image
                src="/images/home/tablet-home-about-us.webp"
                alt="Common photo"
                width={538}
                height={384}
                className="h-[384px] w-[538px] rounded-[4px] bg-slate-500 object-cover"
                sizes="538px"
              />
            </div>

            <div className="hidden lg:block">
              <Image
                src="/images/home/desktop-home-about-us.webp"
                alt="Common photo"
                width={686}
                height={478}
                className="h-[478px] w-[686px] rounded-[4px] bg-slate-500 object-cover"
                sizes="686px"
              />
            </div>
          </div>

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
