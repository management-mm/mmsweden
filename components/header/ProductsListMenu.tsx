'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { getProducts } from '@api/productsService';
import type { IProduct } from 'interfaces/IProduct';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import ProductMenuItem from './ProductMenuItem';

import Loader from '@components/common/loaders/Loader';

import { useCurrentLocale } from '@hooks/useCurrentLocale';

import { cn } from '@utils/cn';

const PER_PAGE = 10;

type ProductsListMenuProps = {
  className?: string;
};

const ProductsListMenu = ({ className }: ProductsListMenuProps) => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const pageRef = useRef(1);
  const listRef = useRef<HTMLUListElement | null>(null);

  const searchParams = useSearchParams();
  const language = useCurrentLocale();

  const title = useMemo(
    () => searchParams.get('keyword')?.trim() || '',
    [searchParams]
  );

  const loadPage = useCallback(
    async (nextPage: number) => {
      if (!title || !hasMore || isLoading) return;

      setIsLoading(true);

      try {
        const result = await getProducts({
          keyword: title,
          lang: language,
          page: nextPage,
          perPage: PER_PAGE,
        });

        const nextProducts = result.products ?? [];

        setProducts(prev => [...prev, ...nextProducts]);
        setHasMore(nextProducts.length === PER_PAGE);
        pageRef.current = nextPage;
      } finally {
        setIsLoading(false);
      }
    },
    [title, language, hasMore, isLoading]
  );

  useEffect(() => {
    if (!title) {
      setProducts([]);
      setHasMore(false);
      setIsLoading(false);
      pageRef.current = 1;
      return;
    }

    const loadInitial = async () => {
      setIsLoading(true);
      pageRef.current = 1;

      try {
        const result = await getProducts({
          keyword: title,
          lang: language,
          page: 1,
          perPage: PER_PAGE,
        });

        const initialProducts = result.products ?? [];

        setProducts(initialProducts);
        setHasMore(initialProducts.length === PER_PAGE);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitial();
  }, [title, language]);

  useEffect(() => {
    if (!title) return;

    const el = listRef.current;
    if (!el) return;

    const handleScroll = () => {
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 80) {
        loadPage(pageRef.current + 1);
      }
    };

    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [loadPage, title]);

  if (!title) return null;

  return (
    <div className={cn('w-full', className)}>
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
              <Link
                href={`/${language}/all-products/${product.seoCategorySlug}/${product.seoSubcategorySlug}/${product.slug}`}
                className="block rounded-xl transition hover:bg-gray-50"
              >
                <ProductMenuItem product={product} />
              </Link>
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
