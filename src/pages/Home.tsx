import AboutUs from '@components/home/aboutUs/AboutUs';
import Hero from '@components/home/hero/Hero';
import Industries from '@components/home/industries/Industries';
import LatestArrivals from '@components/home/latestArrivals/LatestArrivals';
import SellToUs from '@components/home/sellToUs/SellToUs';

const Home = () => {
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

export default Home;
