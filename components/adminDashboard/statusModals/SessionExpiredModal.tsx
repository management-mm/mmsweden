'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import StatusModal from '@components/common/StatusModal';

import { clearAuthError } from '@store/auth/slice';
import type { AppDispatch, RootState } from '@store/store';

import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';
import { useCurrentLocale } from '@hooks/useCurrentLocale';

export default function SessionExpiredModal() {
  const dispatch = useAppDispatch();
  const locale = useCurrentLocale();

  const error = useAppSelector((state: RootState) => state.auth.error);
  const isLoggedIn = useAppSelector(
    (state: RootState) => state.auth.isLoggedIn
  );

  const isOpen = !isLoggedIn && !!error;

  if (!isOpen) return null;

  const handleClose = () => {
    dispatch(clearAuthError());
  };

  return (
    <StatusModal
      title="Your session has expired"
      handleToggleMenu={handleClose}
    >
      <div className="flex w-full flex-col gap-[10px]">
        <p className="text-center text-sm">
          {error ?? 'Please log in again to continue.'}
        </p>

        <Link
          className="border-primary text-primary w-full rounded-[32px] border py-[10px] text-center font-semibold"
          href={`/${locale}/login`}
          onClick={handleClose}
        >
          Go to Login
        </Link>
      </div>
    </StatusModal>
  );
}
