import { type VariantProps, cva } from 'class-variance-authority';

import { cn } from '@utils/cn';

const lineVariants = cva('border-[1.5px] rounded-[12px] w-[calc(100%-28px)]', {
  variants: {
    intent: {
      primary: 'absolute bottom-[14px] border-line',
      product: 'border-line mb-[14px] w-full',
      video: 'border-neutral w-full mb-[22px]',
      sellToUs:
        'border-0 border-b-[1px] border-dashed border-primary w-[calc(100%-38px)]',
      footer: 'w-full border-footerLine',
      myPriceQuote: 'border-pagination w-full rounded-none border-[1px]',
      sellToUsSecondary: 'absolute bottom-[14px] border-[rgba(48,252,192,0.2)]',
      latestArrivals:
        'hidden md:block border-y-[0.5px] border-x-0 border-dashed border-line w-[calc(100%-265px)]',
      factsAndFigures:
        'absolute border-line bottom-[-22px] w-[152px] md:border-0 md:border-x-[1px] md:w-0 md:h-[26px] md:static md:mx-[64px]',
    },
  },
  defaultVariants: {
    intent: 'primary',
  },
});

type DecorativeLineProps = VariantProps<typeof lineVariants> & {
  className?: string;
};

const DecorativeLine = ({ intent, className }: DecorativeLineProps) => {
  return <div className={cn(lineVariants({ intent }), className)} />;
};

export default DecorativeLine;
