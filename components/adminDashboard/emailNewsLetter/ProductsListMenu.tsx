'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { getProducts } from '@api/productsService';
import type { IProduct } from 'interfaces/IProduct';
import { useSearchParams } from 'next/navigation';

import ProductMenuItem from './ProductMenuItem';

import Loader from '@components/common/loaders/Loader';

import { useCurrentLocale } from '@hooks/useCurrentLocale';

const PER_PAGE = 10;

const ProductsListMenu = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const pageRef = useRef(1);
  const listRef = useRef<HTMLUListElement | null>(null);

  const searchParams = useSearchParams();
  const language = useCurrentLocale();

  const title = useMemo(() => searchParams.get('title'), [searchParams]);

  const loadPage = useCallback(
    async (nextPage: number) => {
      if (!hasMore || isLoading) return;

      setIsLoading(true);

      const result = await getProducts({
        ...(title ? { keyword: title } : {}),
        lang: language,
        page: nextPage,
        perPage: PER_PAGE,
      });

      if (!result.products || result.products.length < PER_PAGE) {
        setHasMore(false);
      }

      setProducts(prev => [...prev, ...result.products]);

      pageRef.current = nextPage;
      setIsLoading(false);
    },
    [hasMore, title, language, isLoading]
  );

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    const handleScroll = () => {
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 80) {
        loadPage(pageRef.current + 1);
      }
    };

    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [loadPage]);

  useEffect(() => {
    const loadInitial = async () => {
      setIsLoading(true);

      pageRef.current = 1;
      setHasMore(true);

      const result = await getProducts({
        ...(title ? { keyword: title } : {}),
        lang: language,
        page: 1,
        perPage: PER_PAGE,
      });

      setProducts(result.products);
      setHasMore(result.products.length === PER_PAGE);
      setIsLoading(false);
    };

    loadInitial();
  }, [title, language]);

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl border-b border-gray-200 bg-white px-4 py-3">
          <h3 className="text-sm font-semibold text-gray-800">Products</h3>
          <span className="text-xs text-gray-500">
            {products.length} loaded
          </span>
        </div>

        <ul
          ref={listRef}
          className="max-h-[500px] space-y-2 overflow-y-auto px-3 py-3"
        >
          {products.map(product => (
            <li key={product._id}>
              <ProductMenuItem product={product} />
            </li>
          ))}

          {isLoading && (
            <li className="flex justify-center py-4">
              <Loader />
            </li>
          )}

          {!isLoading && products.length === 0 && (
            <li className="py-10 text-center text-sm text-gray-500">
              No products found
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ProductsListMenu;
