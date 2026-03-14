import clsx from 'clsx';

import FiltersAndSearch from '@components/allProducts/FiltersAndSearch';
import ProductsList from '@components/allProducts/ProductsList';
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

  return (
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

        <ProductsList />

        {isAdmin && (
          <div className="shrink-0">
            <FiltersAndSearch />
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProductsView;
