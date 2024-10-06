import { useTranslation } from 'react-i18next';

import clsx from 'clsx';

import WhyChooseUs from './WhyChooseUs';

import { AboutUs } from '@enums/i18nConstants';

import aboutUsList from '@constants/aboutUsList';

const DetailedAboutUs = () => {
  const { t } = useTranslation();
  return (
    <section className="pb-[105px] lg:pb-[126px]">
      <h2 className="sr-only">About Us | Detailed Overview</h2>
      {aboutUsList.map((item, index) => {
        return (
          <>
            {index === 2 && <WhyChooseUs />}
            <div
              className={clsx(
                'container md:w-[580px] md:max-w-[calc(100%/1.5)] lg:w-[784px]',
                index !== 4 && 'mb-[32px]'
              )}
            >
              <div className="mb-[32px]">
                <h3 className="mb-[18px] text-[18px] font-semibold md:text-[24px]">
                  {t(item.title)}
                </h3>
                <p>{t(item.desc)}</p>
              </div>

              {index === 4 && (
                <>
                  <p className="mb-[32px]">{t(AboutUs.ThankYou)}</p>
                  <p>{t(AboutUs.FeelFree)}</p>
                </>
              )}
            </div>
          </>
        );
      })}
    </section>
  );
};

export default DetailedAboutUs;
