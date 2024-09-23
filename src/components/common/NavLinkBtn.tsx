import React from 'react';
import { NavLink } from 'react-router-dom';

import { type VariantProps, cva } from 'class-variance-authority';

import { cn } from '@utils/cn';

const navLinkBtnVariants = cva(
  'w-[100%] md:w-auto font-inter text-[16px] text-center font-semibold leading-tight flex justify-center items-center rounded-[32px] px-[32px] py-[12px] md:py-[16px] text-primary',
  {
    variants: {
      intent: {
        accent: 'bg-accent shadow-accent',
        shopNow:
          'bg-accent shadow-accent text-primary md:w-0 md:min-w-[143px] mx-auto',
        showMore: 'border border-primary md:w-0 md:min-w-[143px] mx-auto',
        sellToUs: 'bg-accent md:mx-auto md:w-0 md:min-w-[143px]',
        allMachines: 'border border-accent text-accent',
        primary: 'border border-primary',
      },
    },
  }
);

type ButtonProps = VariantProps<typeof navLinkBtnVariants> & {
  children: React.ReactNode;
} & { className?: string } & { path: string };

const NavLinkBtn = ({ intent, children, className, path }: ButtonProps) => {
  return (
    <NavLink
      className={cn(navLinkBtnVariants({ intent }), className)}
      to={path}
    >
      {children}
    </NavLink>
  );
};

export default NavLinkBtn;
