import Button from '@components/common/Button';
import SvgIcon from '@components/common/SvgIcon';

import { IconId } from '@enums/iconsSpriteId';

const PriceQuoteBtn = () => {
  return (
    <Button
      intent={'accent'}
      className="h-[38px] w-[48px] md:h-[48px] md:w-[145px]"
    >
      <div className="relative">
        <SvgIcon
          iconId={IconId.Cart}
          size={{ width: 16, height: 16 }}
          className="fill-primary"
        />
        <span className="absolute right-[-12px] top-[-12px] flex h-[15px] w-[15px] items-center justify-center rounded-full bg-secondaryAccent font-inter text-[10px] font-black text-secondary">
          0
        </span>
      </div>

      <span className="hidden md:inline">My Price Quote</span>
    </Button>
  );
};

export default PriceQuoteBtn;
