import Map from './Map';
import SocialMediaList from './SocialMediaList';

import Address from '@components/common/Address';
import DecorativeLine from '@components/common/DecorativeLine';
import { Logo } from '@components/common/Logo';
import MainContacts from '@components/common/MainContacts';
import Navbar from '@components/common/Navbar';
import ViewOnMap from '@components/common/ViewOnMap';
import WorkingHours from '@components/common/WorkingHours';

const Footer = () => {
  return (
    <footer className="min-h-[400px] bg-primary py-[32px] text-secondary">
      <div className="container">
        <div className="lg:flex lg:items-baseline lg:justify-between">
          <div>
            <Logo
              className="mb-[56px] block lg:mb-[12px]"
              iconClassName="w-[140px] h-[72px]"
            />
            <MainContacts />
            <WorkingHours />
            <SocialMediaList
              className="hidden lg:flex lg:flex-col lg:items-start lg:justify-start lg:gap-[22px]"
              showTitle={true}
            />
          </div>
          <DecorativeLine intent="footer" className="lg:hidden" />
          <Navbar intent="footer" />
          <DecorativeLine intent="footer" className="lg:hidden" />
          <div className="py-[22px] lg:w-[639px]">
            <div className="lg:mb-[12px] lg:flex lg:items-end lg:justify-between">
              <Address containerClassName="lg:mb-0" />
              <ViewOnMap className="hidden lg:flex" />
            </div>

            <Map />
            <ViewOnMap className="lg:hidden" />
          </div>
        </div>

        <DecorativeLine intent="footer" className="lg:hidden" />

        <SocialMediaList className="lg:hidden" />

        <DecorativeLine intent="footer" className="mb-[22px]" />
        <span className="block text-center font-openSans text-[12px] font-normal text-[#F9F7F0]">
          &#169; 2024 All rights reserved
        </span>
      </div>
    </footer>
  );
};

export default Footer;
