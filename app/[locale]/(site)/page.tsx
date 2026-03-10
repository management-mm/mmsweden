import type { Metadata } from 'next';

import AboutUs from '@components/home/aboutUs/AboutUs';
import Hero from '@components/home/hero/Hero';
import Industries from '@components/home/industries/Industries';
import LatestArrivals from '@components/home/latestArrivals/LatestArrivals';
import SellToUs from '@components/home/sellToUs/SellToUs';

import type { AppLocale } from '@i18n/config';
import { createPageMetadata } from '@i18n/seo';

type Props = {
  params: Promise<{ locale: AppLocale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return createPageMetadata({
    locale,
    path: '/',
    title: 'Home | Meat Machines',
    description:
      'Fabriksny utrustning · Krokar, galler & käppar · Bord · Vagnar · Sälj till oss.',
    keywords: ['equipment', 'sell', 'buy'],
  });
}

const HomePage = () => {
  return (
    <>
      <Hero />
      <Industries />
      <AboutUs />
      <SellToUs />
      <LatestArrivals />
    </>
  );
};

export default HomePage;
