import { Trans, useTranslation } from 'react-i18next';

import NavLinkBtn from '@components/common/NavLinkBtn';

import { Button, Description, NavBar } from '@enums/i18nConstants';
import mobile from '@assets/images/home/mobile-home-about-us.webp';
import mobile2x from '@assets/images/home/mobile-home-about-us@2x.webp';
import mobile3x from '@assets/images/home/mobile-home-about-us@3x.webp';
import tablet from '@assets/images/home/tablet-home-about-us.webp';
import tablet2x from '@assets/images/home/tablet-home-about-us@2x.webp';
import tablet3x from '@assets/images/home/tablet-home-about-us@3x.webp';
import desktop from '@assets/images/home/desktop-home-about-us.webp';
import desktop2x from '@assets/images/home/desktop-home-about-us@2x.webp';
import desktop3x from '@assets/images/home/desktop-home-about-us@3x.webp';

const AboutUs = () => {
  const { t } = useTranslation();
  
  return (
    <section className="pb-[48px] md:pb-[84px]">
      <div className="container text-center">
        <h2 className="color-title mb-[6px] text-[32px] font-bold leading-tight md:text-[48px]">
          {t(NavBar.AboutUs)}
        </h2>
        <p className="mb-[32px] text-[14px] font-medium leading-normal text-desc md:mb-[48px] md:text-[16px]">
          {t(Description.AboutUsShort)}
        </p>
        <div className="text-center lg:flex lg:justify-between lg:gap-[32px] lg:text-start">
          <picture>
            <source
              srcSet={`${desktop} 1x, ${desktop2x} 2x, ${desktop3x} 3x`}
              media="(min-width: 1178px)"
              type="image/webp"
            />

            <source
              srcSet={`${tablet} 1x, ${tablet2x} 2x, ${tablet3x} 3x`}
              media="(min-width: 768px)"
              type="image/webp"
            />
            <source
              srcSet={`${mobile} 1x, ${mobile2x} 2x, ${mobile3x} 3x`}
              media="(max-width: 767px)"
              type="image/webp"
            />
            <img
              src={mobile}
              alt="Common photo"
              width="100%"
              className="mx-auto mb-[22px] h-[230px] shrink-0 rounded-[4px] bg-slate-500 md:h-[384px] md:w-[538px] lg:mb-0 lg:h-[478px] lg:w-[686px]"
            />
          </picture>

          <div className="about-us-text-btn-wrapper lg:w-[392px]">
            <p className="mb-[10px] font-openSans text-[14px] font-normal text-longDesc md:text-[16px]">
              <Trans i18nKey={Description.AboutUsLong}>
                <span className="mb-[22px] inline-block">
                  Since 2003, Meat Machines has been your trusted source for
                  high-quality used food processing and packing machinery. With
                  nearly 2,000 pieces in our four southern Sweden warehouses, we
                  ensure top-tier equipment of the best manufacturers.
                </span>
                <span className="mb-[22px] inline-block">
                  Our team of over 10 skilled professionals, including
                  experienced electricians and mechanics, meticulously maintains
                  each unit. Thousands of happy customers worldwide trust us for
                  our reliability, quality, and competitive prices.
                </span>
                <span>
                  Let us help your business thrive with machinery you can rely
                  on!
                </span>
              </Trans>
            </p>
            <NavLinkBtn intent="showMore" path="about-us">
              {t(Button.ShowMore)}
            </NavLinkBtn>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
