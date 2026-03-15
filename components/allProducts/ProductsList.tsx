'use client';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import type { IProduct } from 'interfaces/IProduct';

import ResetFilters from './ResetFilters';

import Pagination from '@components/common/Pagination';
import ProductCard from '@components/common/productCard/ProductCard';

import { Title } from '@enums/i18nConstants';
import { useCurrentLocale } from '@hooks/useCurrentLocale';

import { useAppDispatch } from '@hooks/useAppDispatch';
import { setInitialProducts } from '@store/products/productsSlice';

type Props = {
  initialProducts: IProduct[];
  initialTotal: number;
};

const PER_PAGE = 9;

const ProductsList = ({ initialProducts, initialTotal }: Props) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const language = useCurrentLocale();

  const products = initialProducts;
  const total = initialTotal;

  useEffect(() => {
    dispatch(
      setInitialProducts({
        items: initialProducts,
        total: initialTotal,
      })
    );
  }, [dispatch, initialProducts, initialTotal]);

  const pageCount = Math.ceil(total / PER_PAGE);

  const hasAnyFilters = false;

  return (
    <section className="pb-[96px] lg:pb-[124px]">
      {hasAnyFilters && <ResetFilters />}

      {products.length === 0 && hasAnyFilters ? (
        <div className="lg:flex lg:w-[852px] lg:justify-center lg:pt-[32px]">
          <p className="text-title text-center text-[18px] font-medium">
            {t(Title.NoResults)}
          </p>
        </div>
      ) : (
        <ul className="mb-[32px] flex w-full flex-wrap justify-center gap-[30px] md:justify-normal lg:mb-[44px] lg:w-[852px]">
          {products.map(product => (
            <li
              key={product._id}
              className="w-[296px] md:w-[calc((100%-30px)/2)] lg:w-[calc((100%-2*30px)/3)]"
            >
              <ProductCard language={language} product={product} />
            </li>
          ))}
        </ul>
      )}

      {pageCount !== 1 && <Pagination pageCount={pageCount} />}
    </section>
  );
};

export default ProductsList;