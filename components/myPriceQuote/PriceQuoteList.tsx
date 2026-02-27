'use client';

import { useTranslation } from 'react-i18next';

import ItemForQuote from './ItemForQuote';

import DecorativeLine from '@components/common/DecorativeLine';
import NavLinkBtn from '@components/common/NavLinkBtn';

import { selectRequestedProducts } from '@store/selectors';

import { useAppSelector } from '@hooks/useAppSelector';

import { Button, Title } from '@enums/i18nConstants';
import React from 'react';

const PriceQuoteList = () => {
  const { t } = useTranslation();
  const requestedProducts = useAppSelector(selectRequestedProducts);

  return (
    <section className="pb-[48px]">
      {requestedProducts.length !== 0 && (
        <div className="rounded-[22px]">
          <div className="bg-primary rounded-t-[22px] py-[16px]">
            <h2 className="text-secondary text-center text-[18px] font-semibold md:text-[24px]">
              {t(Title.ItemsForQuote)}
            </h2>
          </div>
          <div className="border-pagination rounded-b-[22px] border-r border-b border-l border-[#e5e7eb] pb-[28px] lg:w-[425px]">
            <ul className="mb-[24px]">
  {requestedProducts.map(requested => (
    <React.Fragment key={requested._id}>
      <ItemForQuote product={requested} />
      <DecorativeLine intent="myPriceQuote" />
    </React.Fragment>
  ))}
</ul>
            <div className="text-center">
              <NavLinkBtn className="" intent="addMore" href="/all-products">
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
