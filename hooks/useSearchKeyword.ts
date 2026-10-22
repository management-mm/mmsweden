'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type UseSearchKeywordOptions = {
  enabled?: boolean;
  debounceMs?: number;
  syncOnChange?: boolean;
};

export default function useSearchKeyword({
  enabled = true,
  debounceMs = 400,
  syncOnChange = true,
}: UseSearchKeywordOptions = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const keywordFromUrl = searchParams.get('keyword') ?? '';

  const searchParamsString = searchParams.toString();

  const [searchValue, setSearchValue] = useState(keywordFromUrl);

  const pendingUrlKeywordRef = useRef<string | null>(null);

  // Keep input synchronized with external URL changes,
  // without overwriting newer user input after a commit.
  useEffect(() => {
    if (!enabled) return;

    const pendingKeyword = pendingUrlKeywordRef.current;

    if (pendingKeyword !== null) {
      pendingUrlKeywordRef.current = null;

      if (pendingKeyword === keywordFromUrl) {
        return;
      }
    }

    setSearchValue(prev => (prev === keywordFromUrl ? prev : keywordFromUrl));
  }, [keywordFromUrl, enabled]);

  // Update URL only when explicitly requested,
  // or when legacy syncOnChange mode is enabled.
  const syncToUrl = useCallback(
    (rawValue: string) => {
      if (!enabled) return;

      const trimmedValue = rawValue.trim();

      const params = new URLSearchParams(searchParamsString);

      const currentKeyword = params.get('keyword') ?? '';

      if (trimmedValue === currentKeyword) {
        return;
      }

      if (trimmedValue) {
        params.set('keyword', trimmedValue);
      } else {
        params.delete('keyword');
      }

      const queryString = params.toString();

      const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;

      pendingUrlKeywordRef.current = trimmedValue;

      router.replace(nextUrl, {
        scroll: false,
      });
    },
    [enabled, pathname, router, searchParamsString]
  );

  // Optional legacy behavior:
  // synchronize URL while typing.
  useEffect(() => {
    if (!enabled || !syncOnChange) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      syncToUrl(searchValue);
    }, debounceMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchValue, syncToUrl, debounceMs, enabled, syncOnChange]);

  // Clear both input and URL.
  const clearSearch = useCallback(() => {
    setSearchValue('');
    syncToUrl('');
  }, [syncToUrl]);

  // Submit search immediately on Enter or button click.
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
