'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { getProducts } from '@api/productsService';
import type { IProduct } from 'interfaces/IProduct';
import Link from 'next/link';

import ProductMenuItem from './ProductMenuItem';

import Loader from '@components/common/loaders/Loader';

import { useCurrentLocale } from '@hooks/useCurrentLocale';

import { cn } from '@utils/cn';

const PER_PAGE = 10;
const DEBOUNCE_MS = 300;
const CACHE_TTL = 60_000;
const MAX_CACHE_ENTRIES = 50;

type ProductsListMenuProps = {
  keyword: string;
  className?: string;
};

type CachedProducts = {
  products: IProduct[];
  total: number;
  expiresAt: number;
};

type MenuState = {
  key: string;
  products: IProduct[];
  total: number;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: boolean;
  loadMoreError: boolean;
};

const initialState: MenuState = {
  key: '',
  products: [],
  total: 0,
  isLoading: false,
  isLoadingMore: false,
  error: false,
  loadMoreError: false,
};

const productsCache = new Map<string, CachedProducts>();

function getCachedProducts(key: string) {
  const cached = productsCache.get(key);

  if (!cached) return null;

  if (Date.now() >= cached.expiresAt) {
    productsCache.delete(key);
    return null;
  }

  return cached;
}

function setCachedProducts(key: string, products: IProduct[], total: number) {
  productsCache.delete(key);

  if (productsCache.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = productsCache.keys().next().value;

    if (oldestKey !== undefined) {
      productsCache.delete(oldestKey);
    }
  }

  productsCache.set(key, {
    products,
    total,
    expiresAt: Date.now() + CACHE_TTL,
  });
}

