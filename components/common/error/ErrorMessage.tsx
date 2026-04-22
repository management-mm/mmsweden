'use client';

import { AppError } from '@utils/errors/AppError';
import { getErrorMessage } from '@utils/errors/getErrorMessage';

type ErrorMessageProps = {
  error?: AppError | null;
  message?: string;
  title?: string;
  className?: string;
  size?: 'sm' | 'md';
};

export default function ErrorMessage({
  error,
  message,
  title = 'Error',
  className = '',
  size = 'md',
}: ErrorMessageProps) {
  const readableMessage = message || getErrorMessage(error);

  return (
    <div
      className={`rounded-[12px] border border-red-200 bg-red-50 px-4 py-3 text-left ${className}`}
      role="alert"
      aria-live="polite"
    >
      <p
        className={`mb-1 font-semibold text-red-700 ${
          size === 'sm' ? 'text-[13px]' : 'text-[15px]'
        }`}
      >
        {title}
      </p>

      <p
        className={`text-red-600 ${
          size === 'sm' ? 'text-[12px]' : 'text-[14px]'
        }`}
      >
        {readableMessage}
      </p>
    </div>
  );
}
