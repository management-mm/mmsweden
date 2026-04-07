import { getProducts } from '@api/productsService';
import clsx from 'clsx';

import FiltersAndSearch from './FiltersAndSearch';
import ProductsList from './ProductsList';
import ProductsTotalProvider from './ProductsTotalProvider';

import Breadcrumb from '@components/common/Breadcrumb';

import slugToLabel from '@utils/slugToLabel';

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
    categorySlug?: string;
    subcategorySlug?: string;
  };
};

const AllProductsView = async ({ mode = 'public', locale, query }: Props) => {
  const isAdmin = mode === 'admin';

  const { products, total } = await getProducts({
    ...(query.title ? { keyword: query.title } : {}),
    ...(query.manufacturer ? { manufacturer: query.manufacturer } : {}),
    ...(query.condition ? { condition: query.condition } : {}),
    ...(query.category.length ? { category: query.category } : {}),
    ...(query.industry.length ? { industry: query.industry } : {}),
    ...(query.categorySlug ? { categorySlug: query.categorySlug } : {}),
    ...(query.subcategorySlug
      ? { subcategorySlug: query.subcategorySlug }
      : {}),
    page: Number(query.page || 1),
    perPage: 9,
    lang: locale,
  });

  const categorySlug = query.categorySlug || '';
  const subcategorySlug = query.subcategorySlug || '';

  return (
    <ProductsTotalProvider total={total}>
      <div
        className={clsx(
          'container',
          'pt-[12px] md:pt-[22px]',
          isAdmin && 'lg:mx-0'
        )}
      >
        {!isAdmin && (
          <Breadcrumb
            category={
              categorySlug
                ? {
                    slug: categorySlug,
                    label: slugToLabel(categorySlug),
                  }
                : undefined
            }
            subcategory={
              subcategorySlug
                ? {
                    slug: subcategorySlug,
                    label: slugToLabel(subcategorySlug),
                  }
                : undefined
            }
          />
        )}

        <div className="flex flex-col lg:flex-row lg:justify-start lg:gap-[30px]">
          {!isAdmin && (
            <div className="shrink-0">
              <FiltersAndSearch />
            </div>
          )}

          {isAdmin && (
            <div className="shrink-0 lg:hidden">
              <FiltersAndSearch isAdmin={isAdmin} />
            </div>
          )}

          <ProductsList
            initialProducts={products}
            initialTotal={total}
            locale={locale}
            isAdmin={isAdmin}
            categorySlug={query.categorySlug as string}
            subcategorySlug={query.subcategorySlug as string}
          />

          {isAdmin && (
            <div className="shrink-0">
              <FiltersAndSearch isAdmin={isAdmin} />
            </div>
          )}
        </div>
      </div>
    </ProductsTotalProvider>
  );
};

export default AllProductsView;
