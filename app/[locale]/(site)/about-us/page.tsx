import type { Metadata } from 'next';

import DetailedAboutUs from '@components/aboutUs/DetailedAboutUs';
import Hero from '@components/aboutUs/Hero';

import type { AppLocale } from '@i18n/config';
import { getPageSeo } from '@i18n/pageSeo';
import { createPageMetadata } from '@i18n/seo';

type Props = {
  params: Promise<{ locale: AppLocale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const seo = getPageSeo('aboutUs', locale);

  return createPageMetadata({
    locale,
    path: '/about-us',
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
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
