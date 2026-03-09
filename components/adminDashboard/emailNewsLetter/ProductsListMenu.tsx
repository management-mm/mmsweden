'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useSearchParams } from 'next/navigation';

import ProductMenuItem from './ProductMenuItem';

import Loader from '@components/common/loaders/Loader';

import {
  type IFetchProductsParams,
  fetchProducts,
} from '@store/products/operations';
import { selectIsLoading, selectProducts } from '@store/selectors';

import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';
import { useCurrentLocale } from '@hooks/useCurrentLocale';

const PER_PAGE = 10;

const ProductsListMenu = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);
  const products = useAppSelector(selectProducts);

  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(1);
  const listRef = useRef<HTMLUListElement | null>(null);

  const searchParams = useSearchParams();
  const language = useCurrentLocale();

  const title = useMemo(() => searchParams.get('title'), [searchParams]);

  const loadPage = useCallback(
    async (nextPage: number) => {
      if (!hasMore || isLoading) return;

      const paramsForFetch: IFetchProductsParams = {
        ...(title ? { keyword: title } : {}),
        lang: language,
        page: nextPage,
        perPage: PER_PAGE,
        mode: 'append',
      };

      const result = await dispatch(fetchProducts(paramsForFetch)).unwrap();

      if (!result.products || result.products.length < PER_PAGE) {
        setHasMore(false);
      }

      pageRef.current = nextPage;
    },
    [dispatch, hasMore, title, language, isLoading]
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
    pageRef.current = 1;
    setHasMore(true);

    const paramsForFetch: IFetchProductsParams = {
      ...(title ? { keyword: title } : {}),
      lang: language,
      page: 1,
      perPage: PER_PAGE,
      mode: 'replace',
    };

    dispatch(fetchProducts(paramsForFetch));
  }, [title, language, dispatch]);

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
