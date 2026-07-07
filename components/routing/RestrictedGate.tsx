'use client';

import type { ReactNode } from 'react';
import { useEffect, useMemo } from 'react';

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

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

  if (redirectTo === '/') {
    return `/${locale}`;
  }

  if (redirectTo.startsWith('/')) {
    return `/${locale}${redirectTo}`;
  }

  return `/${locale}`;
}

export default function RestrictedGate({ children, redirectTo = '/' }: Props) {
  const router = useRouter();
  const locale = useLocale();

  const { isLoggedIn, isHydrated } = useAuth();

  const safeRedirectTo = useMemo(
    () => normalizeRedirectPath(redirectTo, locale),
    [redirectTo, locale]
  );

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (isLoggedIn) {
      router.replace(safeRedirectTo);
    }
  }, [isHydrated, isLoggedIn, safeRedirectTo, router]);

  if (!isHydrated) {
    return null;
  }

  if (isLoggedIn) {
    return null;
  }

  return <>{children}</>;
}
