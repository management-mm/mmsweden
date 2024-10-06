import { useTranslation } from 'react-i18next';

import Slider from './Slider';

import { Description, NavBar } from '@enums/i18nConstants';

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="py-[32px] md:py-[64px]">
      <div className="container">
        <h1 className="mb-[12px] text-center text-[32px] font-bold md:mb-[22px] md:text-[48px]">
          {t(NavBar.AboutUs)}
        </h1>
        <p className="mx-auto mb-[32px] text-[16px] font-medium text-title md:mb-[64px] md:w-[580px] md:text-center lg:w-[784px]">
          {t(Description.AboutUsPage)}
        </p>
      </div>
      <Slider />
    </section>
  );
};

export default Hero;
