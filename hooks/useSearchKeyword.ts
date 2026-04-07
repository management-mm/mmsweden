'use client';

import { useEffect, useState } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type UseSearchKeywordOptions = {
  debounceMs?: number;
  enabled?: boolean;
};

export default function useSearchKeyword({
  debounceMs = 0,
  enabled = true,
}: UseSearchKeywordOptions = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const keywordFromUrl = searchParams.get('keyword') || '';

  const [searchValue, setSearchValue] = useState(keywordFromUrl);
  const [debouncedValue, setDebouncedValue] = useState(keywordFromUrl);

  useEffect(() => {
    if (!enabled) return;
    setSearchValue(keywordFromUrl);
  }, [keywordFromUrl, enabled]);

  useEffect(() => {
    if (!enabled) return;

    if (!debounceMs) {
      setDebouncedValue(searchValue);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setDebouncedValue(searchValue);
    }, debounceMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchValue, debounceMs, enabled]);

  useEffect(() => {
    if (!enabled) return;

    const trimmedValue = debouncedValue.trim();
    const currentKeyword = searchParams.get('keyword') || '';

    if (trimmedValue === currentKeyword) return;

    const params = new URLSearchParams(searchParams.toString());

    if (trimmedValue) {
      params.set('keyword', trimmedValue);
    } else {
      params.delete('keyword');
    }

    const queryString = params.toString();
    const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;

    router.replace(nextUrl);
  }, [debouncedValue, pathname, router, searchParams, enabled]);

  const clearSearch = () => {
    setSearchValue('');
    setDebouncedValue('');

    if (!enabled) return;

    const currentKeyword = searchParams.get('keyword');
    if (!currentKeyword) return;

    const params = new URLSearchParams(searchParams.toString());
    params.delete('keyword');

    const queryString = params.toString();
    const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;

    router.replace(nextUrl);
  };

  return {
    searchValue,
    setSearchValue,
    clearSearch,
  };
}
