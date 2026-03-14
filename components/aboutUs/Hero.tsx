import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';

import Loader from '@components/common/loaders/Loader';

import { Description, NavBar } from '@enums/i18nConstants';

const Slider = dynamic(() => import('./Slider'), { loading: () => <Loader /> });

const Hero = () => {
  const t = useTranslations();

  return (
    <section className="py-[32px] md:pt-[22px] md:pb-[64px]">
      <div className="container">
        <h1 className="mb-[12px] text-center text-[32px] font-bold md:mb-[22px] md:text-[48px]">
          {t(NavBar.AboutUs)}
        </h1>
        <p className="text-title mx-auto mb-[32px] text-[16px] font-medium md:mb-[64px] md:w-[580px] md:text-center lg:w-[784px]">
          {t(Description.AboutUsPage)}
        </p>
      </div>
      <Slider />
    </section>
  );
};

export default Hero;
