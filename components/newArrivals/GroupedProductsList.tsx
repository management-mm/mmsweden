'use client';

import { useMemo } from 'react';

import type { IProduct } from '@interfaces/IProduct';
import { useTranslations } from 'next-intl';

import ProductsGroupSection from './ProductsGroupSection';

import Loader from '@components/common/loaders/Loader';

import { useCurrentLocale } from '@hooks/useCurrentLocale';
import { useInfiniteLatestProducts } from '@hooks/useInfiniteLatestProducts';

import { Title } from '@enums/i18nConstants';

type GroupedProducts = Record<string, IProduct[]>;

const GROUP_TIME_ZONE = 'Europe/Stockholm';

const getDateKey = (date: string | Date): string => {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: GROUP_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(date));
};

const groupProductsByDate = (products: IProduct[]): GroupedProducts => {
  const grouped: GroupedProducts = {};

  for (const product of products) {
    const dateKey = getDateKey(product.createdAt);
    (grouped[dateKey] ??= []).push(product);
  }

  return grouped;
};

export default function GroupedProductsList() {
  const t = useTranslations();
  const locale = useCurrentLocale();

  const { products, isLoading, isFirstLoading, hasMore, observerRef } =
    useInfiniteLatestProducts(locale);

  const groupedEntries = useMemo(() => {
    const groupedProducts = groupProductsByDate(products);

    return Object.entries(groupedProducts)
      .map(
        ([date, items]) =>
          [
            date,
            [...items].sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            ),
          ] as const
      )
      .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime());
  }, [products]);

  if (isFirstLoading) {
    return <Loader />;
  }

  return (
    <div aria-busy={isLoading}>
      {groupedEntries.map(([date, items]) => (
        <ProductsGroupSection
          key={date}
          date={date}
          items={items}
          locale={locale}
          dateAddedLabel={t(Title.DateAdded)}
        />
      ))}

      {isLoading && (
        <div className="flex justify-center py-6">
          <Loader />
        </div>
      )}

      {hasMore && <div ref={observerRef} className="h-10 w-full" />}
    </div>
  );
}
