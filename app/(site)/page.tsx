import type { Metadata } from 'next';

import AboutUs from '@components/home/aboutUs/AboutUs';
import Hero from '@components/home/hero/Hero';
import Industries from '@components/home/industries/Industries';
import LatestArrivals from '@components/home/latestArrivals/LatestArrivals';
import SellToUs from '@components/home/sellToUs/SellToUs';

export const metadata: Metadata = {
  title: 'Home | Meat Machines',
  description:
    'Fabriksny utrustning · Krokar, galler & käppar · Bord · Vagnar · Sälj till oss. CHOOSE YOUR LANGUAGE. Copyright @ All Rights Reserved.',
  keywords: ['equipment', 'sell', 'buy'],
};

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
