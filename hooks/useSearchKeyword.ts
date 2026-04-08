'use client';

import { useEffect, useState } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function useSearchKeyword() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const keywordFromUrl = searchParams.get('keyword') || '';
  const [searchValue, setSearchValue] = useState(keywordFromUrl);

  useEffect(() => {
    setSearchValue(keywordFromUrl);
  }, [keywordFromUrl]);

  useEffect(() => {
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
  }, [searchValue, searchParams, pathname, router]);

  const clearSearch = () => {
    setSearchValue('');
  };

  return {
    searchValue,
    setSearchValue,
    clearSearch,
  };
}
