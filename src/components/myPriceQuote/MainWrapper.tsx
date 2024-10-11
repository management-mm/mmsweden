import { useTranslation } from 'react-i18next';

import FormForRequestQuote from './FormForRequestQuote';
import PriceQuoteList from './PriceQuoteList';

import NavLinkBtn from '@components/common/NavLinkBtn';
import SvgIcon from '@components/common/SvgIcon';

import { selectRequestedProducts } from '@store/selectors';

import { useAppSelector } from '@hooks/useAppSelector';

import { Button, Description, Title } from '@enums/i18nConstants';
import { IconId } from '@enums/iconsSpriteId';

const MainWrapper = () => {
  const { t } = useTranslation();
  const requestedProducts = useAppSelector(selectRequestedProducts);

  return (
    <div className="container min-h-[100vh] pt-[22px]">
      {requestedProducts.length !== 0 ? (
        <>
          <h1 className="mb-[22px] text-center text-[32px] font-bold text-title md:mb-[48px] md:text-[48px]">
            {t(Title.RequestAQuote)}
          </h1>
          <div className="lg:flex lg:gap-[46px]">
            <PriceQuoteList />
            <FormForRequestQuote />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <SvgIcon
            iconId={IconId.EmptyCart}
            size={{ width: 110, height: 110 }}
            className="mb-[12px] fill-primary"
          />
          <h1 className="text-[32px] font-bold text-title md:text-[48px]">
            {t(Title.EmptyCart)}
          </h1>
          <p className="mb-[22px] text-center text-[16px] font-medium">
            {t(Description.EmptyPriceQuoteList)}
          </p>
          <NavLinkBtn intent="goToProducts" path="/all-products">
            {t(Button.GoToProducts)}
          </NavLinkBtn>
        </div>
      )}
    </div>
  );
};

export default MainWrapper;
