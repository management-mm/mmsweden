import type { IProduct } from 'interfaces/IProduct';
import { getTranslations } from 'next-intl/server';

import ResetFilters from './ResetFilters';

import Pagination from '@components/common/Pagination';
import ProductCard from '@components/common/productCard/ProductCard';

import { Title } from '@enums/i18nConstants';

import { AppLocale } from '@i18n/config';

type Props = {
  initialProducts: IProduct[];
  initialTotal: number;
  locale: AppLocale;
  isAdmin: boolean;
  categorySlug: string;
  subcategorySlug: string;
};

const PER_PAGE = 9;

const ProductsList = async ({
  initialProducts,
  initialTotal,
  locale,
  isAdmin,
  categorySlug,
  subcategorySlug,
}: Props) => {
  const t = await getTranslations();

  const pageCount = Math.ceil(initialTotal / PER_PAGE);
  const hasAnyFilters = false;

  return (
    <section className="pb-[96px] lg:pb-[124px]">
      {hasAnyFilters && <ResetFilters />}

      {initialProducts.length === 0 && hasAnyFilters ? (
        <div className="lg:flex lg:w-[852px] lg:justify-center lg:pt-[32px]">
          <p className="text-title text-center text-[18px] font-medium">
            {t(Title.NoResults)}
          </p>
        </div>
      ) : (
        <ul className="mb-[32px] flex w-full flex-wrap justify-center gap-[30px] md:justify-normal lg:mb-[44px] lg:w-[852px]">
          {initialProducts.map((product, index) => (
            <li
              key={product._id}
              className="w-[296px] md:w-[calc((100%-30px)/2)] lg:w-[calc((100%-2*30px)/3)]"
            >
              <ProductCard
                language={locale}
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

      {pageCount > 1 && <Pagination pageCount={pageCount} />}
    </section>
  );
};

export default ProductsList;
