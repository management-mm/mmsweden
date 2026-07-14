'use client';

import type { ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

import Loader from '@components/common/loaders/Loader';

import { refreshUser } from '@store/auth/operations';

import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAuth } from '@hooks/useAuth';

type Props = {
  children: ReactNode;
  redirectTo?: string;
};

function isLocalizedPath(path: string): boolean {
  return /^\/(en|sv|de|fr|es|ru|uk|pl)(\/|$)/.test(path);
}

function normalizeRedirectPath(redirectTo: string, locale: string): string {
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

export default function RestrictedGate({
  children,
  redirectTo = '/admin/all-products',
}: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const locale = useLocale();

  const { isLoggedIn, isRefreshing, isHydrated } = useAuth();

  const [hasCheckedSession, setHasCheckedSession] = useState(false);

  const sessionCheckStartedRef = useRef(false);

  const safeRedirectTo = useMemo(
    () => normalizeRedirectPath(redirectTo, locale),
    [redirectTo, locale]
  );

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (isLoggedIn) {
      setHasCheckedSession(true);
      return;
    }

    if (sessionCheckStartedRef.current) {
      return;
    }

    sessionCheckStartedRef.current = true;

    void dispatch(refreshUser()).finally(() => {
      setHasCheckedSession(true);
    });
  }, [dispatch, isHydrated, isLoggedIn]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!hasCheckedSession) {
      return;
    }

    if (isRefreshing) {
      return;
    }

    if (isLoggedIn) {
      router.replace(safeRedirectTo);
    }
  }, [
    hasCheckedSession,
    isHydrated,
    isLoggedIn,
    isRefreshing,
    router,
    safeRedirectTo,
  ]);

  if (!isHydrated || !hasCheckedSession || isRefreshing) {
    return <Loader />;
  }

  if (isLoggedIn) {
    return <Loader />;
  }

  return <>{children}</>;
}
