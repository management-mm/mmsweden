'use client';

import { useEffect, useMemo } from 'react';

import type { IProduct } from '@interfaces/IProduct';
import { useTranslations } from 'next-intl';

import ProductCard from '@components/common/productCard/ProductCard';

import { fetchProducts } from '@store/products/operations';
import {
  selectProductsCacheByKey,
  selectProductsLastFetchedAtByKey,
  selectProductsStatusByKey,
} from '@store/selectors';

import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';
import { useCurrentLocale } from '@hooks/useCurrentLocale';

import { Title } from '@enums/i18nConstants';

import { CACHE_KEY, TTL } from '@constants/cacheProducts';

type GroupedProducts = Record<string, IProduct[]>;

const LatestArrivals = () => {
  const t = useTranslations();
  const dispatch = useAppDispatch();

  const allProducts = useAppSelector(selectProductsCacheByKey(CACHE_KEY));
  const lastFetchedAt = useAppSelector(
    selectProductsLastFetchedAtByKey(CACHE_KEY)
  );
  const status = useAppSelector(selectProductsStatusByKey(CACHE_KEY));

  const language = useCurrentLocale();

  const products = useMemo(() => {
    const filtered = (allProducts ?? []).filter(p => !p.deletionDate);
    return filtered.slice(0, 60);
  }, [allProducts]);

  useEffect(() => {
    if (status === 'loading') return;

    const isFresh = lastFetchedAt !== null && Date.now() - lastFetchedAt < TTL;

    if (products.length >= 10 && isFresh) return;

    dispatch(fetchProducts({ sort: 'latest', cacheKey: CACHE_KEY }));
  }, [dispatch, products.length, lastFetchedAt, status]);

  const groupedProducts: GroupedProducts = useMemo(() => {
    const grouped: GroupedProducts = {};

    for (const product of products) {
      const dateKey = new Date(product.createdAt).toISOString().slice(0, 10);
      (grouped[dateKey] ??= []).push(product);
    }

    return grouped;
  }, [products]);

  const groupedEntries = useMemo(() => {
    return Object.entries(groupedProducts).sort(([a], [b]) =>
      b.localeCompare(a)
    );
  }, [groupedProducts]);

  return (
    <section className="pt-[22px] pb-[96px]">
      <div className="container">
        {groupedEntries.map(([date, items]) => (
          <div key={date} className="mb-8">
            <p className="text-title mb-4 text-center text-[18px] font-semibold md:text-[24px]">
              <span>{t(Title.DateAdded)}</span>
              <br className="md:hidden" />
              <span className="hidden md:inline">&nbsp;-&nbsp;</span>
              {new Date(date).toLocaleString(language, { dateStyle: 'long' })}
            </p>

            <div className="flex flex-wrap justify-center gap-4 md:justify-start">
              {items.map(product => (
                <ProductCard
                  key={product._id}
                  product={product}
                  language={language}
                  className="w-[296px] md:w-[264px]"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LatestArrivals;
