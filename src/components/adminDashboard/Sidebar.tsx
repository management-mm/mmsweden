import { useState } from 'react';
import { NavLink } from 'react-router-dom';

import Nav from './Nav';

import { Logo } from '@components/common/Logo';
import SvgIcon from '@components/common/SvgIcon';

import { cn } from '@utils/cn';

import { IconId } from '@enums/iconsSpriteId';

const Sidebar = () => {
  return (
    <aside className="max-h-100lvh hidden w-[280px] border-r-2 border-neutral px-[18px] pt-[14px] blur-[130] lg:block">
      <Logo className="mb-[60px] flex justify-center" />
      <Nav />
    </aside>
  );
};

export default Sidebar;