const ProductsListMenu = ({ keyword, className }: ProductsListMenuProps) => {
  const locale = useCurrentLocale();

  const [debouncedKeyword, setDebouncedKeyword] = useState('');

  const [state, setState] = useState<MenuState>(initialState);

  const [retryCount, setRetryCount] = useState(0);

  const pageRef = useRef(1);
  const listRef = useRef<HTMLUListElement | null>(null);

  const controllerRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);
  const loadingMoreRef = useRef(false);

  const trimmedKeyword = keyword.trim();

  const searchKey = JSON.stringify([locale, debouncedKeyword]);

  const isWaiting =
    trimmedKeyword !== debouncedKeyword || state.key !== searchKey;

  const isInitialLoading = isWaiting || state.isLoading;

  const visibleProducts = isInitialLoading ? [] : state.products;

  const hasMore = state.products.length < state.total;

  // Debounce: do not request on every keystroke.
  // Cached searches can be displayed immediately.
  useEffect(() => {
    if (!trimmedKeyword) {
      setDebouncedKeyword('');
      return;
    }

    const key = JSON.stringify([locale, trimmedKeyword]);

    if (getCachedProducts(key)) {
      setDebouncedKeyword(trimmedKeyword);
      return;
    }

    const timeout = window.setTimeout(() => {
      setDebouncedKeyword(trimmedKeyword);
    }, DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [trimmedKeyword, locale]);

  // Load first page when search changes.
  useEffect(() => {
    const requestId = ++requestIdRef.current;

    pageRef.current = 1;
    loadingMoreRef.current = false;

    if (!debouncedKeyword) {
      controllerRef.current = null;
      setState(initialState);
      return;
    }

    const key = JSON.stringify([locale, debouncedKeyword]);

    const controller = new AbortController();

    controllerRef.current = controller;

    const cached = getCachedProducts(key);

    if (cached) {
      setState({
        key,
        products: cached.products,
        total: cached.total,
        isLoading: false,
        isLoadingMore: false,
        error: false,
        loadMoreError: false,
      });

      return () => {
        controller.abort();
      };
    }

    setState({
      ...initialState,
      key,
      isLoading: true,
    });

    const loadInitial = async () => {
      try {
        const result = await getProducts(
          {
            keyword: debouncedKeyword,
            lang: locale,
            page: 1,
            perPage: PER_PAGE,
          },
          {
            signal: controller.signal,
          }
        );

        if (controller.signal.aborted || requestId !== requestIdRef.current) {
          return;
        }

        const initialProducts = result.products ?? [];

        setCachedProducts(key, initialProducts, result.total);

        setState({
          key,
          products: initialProducts,
          total: result.total,
          isLoading: false,
          isLoadingMore: false,
          error: false,
          loadMoreError: false,
        });
      } catch (error) {
        if (controller.signal.aborted || requestId !== requestIdRef.current) {
          return;
        }

        console.error('Failed to load products:', error);

        setState({
          ...initialState,
          key,
          error: true,
        });
      }
    };

    void loadInitial();

    return () => {
      controller.abort();

      if (controllerRef.current === controller) {
        controllerRef.current = null;
      }
    };
  }, [debouncedKeyword, locale, retryCount]);

  // Load subsequent pages.
  const loadMore = useCallback(async () => {
    if (
      !debouncedKeyword ||
      isWaiting ||
      state.isLoading ||
      loadingMoreRef.current ||
      !hasMore
    ) {
      return;
    }

    const controller = controllerRef.current;

    if (!controller || controller.signal.aborted) {
      return;
    }

    const requestId = requestIdRef.current;
    const nextPage = pageRef.current + 1;

    loadingMoreRef.current = true;

    setState(prev =>
      prev.key === searchKey
        ? {
            ...prev,
            isLoadingMore: true,
            loadMoreError: false,
          }
        : prev
    );

    try {
      const result = await getProducts(
        {
          keyword: debouncedKeyword,
          lang: locale,
          page: nextPage,
          perPage: PER_PAGE,
        },
        {
          signal: controller.signal,
        }
      );

      if (controller.signal.aborted || requestId !== requestIdRef.current) {
        return;
      }

      pageRef.current = nextPage;

      setState(prev => {
        if (prev.key !== searchKey) {
          return prev;
        }

        const existingIds = new Set(prev.products.map(product => product._id));

        const newProducts = result.products.filter(
          product => !existingIds.has(product._id)
        );

        return {
          ...prev,
          products: [...prev.products, ...newProducts],
          total: result.total,
          isLoadingMore: false,
          loadMoreError: false,
        };
      });
    } catch (error) {
      if (controller.signal.aborted || requestId !== requestIdRef.current) {
        return;
      }

      console.error('Failed to load more products:', error);

      setState(prev =>
        prev.key === searchKey
          ? {
              ...prev,
              loadMoreError: true,
            }
          : prev
      );
    } finally {
      if (requestId === requestIdRef.current) {
        loadingMoreRef.current = false;

        setState(prev =>
          prev.key === searchKey
            ? {
                ...prev,
                isLoadingMore: false,
              }
            : prev
        );
      }
    }
  }, [
    debouncedKeyword,
    locale,
    searchKey,
    isWaiting,
    state.isLoading,
    hasMore,
  ]);

  // Infinite scroll.
  useEffect(() => {
    const element = listRef.current;

    if (!element) return;

    const handleScroll = () => {
      if (
        isInitialLoading ||
        state.isLoadingMore ||
        state.loadMoreError ||
        !hasMore
      ) {
        return;
      }

      const isNearBottom =
        element.scrollTop + element.clientHeight >= element.scrollHeight - 80;

      if (isNearBottom) {
        void loadMore();
      }
    };

    element.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () => {
      element.removeEventListener('scroll', handleScroll);
    };
  }, [
    loadMore,
    isInitialLoading,
    state.isLoadingMore,
    state.loadMoreError,
    hasMore,
  ]);

  if (!trimmedKeyword) {
    return null;
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl border-b border-gray-200 bg-white px-4 py-3">
          <h3 className="text-sm font-semibold text-gray-800">Products</h3>

          <span className="text-xs text-gray-500">
            {visibleProducts.length} loaded
          </span>
        </div>

        <ul
          ref={listRef}
          className="max-h-[500px] space-y-2 overflow-y-auto px-3 py-3"
        >
          {visibleProducts.map(product => (
            <li key={product._id}>
              <Link
                href={`/${locale}/all-products/${product.seoCategorySlug}/${product.seoSubcategorySlug}/${product.slug}`}
                className="block rounded-xl transition hover:bg-gray-50"
              >
                <ProductMenuItem product={product} />
              </Link>
            </li>
          ))}

          {isInitialLoading && (
            <li className="flex justify-center py-4">
              <Loader />
            </li>
          )}

          {!isInitialLoading && state.error && (
            <li className="py-6 text-center text-sm text-gray-500">
              <p>Failed to load products</p>

              <button
                type="button"
                onClick={() => setRetryCount(prev => prev + 1)}
                className="mt-2 font-medium text-blue-600"
              >
                Try again
              </button>
            </li>
          )}

          {!isInitialLoading &&
            !state.error &&
            visibleProducts.length === 0 && (
              <li className="py-10 text-center text-sm text-gray-500">
                No products found
              </li>
            )}

          {!isInitialLoading && state.isLoadingMore && (
            <li className="flex justify-center py-4">
              <Loader />
            </li>
          )}

          {!isInitialLoading && state.loadMoreError && (
            <li className="py-4 text-center text-sm text-gray-500">
              <p>Failed to load more products</p>

              <button
                type="button"
                onClick={() => void loadMore()}
                className="mt-2 font-medium text-blue-600"
              >
                Try again
              </button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ProductsListMenu;
