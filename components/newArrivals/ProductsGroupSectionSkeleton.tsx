import Skeleton from 'react-loading-skeleton';

import ProductCard from '@components/common/productCard/ProductCard';
import { skeletonProduct } from '@components/common/productCard/skeletonProduct';

import { AppLocale } from '@i18n/config';

type Props = {
  locale: AppLocale;
  count?: number;
};

const ProductsGroupSectionSkeleton = ({ locale, count = 8 }: Props) => {
  return (
    <section className="border-line mb-10 border-t pt-6 md:mb-12 md:pt-8">
      <div className="mb-5 flex flex-col items-center gap-2 md:mb-6 md:flex-row md:justify-center">
        <div className="w-[160px] md:w-[220px]">
          <Skeleton height={28} />
        </div>

        <span className="hidden md:inline">—</span>

        <div className="w-[180px] md:w-[260px]">
          <Skeleton height={26} />
        </div>
      </div>

      <ul className="flex flex-wrap justify-center gap-4 md:justify-start md:gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <li key={index} className="w-[296px] md:w-[264px]">
            <ProductCard product={skeletonProduct} locale={locale} isLoading />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ProductsGroupSectionSkeleton;
