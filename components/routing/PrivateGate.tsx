'use client';

import type { ReactNode } from 'react';
import { useEffect, useMemo } from 'react';

import { useLocale } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import Loader from '@components/common/loaders/Loader';

import { useAuth } from '@hooks/useAuth';

type Props = {
  children: ReactNode;
  redirectTo?: string;
};

function isLocalizedPath(path: string) {
  return /^\/(en|sv|de|fr|es|ru|uk|pl)(\/|$)/.test(path);
}

function normalizeRedirectPath(redirectTo: string, locale: string) {
  if (isLocalizedPath(redirectTo)) {
    return redirectTo;
  }

  if (redirectTo.startsWith('/')) {
    return `/${locale}${redirectTo}`;
  }

  return `/${locale}/login`;
}

function isSafeInternalPath(path: string | null) {
  return Boolean(path && path.startsWith('/') && !path.startsWith('//'));
}

export default function PrivateGate({
  children,
  redirectTo = '/login',
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();

  const { isLoggedIn, isRefreshing, isHydrated } = useAuth();

  const safeRedirectTo = useMemo(
    () => normalizeRedirectPath(redirectTo, locale),
    [redirectTo, locale]
  );

  const currentPathWithQuery = useMemo(() => {
    const queryString = searchParams.toString();

    return queryString ? `${pathname}?${queryString}` : pathname;
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!isHydrated) return;
    if (isRefreshing) return;
    if (isLoggedIn) return;

    const nextFrom = isSafeInternalPath(currentPathWithQuery)
      ? encodeURIComponent(currentPathWithQuery)
      : encodeURIComponent(`/${locale}/admin`);

    const separator = safeRedirectTo.includes('?') ? '&' : '?';

    router.replace(`${safeRedirectTo}${separator}from=${nextFrom}`);
  }, [
    isHydrated,
    isRefreshing,
    isLoggedIn,
    currentPathWithQuery,
    safeRedirectTo,
    locale,
    router,
  ]);

  if (!isHydrated) return <Loader />;
  if (isRefreshing) return <Loader />;
  if (!isLoggedIn) return null;

  return <>{children}</>;
}
