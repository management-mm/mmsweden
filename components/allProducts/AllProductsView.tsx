import { getProducts } from '@api/productsService';
import clsx from 'clsx';

import FiltersAndSearch from './FiltersAndSearch';
import ProductsList from './ProductsList';
import ProductsTotalProvider from './ProductsTotalProvider';

import Breadcrumb from '@components/common/Breadcrumb';

import type { AppLocale } from '@i18n/config';

type Props = {
  mode?: 'public' | 'admin';
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

const AllProductsView = async ({ mode = 'public', locale, query }: Props) => {
  const isAdmin = mode === 'admin';

  const { products, total } = await getProducts({
    ...(query.title ? { keyword: query.title } : {}),
    ...(query.category.length ? { category: query.category } : {}),
    ...(query.industry.length ? { industry: query.industry } : {}),
    ...(query.manufacturer ? { manufacturer: query.manufacturer } : {}),
    ...(query.condition ? { condition: query.condition } : {}),
    page: Number(query.page || 1),
    perPage: 9,
    lang: locale,
  });

  return (
    <ProductsTotalProvider total={total}>
      <div
        className={clsx(
          'container',
          'pt-[12px] md:pt-[22px]',
          isAdmin && 'lg:mx-0'
        )}
      >
        {!isAdmin && <Breadcrumb />}

        <div className="flex flex-col lg:flex-row lg:justify-start lg:gap-[30px]">
          {!isAdmin && (
            <div className="shrink-0">
              <FiltersAndSearch />
            </div>
          )}

          <ProductsList
            initialProducts={products}
            initialTotal={total}
            locale={locale}
          />

          {isAdmin && (
            <div className="shrink-0">
              <FiltersAndSearch />
            </div>
          )}
        </div>
      </div>
    </ProductsTotalProvider>
  );
};

export default AllProductsView;
