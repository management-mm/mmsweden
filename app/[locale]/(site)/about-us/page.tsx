import type { Metadata } from 'next';

import DetailedAboutUs from '@components/aboutUs/DetailedAboutUs';
import Hero from '@components/aboutUs/Hero';

import type { AppLocale } from '@i18n/config';
import { createPageMetadata } from '@i18n/seo';

type Props = {
  params: { locale: AppLocale };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return createPageMetadata({
    locale,
    path: '/about-us',
    title: 'About Us | Meat Machines',
    description:
      'Learn more about Meat Machines and our experience in used food processing and packaging equipment.',
  });
}

const AboutUs = () => {
  return (
    <>
      <Hero />
      <DetailedAboutUs />
    </>
  );
};

export default AboutUs;
