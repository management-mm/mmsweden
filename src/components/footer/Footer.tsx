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
    <footer className="bg-primary py-[32px] text-secondary">
      <div className="container">
        <Logo className="mb-[56px] block" iconClassName="w-[140px] h-[72px]" />

        <MainContacts />

        <WorkingHours />

        <DecorativeLine intent="footer" />
        <Navbar intent="footer" />
        <DecorativeLine intent="footer" />

        <div className="py-[22px]">
          <Address />

          <Map />
          <ViewOnMap />
        </div>

        <DecorativeLine intent="footer" />

        <SocialMediaList />

        <DecorativeLine intent="footer" className="mb-[22px]" />
        <span className="block text-center font-openSans text-[12px] font-normal text-[#F9F7F0]">
          &#169; 2024 All rights reserved
        </span>
      </div>
    </footer>
  );
};

export default Footer;
