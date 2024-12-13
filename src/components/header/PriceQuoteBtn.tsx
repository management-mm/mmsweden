import { useTranslation } from 'react-i18next';

import clsx from 'clsx';

import NavLinkBtn from '@components/common/NavLinkBtn';
import SvgIcon from '@components/common/SvgIcon';

import { selectRequestedProducts } from '@store/selectors';

import { useAppSelector } from '@hooks/useAppSelector';

import { IconId } from '@enums/iconsSpriteId';

const PriceQuoteBtn = () => {
  const requestedProducts = useAppSelector(selectRequestedProducts);
  const { t } = useTranslation();

  return (
    <NavLinkBtn
      intent={'accent'}
      className="h-[38px] w-[48px] p-0 md:h-[48px] md:min-w-[145px] md:px-[14px]"
      path="my-price-quote"
    >
      <div className="relative">
        <SvgIcon
          iconId={IconId.Cart}
          size={{ width: 18, height: 18 }}
          className="fill-primary md:mr-[12px]"
        />
        {requestedProducts.length !== 0 && (
          <span
            className={clsx(
              'absolute rounded-full bg-primary text-center font-inter text-[10px] font-black text-secondary',
              requestedProducts.length > 9
                ? 'right-[-14px] top-[-10px] h-[18px] w-[18px] leading-[18px] md:right-[2px] md:top-[-12px]'
                : 'right-[-10px] top-[-8px] h-[14px] w-[14px] leading-[14px] md:right-[2px]'
            )}
          >
            {requestedProducts.length}
          </span>
        )}
      </div>

      <span className="hidden text-[12px] font-semibold md:inline">
        {t('Button.MyPriceQuote')}
      </span>
    </NavLinkBtn>
  );
};

export default PriceQuoteBtn;
