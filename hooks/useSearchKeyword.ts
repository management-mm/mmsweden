'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { usePathname, useRouter } from 'next/navigation';

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

  // Reading useSearchParams here forces the entire header (including category
  // links) into a client-side rendering bailout on statically rendered routes.
  // The small SearchKeywordUrlSync component handles URL -> input syncing inside
  // its own Suspense boundary instead.
  const [searchValue, setSearchValue] = useState('');
  const pendingUrlKeywordRef = useRef<string | null>(null);

  const syncFromUrl = useCallback((keywordFromUrl: string) => {
    const pendingKeyword = pendingUrlKeywordRef.current;

    if (pendingKeyword !== null) {
      pendingUrlKeywordRef.current = null;

      // Don't replace the input with an older navigation result after submit.
      if (pendingKeyword === keywordFromUrl) return;
    }

    setSearchValue(prev => (prev === keywordFromUrl ? prev : keywordFromUrl));
  }, []);

  // Read the *current* browser query at click time, keeping any existing
  // filters/sorting parameters. No Next.js search-param hook is required here.
  const syncToUrl = useCallback(
    (rawValue: string) => {
      if (!enabled || typeof window === 'undefined') return;

      const trimmedValue = rawValue.trim();
      const params = new URLSearchParams(window.location.search);
      const currentKeyword = params.get('keyword') ?? '';

      if (trimmedValue === currentKeyword) return;

      if (trimmedValue) {
        params.set('keyword', trimmedValue);
      } else {
        params.delete('keyword');
      }

      const queryString = params.toString();
      const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;

      pendingUrlKeywordRef.current = trimmedValue;
      router.replace(nextUrl, { scroll: false });
    },
    [enabled, pathname, router]
  );

  // Optional legacy behavior: synchronize the URL while typing.
  useEffect(() => {
    if (!enabled || !syncOnChange) return;

    const timeoutId = window.setTimeout(() => {
      syncToUrl(searchValue);
    }, debounceMs);

    return () => window.clearTimeout(timeoutId);
  }, [searchValue, syncToUrl, debounceMs, enabled, syncOnChange]);

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
    syncFromUrl,
  };
}
