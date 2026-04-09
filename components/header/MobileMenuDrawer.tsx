'use client';

import React from 'react';

import MobileMenu from '@components/common/MobileMenu';
import Navbar from '@components/common/Navbar';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function MobileMenuDrawer({ isOpen, onClose }: Props) {
  return (
    <MobileMenu direction="right" isOpen={isOpen} handleToggleMenu={onClose}>
      <div className="container">
        <div className="flex items-center justify-center">
          <Navbar intent="mobileMenu" />
        </div>
      </div>
    </MobileMenu>
  );
}
