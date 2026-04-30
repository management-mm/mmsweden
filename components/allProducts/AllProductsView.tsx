import { getProducts } from '@api/productsService';
import clsx from 'clsx';

import FiltersAndSearch from './FiltersAndSearch';
import ProductsList from './ProductsList';
import ProductsTotalProvider from './ProductsTotalProvider';

import ProductQuickFilters from '@components/adminDashboard/common/ProductQuickFilters';
import Breadcrumb from '@components/common/Breadcrumb';

import { getBreadcrumbCategories } from '@utils/getBreadcrumbCategoryData';

import type { AppLocale } from '@i18n/config';

type ProductFilter = 'sold' | 'draft' | 'hasNotes';

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
    filter?: ProductFilter;
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

    ...(query.filter === 'sold' ? { hasDeletionDate: true } : {}),
    ...(query.filter === 'draft' ? { isDraft: true } : {}),
    ...(query.filter === 'hasNotes' ? { hasNotes: true } : {}),

    page: Number(query.page || 1),
    perPage: 9,
    lang: locale,
    isAdmin,
  });

  const { category, subcategory } = await getBreadcrumbCategories(
    locale,
    query.categorySlug,
    query.subcategorySlug
  );

  return (
    <ProductsTotalProvider total={total}>
      <div
        className={clsx(
          'container',
          'pt-[12px] md:pt-[22px]',
          isAdmin && 'container--no-margin'
        )}
      >
        {!isAdmin && (
          <Breadcrumb category={category} subcategory={subcategory} />
        )}

        {isAdmin && <ProductQuickFilters />}

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
            hasSearch={Boolean(query.title?.trim())}
            hasAnyFilters={
              Boolean(query.manufacturer) ||
              Boolean(query.condition) ||
              query.category.length > 0 ||
              query.industry.length > 0 ||
              Boolean(query.filter)
            }
            searchQuery={query.title}
            categoryName={subcategory?.label || category?.label || ''}
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
