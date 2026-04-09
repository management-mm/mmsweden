import { useCallback, useEffect, useRef, useState } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type UseSearchKeywordOptions = {
  enabled?: boolean;
  debounceMs?: number;
};

export default function useSearchKeyword({
  enabled = true,
  debounceMs = 400,
}: UseSearchKeywordOptions = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const keywordFromUrl = searchParams.get('keyword') ?? '';
  const [searchValue, setSearchValue] = useState(keywordFromUrl);

  const skipNextDebounceRef = useRef(false);
  const lastSyncedValueRef = useRef(keywordFromUrl);

  useEffect(() => {
    if (!enabled) return;

    if (keywordFromUrl === lastSyncedValueRef.current) {
      return;
    }

    setSearchValue(prev => (prev === keywordFromUrl ? prev : keywordFromUrl));
  }, [keywordFromUrl, enabled]);

  const syncToUrl = useCallback(
    (rawValue: string) => {
      if (!enabled) return;

      const trimmedValue = rawValue.trim();
      const currentKeyword = searchParams.get('keyword') ?? '';

      if (trimmedValue === currentKeyword) return;

      lastSyncedValueRef.current = trimmedValue;

      const params = new URLSearchParams(searchParams.toString());

      if (trimmedValue) {
        params.set('keyword', trimmedValue);
      } else {
        params.delete('keyword');
      }

      const queryString = params.toString();
      const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;

      router.replace(nextUrl, { scroll: false });
    },
    [enabled, pathname, router, searchParams]
  );

  useEffect(() => {
    if (!enabled) return;

    if (skipNextDebounceRef.current) {
      skipNextDebounceRef.current = false;
      return;
    }

    const timeoutId = window.setTimeout(() => {
      syncToUrl(searchValue);
    }, debounceMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchValue, syncToUrl, debounceMs, enabled]);

  const clearSearch = useCallback(() => {
    skipNextDebounceRef.current = true;
    setSearchValue('');
    syncToUrl('');
  }, [syncToUrl]);

  const commitSearch = useCallback(() => {
    skipNextDebounceRef.current = true;
    syncToUrl(searchValue);
  }, [searchValue, syncToUrl]);

  return {
    searchValue,
    setSearchValue,
    clearSearch,
    commitSearch,
  };
}
