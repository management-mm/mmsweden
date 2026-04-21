import type { IProduct } from 'interfaces/IProduct';

import EmptyProductsState from './EmptyProductsState';
import ResetFilters from './ResetFilters';

import Pagination from '@components/common/Pagination';
import ProductCard from '@components/common/productCard/ProductCard';

import { AppLocale } from '@i18n/config';

type Props = {
  initialProducts: IProduct[];
  initialTotal: number;
  locale: AppLocale;
  isAdmin: boolean;
  categorySlug: string;
  subcategorySlug: string;
  hasAnyFilters?: boolean;
  hasSearch?: boolean;
  searchQuery?: string;
  categoryName?: string;
};

const PER_PAGE = 9;

const ProductsList = ({
  initialProducts,
  initialTotal,
  locale,
  isAdmin,
  categorySlug,
  subcategorySlug,
  hasAnyFilters = false,
  hasSearch = false,
  searchQuery,
  categoryName,
}: Props) => {
  const pageCount = Math.ceil(initialTotal / PER_PAGE);
  const isEmpty = initialProducts.length === 0;
  const hasCategoryContext = Boolean(categorySlug || subcategorySlug);

  const emptyVariant = hasSearch
    ? 'search'
    : hasAnyFilters
      ? 'filters'
      : hasCategoryContext
        ? 'category'
        : 'default';

  return (
    <section className="pb-[96px] lg:pb-[124px]">
      {hasAnyFilters && <ResetFilters />}

      {isEmpty ? (
        <EmptyProductsState
          variant={emptyVariant}
          searchQuery={searchQuery}
          categoryName={categoryName}
          className="lg:w-[852px]"
        />
      ) : (
        <ul className="mb-[32px] flex w-full flex-wrap justify-center gap-[30px] md:justify-normal lg:mb-[44px] lg:w-[852px]">
          {initialProducts.map((product, index) => (
            <li
              key={product._id}
              className="w-[296px] md:w-[calc((100%-30px)/2)] lg:w-[calc((100%-2*30px)/3)]"
            >
              <ProductCard
                locale={locale}
                product={product}
                isAdmin={isAdmin}
                categorySlug={categorySlug}
                subcategorySlug={subcategorySlug}
                priority={index === 0}
              />
            </li>
          ))}
        </ul>
      )}

      {!isEmpty && pageCount > 1 && <Pagination pageCount={pageCount} />}
    </section>
  );
};

export default ProductsList;
