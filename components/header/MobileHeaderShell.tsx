'use client';

import { useState } from 'react';

import MobileHeader from './MobileHeader';

import MobileMenu from '@components/common/MobileMenu';
import Navbar from '@components/common/Navbar';

const MobileHeaderShell = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <div className="lg:hidden">
      <div className="container">
        <MobileHeader toggleMobileMenu={toggleMobileMenu} />
      </div>

      <MobileMenu
        direction="right"
        isOpen={isOpen}
        handleToggleMenu={toggleMobileMenu}
      >
        <div className="container">
          <div className="flex items-center justify-center">
            <Navbar intent="mobileMenu" />
          </div>
        </div>
      </MobileMenu>
    </div>
  );
};

export default MobileHeaderShell;
