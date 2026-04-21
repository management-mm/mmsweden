import { useCallback, useEffect, useRef, useState } from 'react';

import { getProducts } from '@api/productsService';
import type { IProduct } from '@interfaces/IProduct';

import { AppLocale } from '@i18n/config';

const PER_PAGE = 9;

type UseInfiniteLatestProductsReturn = {
  products: IProduct[];
  isLoading: boolean;
  isFirstLoading: boolean;
  hasMore: boolean;
  observerRef: React.RefObject<HTMLDivElement>;
};

const isAbortError = (error: unknown): boolean => {
  return error instanceof Error && error.name === 'AbortError';
};

export const useInfiniteLatestProducts = (
  locale: AppLocale
): UseInfiniteLatestProductsReturn => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstLoading, setIsFirstLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const pageRef = useRef(1);
  const observerRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const isRequestInFlightRef = useRef(false);

  const loadPage = useCallback(
    async (nextPage: number) => {
      if (isRequestInFlightRef.current) return;

      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;
      isRequestInFlightRef.current = true;
      setIsLoading(true);

      try {
        const result = await getProducts(
          {
            sort: 'latest',
            perPage: PER_PAGE,
            page: nextPage,
            lang: locale,
          },
          { signal: controller.signal }
        );

        const fetchedProducts = result.products ?? [];
        const newProducts = fetchedProducts.filter(
          (product: IProduct) => !product.deletionDate
        );

        setProducts(prev => {
          const existingIds = new Set(prev.map(product => product._id));
          const uniqueNewProducts = newProducts.filter(
            (product: IProduct) => !existingIds.has(product._id)
          );

          return [...prev, ...uniqueNewProducts];
        });

        setHasMore(fetchedProducts.length === PER_PAGE);
        pageRef.current = nextPage;
      } catch (error) {
        if (!isAbortError(error)) {
          console.error(error);
          setHasMore(false);
        }
      } finally {
        if (controllerRef.current === controller) {
          controllerRef.current = null;
        }

        isRequestInFlightRef.current = false;
        setIsLoading(false);
        setIsFirstLoading(false);
      }
    },
    [locale]
  );

  useEffect(() => {
    const loadInitial = async () => {
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;
      isRequestInFlightRef.current = true;

      setProducts([]);
      setHasMore(true);
      setIsLoading(false);
      setIsFirstLoading(true);
      pageRef.current = 1;

      try {
        const result = await getProducts(
          {
            sort: 'latest',
            perPage: PER_PAGE,
            page: 1,
            lang: locale,
          },
          { signal: controller.signal }
        );

        const fetchedProducts = result.products ?? [];
        const initialProducts = fetchedProducts.filter(
          (product: IProduct) => !product.deletionDate
        );

        setProducts(initialProducts);
        setHasMore(fetchedProducts.length === PER_PAGE);
      } catch (error) {
        if (!isAbortError(error)) {
          console.error(error);
          setHasMore(false);
        }
      } finally {
        if (controllerRef.current === controller) {
          controllerRef.current = null;
        }

        isRequestInFlightRef.current = false;
        setIsFirstLoading(false);
      }
    };

    loadInitial();

    return () => {
      controllerRef.current?.abort();
    };
  }, [locale]);

  useEffect(() => {
    const target = observerRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      entries => {
        const firstEntry = entries[0];

        if (
          firstEntry.isIntersecting &&
          hasMore &&
          !isLoading &&
          !isFirstLoading &&
          !isRequestInFlightRef.current
        ) {
          loadPage(pageRef.current + 1);
        }
      },
      {
        root: null,
        rootMargin: '200px',
        threshold: 0,
      }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [hasMore, isLoading, isFirstLoading, loadPage]);

  return {
    products,
    isLoading,
    isFirstLoading,
    hasMore,
    observerRef,
  };
};
