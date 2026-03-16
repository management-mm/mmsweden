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
    const selector = listRef.current;
    if (!selector) return;

    const handleScroll = () => {
      if (
        selector.scrollTop + selector.clientHeight >=
        selector.scrollHeight - 100
      ) {
        loadPage(pageRef.current + 1);
      }
    };

    selector.addEventListener('scroll', handleScroll);
    return () => selector.removeEventListener('scroll', handleScroll);
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
    <>
      {isLoading && <Loader />}

      <div className="w-full lg:w-[600px]">
        <ul
          ref={listRef}
          className="mt-[14px] mb-[22px] flex max-h-[600px] flex-col gap-2 overflow-auto bg-white pr-[16px]"
        >
          {products.map(product => (
            <li key={product._id}>
              <ProductMenuItem product={product} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default ProductsListMenu;
