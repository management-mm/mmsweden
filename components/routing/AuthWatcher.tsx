import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import type { RootState } from '@store/store';

import { useAppSelector } from '@hooks/useAppSelector';
import { useCurrentLocale } from '@hooks/useCurrentLocale';

export default function AuthWatcher() {
  const router = useRouter();
  const error = useAppSelector((state: RootState) => state.auth.error);
  const isLoggedIn = useAppSelector(
    (state: RootState) => state.auth.isLoggedIn
  );
  const locale = useCurrentLocale();
  useEffect(() => {
    if (!isLoggedIn && error) {
      router.push(`/${locale}/login`);
    }
  }, [error, isLoggedIn, router]);
  return null;
}
