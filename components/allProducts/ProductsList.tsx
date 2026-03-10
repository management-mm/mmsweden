import type { IProduct } from 'interfaces/IProduct';
import { getTranslations } from 'next-intl/server';

import ResetFilters from './ResetFilters';

import Pagination from '@components/common/Pagination';
import ProductCard from '@components/common/productCard/ProductCard';

import {
  type IFetchProductsParams,
  fetchProducts,
} from '@store/products/operations';
import { selectProductsCacheByKey, selectTotalByKey } from '@store/selectors';
import { makeStore } from '@store/store';

import { buildCacheKey } from '@utils/buildCacheKey';

import { Title } from '@enums/i18nConstants';

import type { AppLocale } from '@i18n/config';

type Props = {
  locale: AppLocale;
  query: {
    title?: string;
    manufacturer?: string;
    condition?: string;
    page?: string;
    category: string[];
    industry: string[];
  };
};

const PER_PAGE = 9;

const ProductsList = async ({ locale, query }: Props) => {
  const t = await getTranslations();

  const page = Number(query.page || '1');

  const paramsForFetch: IFetchProductsParams = {
    ...(query.title ? { keyword: query.title } : {}),
    page,
    ...(query.category.length ? { category: query.category } : {}),
    ...(query.industry.length ? { industry: query.industry } : {}),
    ...(query.manufacturer ? { manufacturer: query.manufacturer } : {}),
    ...(query.condition ? { condition: query.condition } : {}),
    perPage: PER_PAGE,
    lang: locale,
    mode: 'replace',
  };

  const {
    mode,
    cacheKey: _cacheKey,
    ...base
  } = paramsForFetch as IFetchProductsParams & {
    cacheKey?: string;
  };

  const cacheKey = buildCacheKey(base as Record<string, unknown>);

  const store = makeStore();

  await store.dispatch(
    fetchProducts({
      ...paramsForFetch,
      cacheKey,
    })
  );

  const state = store.getState();

  const products = selectProductsCacheByKey(cacheKey)(state) as IProduct[];
  const total = selectTotalByKey(cacheKey)(state) as number;

  const pageCount = Math.ceil(total / PER_PAGE);

  const hasAnyFilters =
    !!query.category.length ||
    !!query.industry.length ||
    !!query.manufacturer ||
    !!query.condition;

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

      {pageCount > 1 && <Pagination pageCount={pageCount} className="" />}
    </section>
  );
};

export default ProductsList;
