'use client';

import { useContext, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import type { IProduct } from '@interfaces/IProduct';
import { LanguageContext } from 'app/providers';

import ProductCard from '@components/common/productCard/ProductCard';

import { fetchProducts } from '@store/products/operations';
import { selectProducts } from '@store/selectors';

import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';

import { Title } from '@enums/i18nConstants';

type GroupedProducts = Record<string, IProduct[]>;

const LatestArrivals = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const allProducts = useAppSelector(selectProducts);
  const { language } = useContext(LanguageContext);

  const products = useMemo(() => {
    const filtered = (allProducts ?? []).filter(p => !p.deletionDate);

    return filtered.slice(0, 60);
  }, [allProducts]);

  useEffect(() => {
    dispatch(
      fetchProducts({
        sort: 'latest',
   
      } as any)
    );
  }, [dispatch]);

  const groupedProducts: GroupedProducts = useMemo(() => {
    const grouped: GroupedProducts = {};

    for (const product of products) {

      const dateKey = new Date(product.createdAt).toISOString().slice(0, 10);
      (grouped[dateKey] ??= []).push(product);
    }

    return grouped;
  }, [products]);

  const groupedEntries = useMemo(() => {
    return Object.entries(groupedProducts).sort(([a], [b]) => b.localeCompare(a));
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