'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { useAuth } from '@hooks/useAuth';

type Props = { children: React.ReactNode; redirectTo?: string };

export default function RestrictedGate({ children, redirectTo = '/' }: Props) {
  const router = useRouter();
  const { isLoggedIn, isHydrated } = useAuth();

  useEffect(() => {
    if (!isHydrated) return;
    if (isLoggedIn) router.replace(redirectTo);
  }, [isHydrated, isLoggedIn, redirectTo, router]);

  if (!isHydrated) return null;
  if (isLoggedIn) return null;

  return <>{children}</>;
}
