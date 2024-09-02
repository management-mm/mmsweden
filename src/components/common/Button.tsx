import React from 'react';

import { type VariantProps, cva } from 'class-variance-authority';

import { cn } from '@utils/cn';

const buttonVariants = cva(
  'w-[100%] md:w-auto font-inter text-[16px] font-semibold leading-tight flex justify-center items-center rounded-[32px] px-[32px] py-[12px] md:py-[16px] font-inter font-semibold text-[16px] leading-tight text-primary',
  {
    variants: {
      intent: {
        accent: 'bg-accent shadow-accent',
        allMachines: 'border border-accent text-accent',
        primary: 'border border-primary',
      },
    },
  }
);

type ButtonProps = VariantProps<typeof buttonVariants> & {
  children: React.ReactNode;
} & { className?: string };

const Button = ({ intent, children, className }: ButtonProps) => {
  return (
    <button className={cn(buttonVariants({ intent }), className)}>
      {children}
    </button>
  );
};

export default Button;
