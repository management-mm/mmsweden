'use client';

import { useContext, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { LanguageContext } from 'app/providers';
import type { IProduct } from 'interfaces/IProduct';
import { usePathname, useSearchParams } from 'next/navigation';

import ResetFilters from './ResetFilters';

import { LanguageContextAdmin } from '@components/LanguageAdminProvider';
import Pagination from '@components/common/Pagination';
import ProductCard from '@components/common/productCard/ProductCard';

import {
  type IFetchProductsParams,
  fetchProducts,
} from '@store/products/operations';
import { selectProducts, selectTotal } from '@store/selectors';

import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';
import useWindowWidth from '@hooks/useWindowWidth';

import { filters } from '@enums/filters';
import { Title } from '@enums/i18nConstants';

const ProductsList = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const pathname = usePathname();
  const isAdmin = pathname.includes('/admin');

  const searchParams = useSearchParams();
  const searchKey = searchParams.toString();

  const { language } = useContext(
    isAdmin ? LanguageContextAdmin : LanguageContext
  );

  const windowWidth = useWindowWidth();
  const perPage = windowWidth >= 1178 ? 9 : 8;

  const products: IProduct[] = useAppSelector(selectProducts);
  const total: number = useAppSelector(selectTotal);

  const pageCount = Math.ceil(total / perPage);

  const title = searchParams.get('title');
  const manufacturer = searchParams.get('manufacturer');
  const condition = searchParams.get('condition');
  const page = searchParams.get('page') || '1';

  const categories = useMemo(
    () => searchParams.getAll('category'),
    [searchKey]
  );
  const industries = useMemo(
    () => searchParams.getAll('industry'),
    [searchKey]
  );

  useEffect(() => {
    const paramsForFetch: IFetchProductsParams = {
      ...(title ? { keyword: title } : {}),
      page: Number(page),
      ...(categories.length ? { category: categories } : {}),
      ...(industries.length ? { industry: industries } : {}),
      ...(manufacturer ? { manufacturer } : {}),
      ...(condition ? { condition } : {}),
      perPage,
      lang: language,
    };

    dispatch(fetchProducts(paramsForFetch));
  }, [
    dispatch,
    title,
    manufacturer,
    condition,
    page,
    perPage,
    language,
    searchKey,
  ]);

  const hasAnyFilters =
    !!searchParams.get(filters.Category) ||
    !!searchParams.get(filters.Manufacturer) ||
    !!searchParams.get(filters.Industry) ||
    !!searchParams.get(filters.Condition);

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
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      )}

      {pageCount !== 1 && <Pagination pageCount={pageCount} className="" />}
    </section>
  );
};

export default ProductsList;
