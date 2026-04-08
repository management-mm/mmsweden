'use client';

import { useEffect, useRef, useState } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type UseSearchKeywordOptions = {
  enabled?: boolean;
};

export default function useSearchKeyword({
  enabled = true,
}: UseSearchKeywordOptions = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchValue, setSearchValue] = useState(
    searchParams.get('keyword') || ''
  );

  const prevPathnameRef = useRef(pathname);
  const skipNextSyncRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;

      skipNextSyncRef.current = true;
      setSearchValue('');

      const params = new URLSearchParams(searchParams.toString());

      if (params.has('keyword')) {
        params.delete('keyword');

        const queryString = params.toString();
        router.replace(queryString ? `${pathname}?${queryString}` : pathname);
      }

      return;
    }

    prevPathnameRef.current = pathname;
  }, [pathname, searchParams, router, enabled]);

  useEffect(() => {
    if (!enabled) return;

    if (skipNextSyncRef.current) {
      skipNextSyncRef.current = false;
      return;
    }

    const trimmedValue = searchValue.trim();
    const currentKeyword = searchParams.get('keyword') || '';

    if (trimmedValue === currentKeyword) return;

    const params = new URLSearchParams(searchParams.toString());

    if (trimmedValue) {
      params.set('keyword', trimmedValue);
    } else {
      params.delete('keyword');
    }

    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname);
  }, [searchValue, searchParams, pathname, router, enabled]);

  const clearSearch = () => {
    setSearchValue('');
  };

  return {
    searchValue,
    setSearchValue,
    clearSearch,
  };
}
