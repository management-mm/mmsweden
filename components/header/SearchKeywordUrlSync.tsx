'use client';

import { Suspense, useEffect } from 'react';

import { useSearchParams } from 'next/navigation';

type Props = {
  onKeywordChange: (keyword: string) => void;
};

function SearchKeywordUrlSyncContent({ onKeywordChange }: Props) {
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword') ?? '';

  useEffect(() => {
    onKeywordChange(keyword);
  }, [keyword, onKeywordChange]);

  return null;
}

// Keep Next.js's search-param CSR bailout limited to this invisible child.
// The actual desktop and mobile navigation stays server-rendered, with its
// original markup, category links, layout and animations intact.
export default function SearchKeywordUrlSync(props: Props) {
  return (
    <Suspense fallback={null}>
      <SearchKeywordUrlSyncContent {...props} />
    </Suspense>
  );
}
