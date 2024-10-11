import { useTranslation } from 'react-i18next';

import ItemForQuote from './ItemForQuote';

import DecorativeLine from '@components/common/DecorativeLine';
import NavLinkBtn from '@components/common/NavLinkBtn';

import { selectRequestedProducts } from '@store/selectors';

import { useAppSelector } from '@hooks/useAppSelector';

import { Button, Title } from '@enums/i18nConstants';

const PriceQuoteList = () => {
  const { t } = useTranslation();
  const requestedProducts = useAppSelector(selectRequestedProducts);

  return (
    <section className="pb-[48px]">
      {requestedProducts.length !== 0 && (
        <div className="rounded-[22px]">
          <div className="rounded-t-[22px] bg-primary py-[16px]">
            <h2 className="text-center text-[18px] font-semibold text-secondary md:text-[24px]">
              {t(Title.ItemsForQuote)}
            </h2>
          </div>
          <div className="border-pagination rounded-b-[22px] border-b border-l border-r pb-[28px] lg:w-[425px]">
            <ul className="mb-[24px]">
              {requestedProducts.map(requested => {
                return (
                  <>
                    <ItemForQuote key={requested._id} product={requested} />
                    <DecorativeLine intent="myPriceQuote" />
                  </>
                );
              })}
            </ul>
            <div className="text-center">
              <NavLinkBtn className="" intent="addMore" path="/all-products">
                {t(Button.AddMoreItems)}
              </NavLinkBtn>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PriceQuoteList;
