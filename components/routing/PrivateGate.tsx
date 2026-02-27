'use client';

import { useEffect, useMemo } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import Loader from '@components/common/loaders/Loader';

import { useAuth } from '@hooks/useAuth';

type Props = {
  children: React.ReactNode;
  redirectTo?: string;
};

export default function PrivateGate({
  children,
  redirectTo = '/login',
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { isLoggedIn, isRefreshing, isHydrated } = useAuth();

  const from = useMemo(() => {
    const v = searchParams.get('from');
    return v && v.startsWith('/') ? v : null;
  }, [searchParams]);

  useEffect(() => {
    if (!isHydrated) return;
    if (isRefreshing) return;

    if (!isLoggedIn) {
      const nextFrom = encodeURIComponent(from ?? pathname);
      router.replace(`${redirectTo}?from=${nextFrom}`);
    }
  }, [
    isHydrated,
    isRefreshing,
    isLoggedIn,
    from,
    pathname,
    redirectTo,
    router,
  ]);

  if (!isHydrated) return <Loader />;
  if (isRefreshing) return <Loader />;
  if (!isLoggedIn) return <Loader />;

  return <>{children}</>;
}
