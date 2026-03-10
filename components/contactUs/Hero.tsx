import { useTranslations } from 'next-intl';

import { Description, NavBar } from '@enums/i18nConstants';

const Hero = () => {
  const t = useTranslations();

  return (
    <section className="text-center">
      <div className="container">
        <h1 className="text-title mb-[12px] text-[32px] font-bold md:text-[48px]">
          {t(NavBar.ContactUs)}
        </h1>
        <p className="text-desc mb-[32px] text-[14px] font-medium">
          {t(Description.ContactUs)}
        </p>
      </div>
    </section>
  );
};

export default Hero;
