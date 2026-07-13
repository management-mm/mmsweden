import { getProducts } from '@api/productsService';
import clsx from 'clsx';

import FiltersAndSearch from './FiltersAndSearch';
import ProductsList from './ProductsList';
import ProductsTotalProvider from './ProductsTotalProvider';
import SeoIntroSection from './SeoIntroSection';

import ProductQuickFilters from '@components/adminDashboard/common/ProductQuickFilters';
import Breadcrumb from '@components/common/Breadcrumb';

import { getBreadcrumbCategories } from '@utils/getBreadcrumbCategoryData';

import type { AppLocale } from '@i18n/config';

type ProductFilter = 'sold' | 'draft' | 'hasNotes';

type Props = {
  mode?: 'public' | 'admin';
  locale: AppLocale;
  seoIntro?: {
    h1: string;
    intro?: string | null;
  };
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

function normalizeSlug(slug?: string) {
  if (!slug) {
    return undefined;
  }

  try {
    const decodedSlug = decodeURIComponent(slug).trim();

    return decodedSlug || undefined;
  } catch {
    const trimmedSlug = slug.trim();

    return trimmedSlug || undefined;
  }
}

function isMongoObjectId(value?: string) {
  return Boolean(value && /^[0-9a-fA-F]{24}$/.test(value));
}

const AllProductsView = async ({
  mode = 'public',
  locale,
  query,
  seoIntro,
}: Props) => {
  const isAdmin = mode === 'admin';

  const categorySlug = normalizeSlug(query.categorySlug);
  const subcategorySlug = normalizeSlug(query.subcategorySlug);

  const safeCategorySlug = isMongoObjectId(categorySlug)
    ? undefined
    : categorySlug;

  const safeSubcategorySlug = isMongoObjectId(subcategorySlug)
    ? undefined
    : subcategorySlug;

  const { products, total } = await getProducts({
    ...(query.title ? { keyword: query.title } : {}),
    ...(query.manufacturer ? { manufacturer: query.manufacturer } : {}),
    ...(query.condition ? { condition: query.condition } : {}),
    ...(query.category.length ? { category: query.category } : {}),
    ...(query.industry.length ? { industry: query.industry } : {}),
    ...(safeCategorySlug ? { categorySlug: safeCategorySlug } : {}),
    ...(safeSubcategorySlug ? { subcategorySlug: safeSubcategorySlug } : {}),

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
    safeCategorySlug,
    safeSubcategorySlug
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

        {!isAdmin && seoIntro?.h1 && (
          <SeoIntroSection h1={seoIntro.h1} intro={seoIntro.intro} />
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
              <FiltersAndSearch />
            </div>
          )}

          <ProductsList
            initialProducts={products}
            initialTotal={total}
            locale={locale}
            isAdmin={isAdmin}
            categorySlug={safeCategorySlug}
            subcategorySlug={safeSubcategorySlug}
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
              <FiltersAndSearch />
            </div>
          )}
        </div>
      </div>
    </ProductsTotalProvider>
  );
};

export default AllProductsView;
