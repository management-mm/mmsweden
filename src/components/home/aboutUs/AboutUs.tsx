import { Trans, useTranslation } from 'react-i18next';

import NavLinkBtn from '@components/common/NavLinkBtn';

import { Button, Description, NavBar } from '@enums/i18nConstants';

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
        <div className="justify-between md:flex md:text-start">
          <img
            className="mb-[22px] w-full rounded-[4px] md:mb-0 md:w-auto md:max-w-[400px]"
            src="/src/assets/images/template.png"
            width="296"
            alt=""
          />
          <div className="about-us-text-btn-wrapper">
            <p className="mb-[32px] font-openSans text-[14px] font-normal text-longDesc">
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
            <NavLinkBtn className="mx-auto" intent="showMore" path="about-us">
              {t(Button.ShowMore)}
            </NavLinkBtn>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
