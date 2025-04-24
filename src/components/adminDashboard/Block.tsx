import { useState } from 'react';

import { type VariantProps, cva } from 'class-variance-authority';
import clsx from 'clsx';

import SvgIcon from '@components/common/SvgIcon';

import { cn } from '@utils/cn';

import { IconId } from '@enums/iconsSpriteId';

const titleWrapperVariants = cva('flex items-center justify-between', {
  variants: {
    intent: {
      main: 'px-[20px] mb-[20px]',
      nav: 'px-[12px] py-[10px] mb-[12px] w-full',
      filter: 'py-[10px]',
    },
  },
});
const titleVariants = cva('text-[16px]', {
  variants: {
    intent: {
      main: 'text-primary font-semibold',
      nav: 'font-medium text-tilte',
      filter: 'font-openSans text-[14px] font-semibold text-title',
    },
  },
});
const btnVariants = cva('', {
  variants: {
    intent: {
      main: '',
      nav: 'rounded-full bg-neutral w-[24px] h-[24px] flex items-center justify-center',
      filter: '',
    },
  },
});
const blockVariants = cva('', {
  variants: {
    intent: {
      main: 'border border-t-neutral border-b-secondary border-x-secondary rounded-b-[4px] p-[20px]',
      nav: '',
      filter: '',
    },
  },
});
const blockWrapperVariants = cva(
  'overflow-hidden transition-all duration-500 ease-in-out',
  {
    variants: {
      intent: {
        main: 'w-full lg:w-[548px]',
        nav: 'font-openSans font-semibold text-title',
        filter: 'lg:w-[480px]',
      },
    },
  }
);
type BlockProps = VariantProps<typeof titleWrapperVariants> &
  VariantProps<typeof blockWrapperVariants> &
  VariantProps<typeof titleVariants> &
  VariantProps<typeof btnVariants> &
  VariantProps<typeof blockVariants> & {
    children: React.ReactNode;
  } & { className?: string } & { title: string };

const Block = ({ intent, title, children, className }: BlockProps) => {
  const [isOpen, setIsOpen] = useState(intent === 'filter' ? false : true);

  return (
    <div className={className}>
      <div className={cn(titleWrapperVariants({ intent }))}>
        <h2 className={cn(titleVariants({ intent }))}>{title}</h2>
        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          className={cn(btnVariants({ intent }))}
        >
          <SvgIcon
            iconId={isOpen ? IconId.ArrowTop : IconId.ArrowDown}
            size={{ width: 12, height: 8 }}
            className="fill-title"
          />
        </button>
      </div>

      <div
        className={clsx(
          cn(blockWrapperVariants({ intent })),
          isOpen ? 'max-h-fit' : 'max-h-0'
        )}
      >
        <div className={cn(blockVariants({ intent }))}>{children}</div>
      </div>
    </div>
  );
};

export default Block;
