import React from 'react';
import { NavLink } from 'react-router-dom';

import { type VariantProps, cva } from 'class-variance-authority';

import { cn } from '@utils/cn';

const navLinkBtnVariants = cva(
  'w-[100%] inline-block md:w-auto mx-auto font-inter text-[16px] text-center font-semibold leading-tight  rounded-[32px] px-[32px] py-[12px] md:py-[16px] text-primary',
  {
    variants: {
      intent: {
        accent:
          'bg-accent shadow-none hover:shadow-accent text-primary transition-boxShadow duration-250 flex justify-center items-center',
        shopNow:
          'bg-accent shadow-none hover:shadow-accent text-primary transition-boxShadow duration-500 mx-auto h-[44px] md:h-[52px]',
        goToProducts: 'bg-accent text-primary mx-auto h-[44px] md:h-[52px]',
        addMore: 'border border-primary w-auto h-[44px] md:h-[52px]',
        showMore:
          'border bg-transparent hover:bg-primary hover:text-secondary transition-colors duration-500 border-primary md:mx-auto',
        sellToUs: 'bg-accent md:mx-auto h-[44px] md:h-[52px]',
        allMachines: 'border border-accent text-accent mx-0',
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
