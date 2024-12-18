import { Helmet } from 'react-helmet-async';

import AboutUs from '@components/home/aboutUs/AboutUs';
import Hero from '@components/home/hero/Hero';
import Industries from '@components/home/industries/Industries';
import LatestArrivals from '@components/home/latestArrivals/LatestArrivals';
import SellToUs from '@components/home/sellToUs/SellToUs';

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Home | Meat Machines</title>
        <meta
          name="description"
          content="Fabriksny utrustning · Krokar, galler & käppar · Bord · Vagnar · Sälj till oss. CHOOSE YOUR LANGUAGE. Copyright @ All Rights Reserved."
        />
        <meta name="keywords" content="equipment, sell, buy" />
      </Helmet>
      <Hero />
      <Industries />
      <AboutUs />
      <SellToUs />
      <LatestArrivals />
    </>
  );
};

export default Home;
