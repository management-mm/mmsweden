import type { IProduct, MultiLanguageString } from '@interfaces/IProduct';

import ProductCard from '@components/common/productCard/ProductCard';

import { AppLocale } from '@i18n/config';

type Props = {
  locale: AppLocale;
  isAdmin?: boolean;
  count?: number;
};

const emptyMultiLanguageString: MultiLanguageString = {
  en: '',
  sv: '',
  de: '',
  fr: '',
  es: '',
  ru: '',
  uk: '',
  pl: '',
};

const skeletonProduct: IProduct = {
  _id: 'skeleton',
  slug: 'skeleton',
  name: emptyMultiLanguageString,
  idNumber: '',
  description: emptyMultiLanguageString,
  dimensions: '',
  photos: [],
  video: '',
  category: emptyMultiLanguageString,
  manufacturer: '',
  industries: [],
  condition: 'used',
  deletionDate: null,
  createdAt: new Date(),
};

const ProductsListSkeleton = ({
  locale,
  isAdmin = false,
  count = 9,
}: Props) => {
  return (
    <section className="pb-[96px] lg:pb-[124px]">
      <ul className="mb-[32px] flex w-full flex-wrap justify-center gap-[30px] md:justify-normal lg:mb-[44px] lg:w-[852px]">
        {Array.from({ length: count }).map((_, index) => (
          <li
            key={index}
            className="w-[296px] md:w-[calc((100%-30px)/2)] lg:w-[calc((100%-2*30px)/3)]"
          >
            <ProductCard
              language={locale}
              product={skeletonProduct}
              isAdmin={isAdmin}
              isLoading
            />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ProductsListSkeleton;
