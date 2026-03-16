'use client';

import { useEffect, useMemo, useState } from 'react';

import { getProducts } from '@api/productsService';
import type { IProduct } from '@interfaces/IProduct';
import { useTranslations } from 'next-intl';

import ProductCard from '@components/common/productCard/ProductCard';

import { useCurrentLocale } from '@hooks/useCurrentLocale';

import { Title } from '@enums/i18nConstants';

type GroupedProducts = Record<string, IProduct[]>;

const LatestArrivals = () => {
  const t = useTranslations();
  const language = useCurrentLocale();

  const [productsRaw, setProductsRaw] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);

        const result = await getProducts({
          sort: 'latest',
          perPage: 60,
          page: 1,
          lang: language,
        });

        setProductsRaw(result.products);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [language]);

  const products = useMemo(() => {
    const filtered = (productsRaw ?? []).filter(p => !p.deletionDate);
    return filtered.slice(0, 60);
  }, [productsRaw]);

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
