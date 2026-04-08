'use client';

import type { ReactNode } from 'react';

import { useParams, useRouter } from 'next/navigation';

import { logOut } from '@store/auth/operations';
import { clearAuthError, resetAuthState } from '@store/auth/slice';
import type { AppDispatch } from '@store/store';

import { useAppDispatch } from '@hooks/useAppDispatch';

type LogoutButtonProps = {
  children?: ReactNode;
};

export default function LogoutButton({
  children = 'Log out',
}: LogoutButtonProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();

  const handleLogout = async () => {
    try {
      await dispatch(logOut()).unwrap();
    } catch {
    } finally {
      dispatch(resetAuthState());
      dispatch(clearAuthError());

      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('persist:auth');
      }

      const locale =
        typeof params?.locale === 'string' ? params.locale : undefined;

      router.push(locale ? `/${locale}/login` : '/login');
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={
        'font-inter text-primary border-primary hover:bg-primary hover:text-secondary text-primary transition-boxShadow inline-block h-[44px] rounded-[32px] border px-[32px] py-[12px] text-center text-[16px] leading-tight font-semibold shadow-none duration-500 md:h-[52px]'
      }
    >
      {children}→
    </button>
  );
}
