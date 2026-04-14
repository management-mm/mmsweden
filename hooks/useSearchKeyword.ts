import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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

  const searchParamsString = useMemo(
    () => searchParams.toString(),
    [searchParams]
  );
  const keywordFromUrl = searchParams.get('keyword') ?? '';
  const [searchValue, setSearchValue] = useState(keywordFromUrl);

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

      const params = new URLSearchParams(searchParamsString);

      if (trimmedValue) {
        params.set('keyword', trimmedValue);
      } else {
        params.delete('keyword');
      }

      const queryString = params.toString();
      const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;

      router.replace(nextUrl, { scroll: false });
    },
    [enabled, pathname, router, searchParams, searchParamsString]
  );

  const clearSearch = useCallback(() => {
    setSearchValue('');
    syncToUrl('');
  }, [syncToUrl]);

  const commitSearch = useCallback(() => {
    syncToUrl(searchValue);
  }, [searchValue, syncToUrl]);

  return {
    searchValue,
    setSearchValue,
    clearSearch,
    commitSearch,
  };
}
