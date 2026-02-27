import { type VariantProps, cva } from 'class-variance-authority';

import SvgIcon from '@components/common/SvgIcon';

import { cn } from '@utils/cn';

import { IconId } from '@enums/iconsSpriteId';

const ArrowVariants = cva(
  'flex h-[44px] w-[44px] items-center justify-center rounded-full cursor-pointer',
  {
    variants: {
      intent: {
        recommended: 'border border-line',
        details:
          'absolute top-1/2 z-[2] -translate-y-1/2 transform border-0 bg-[rgba(35,35,35,.3)]',
      },
    },
    defaultVariants: {
      intent: 'recommended',
    },
  }
);

type NaviArrowSliderProps = VariantProps<typeof ArrowVariants> & {
  className?: string;
  iconClassName?: string;
  onClick: () => void;
  iconId: keyof typeof IconId;
};

const NaviArrowSlider = ({
  className,
  intent,
  iconClassName,
  onClick,
  iconId,
}: NaviArrowSliderProps) => {
  return (
    <div className={cn(ArrowVariants({ intent }), className)} onClick={onClick}>
      <SvgIcon
        className={cn('fill-primary', iconClassName)}
        iconId={IconId[iconId]}
        size={{ width: 13, height: 18 }}
      />
    </div>
  );
};

export default NaviArrowSlider;
