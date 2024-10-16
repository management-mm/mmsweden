import { useContext, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import type { IProduct } from 'interfaces/IProduct';

import ResetFilters from './ResetFilters';

import { LanguageContext } from '@components/SharedLayout';
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
import { useTranslation } from 'react-i18next';
import { Title } from '@enums/i18nConstants';

const ProductsList = () => {
  const {t} = useTranslation()
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const { language } = useContext(LanguageContext);

  const windowWidth = useWindowWidth();

  const products: IProduct[] = useAppSelector(selectProducts);
  const total: number = useAppSelector(selectTotal);

  const perPage = windowWidth >= 1178 ? 9 : 8;

  const pageCount = Math.ceil(total / perPage);
  const title = searchParams.get('title');
  const manufacturer = searchParams.get('manufacturer');
  const condition = searchParams.get('condition');

  const page = searchParams.get('page') || '1';

  useEffect(() => {
    const paramsForFetch: IFetchProductsParams = {
      ...(title ? { keyword: title } : {}),
      page: Number(page),
      ...(searchParams.getAll('category').length
        ? { category: searchParams.getAll('category') }
        : {}),
      ...(searchParams.getAll('industry').length
        ? { industry: searchParams.getAll('industry') }
        : {}),
      ...(manufacturer ? { manufacturer: manufacturer } : {}),
      ...(condition ? { condition: condition } : {}),
      perPage,
      lang: language,
    };

    dispatch(fetchProducts(paramsForFetch));
  }, [
    dispatch,
    title,
    searchParams,
    manufacturer,
    condition,
    language,
    perPage,
    page,
  ]);

  return (
    <section className="pb-[96px] lg:pb-[124px]">
      {(searchParams.get(filters.Category) ||
        searchParams.get(filters.Manufacturer) ||
        searchParams.get(filters.Industry) ||
        searchParams.get(filters.Condition)) && <ResetFilters />}
      {products.length === 0 ? (
        <div className='lg:flex lg:justify-center lg:w-[852px] lg:pt-[32px]'>
          <p className='font-medium text-[18px] text-title text-center'>{t(Title.NoResults)}</p>
 </div>
      ): (
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
