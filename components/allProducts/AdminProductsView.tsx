'use client';

import { useEffect, useMemo, useState } from 'react';

import {
  type GetProductsResponse,
  getAdminProducts,
} from '@api/productsService';

import FiltersAndSearch from './FiltersAndSearch';
import ProductsList from './ProductsList';
import ProductsTotalProvider from './ProductsTotalProvider';

import ProductQuickFilters from '@components/adminDashboard/common/ProductQuickFilters';

import type { AppLocale } from '@i18n/config';

type ProductFilter = 'sold' | 'draft' | 'hasNotes';

type Props = {
  locale: AppLocale;
  query: {
    title?: string;
    manufacturer?: string;
    condition?: string;
    page?: string;
    category: string[];
    industry: string[];
    filter?: ProductFilter;
  };
};

export default function AdminProductsView({ locale, query }: Props) {
  const [data, setData] = useState<GetProductsResponse>({
    products: [],
    total: 0,
  });

  const [isLoading, setIsLoading] = useState(false);

  const categoryKey = query.category.join(',');
  const industryKey = query.industry.join(',');

  const productsQuery = useMemo(
    () => ({
      ...(query.title ? { keyword: query.title } : {}),
      ...(query.manufacturer ? { manufacturer: query.manufacturer } : {}),
      ...(query.condition ? { condition: query.condition } : {}),
      ...(query.category.length ? { category: query.category } : {}),
      ...(query.industry.length ? { industry: query.industry } : {}),

      ...(query.filter === 'sold' ? { hasDeletionDate: true } : {}),
      ...(query.filter === 'draft' ? { isDraft: true } : {}),
      ...(query.filter === 'hasNotes' ? { hasNotes: true } : {}),

      page: Number(query.page || 1),
      perPage: 9,
      lang: locale,
    }),
    [
      query.title,
      query.manufacturer,
      query.condition,
      query.page,
      query.filter,
      categoryKey,
      industryKey,
      locale,
    ]
  );

  useEffect(() => {
    let ignore = false;

    setIsLoading(true);

    getAdminProducts(productsQuery)
      .then(response => {
        if (!ignore) {
          setData(response);
        }
      })
      .catch(error => {
        console.error('Failed to load admin products:', error);
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [productsQuery]);

  return (
    <ProductsTotalProvider total={data.total}>
      <div className="container--no-margin container pt-[12px] md:pt-[22px]">
        <ProductQuickFilters />

        <div className="flex flex-col lg:flex-row lg:justify-start lg:gap-[30px]">
          <div className="shrink-0 lg:hidden">
            <FiltersAndSearch isAdmin />
          </div>

          <div className="relative flex-1">
            {isLoading && (
              <div className="absolute top-2 right-2 z-10 text-sm text-gray-500">
                Searching...
              </div>
            )}

            <ProductsList
              initialProducts={data.products}
              initialTotal={data.total}
              locale={locale}
              isAdmin
              categorySlug=""
              subcategorySlug=""
              hasSearch={Boolean(query.title?.trim())}
              hasAnyFilters={
                Boolean(query.manufacturer) ||
                Boolean(query.condition) ||
                query.category.length > 0 ||
                query.industry.length > 0 ||
                Boolean(query.filter)
              }
              searchQuery={query.title}
              categoryName=""
            />
          </div>

          <div className="hidden shrink-0 lg:block">
            <FiltersAndSearch isAdmin />
          </div>
        </div>
      </div>
    </ProductsTotalProvider>
  );
}
