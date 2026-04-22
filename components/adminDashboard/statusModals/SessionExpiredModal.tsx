'use client';

import Link from 'next/link';

import StatusModal from '@components/common/StatusModal';

import { clearAuthError } from '@store/auth/slice';
import type { RootState } from '@store/store';

import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';
import { useCurrentLocale } from '@hooks/useCurrentLocale';

import { getErrorMessage } from '@utils/errors/getErrorMessage';

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

  const errorMessage = error
    ? getErrorMessage(error)
    : 'Please log in again to continue.';

  return (
    <StatusModal
      title="Your session has expired"
      handleToggleMenu={handleClose}
    >
      <div className="flex w-full flex-col gap-[10px]">
        <p className="text-center text-sm">{errorMessage}</p>

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
