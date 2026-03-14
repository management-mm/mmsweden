import { getProducts } from '@api/productsService';
import type { IProduct } from 'interfaces/IProduct';
import { getTranslations } from 'next-intl/server';

import ResetFilters from './ResetFilters';

import Pagination from '@components/common/Pagination';
import ProductCard from '@components/common/productCard/ProductCard';

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

  const parsedPage = Number(query.page);
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const { products, total } = await getProducts({
    page,
    perPage: PER_PAGE,
    lang: locale,
    ...(query.title ? { keyword: query.title } : {}),
    ...(query.category.length ? { category: query.category } : {}),
    ...(query.industry.length ? { industry: query.industry } : {}),
    ...(query.manufacturer ? { manufacturer: query.manufacturer } : {}),
    ...(query.condition ? { condition: query.condition } : {}),
  });

  const pageCount = Math.ceil(total / PER_PAGE);

  const hasAnyFilters =
    !!query.title ||
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
          {products.map((product: IProduct) => (
            <li
              key={product._id}
              className="w-[296px] md:w-[calc((100%-30px)/2)] lg:w-[calc((100%-2*30px)/3)]"
            >
              <ProductCard
                product={product}
                language={locale}
                isAdmin={false}
              />
            </li>
          ))}
        </ul>
      )}

      {pageCount > 1 && <Pagination pageCount={pageCount} className="" />}
    </section>
  );
};

export default ProductsList;
