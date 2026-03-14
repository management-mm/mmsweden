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
  const language = useCurrentLocale();
  useEffect(() => {
    if (!isLoggedIn && error) {
      router.push(`/${language}/login`);
    }
  }, [error, isLoggedIn, router]);
  return null;
}
