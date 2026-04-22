'use client';

import { AppError } from '@utils/errors/AppError';
import { getErrorMessage } from '@utils/errors/getErrorMessage';

type RetryBlockProps = {
  error?: AppError | null;
  message?: string;
  onRetry?: () => void;
  className?: string;
  retryLabel?: string;
};

export default function RetryBlock({
  error,
  message,
  onRetry,
  className = '',
  retryLabel = 'Try again',
}: RetryBlockProps) {
  const readableMessage = message || getErrorMessage(error);

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-[12px] border border-black/10 bg-white px-4 py-6 text-center shadow-sm ${className}`}
      role="alert"
      aria-live="polite"
    >
      <p className="text-primary mb-3 text-[14px] md:text-[16px]">
        {readableMessage}
      </p>

      {onRetry && error?.code !== 'ABORTED' && (
        <button
          type="button"
          onClick={onRetry}
          className="bg-primary rounded-full px-4 py-2 text-[14px] font-medium text-white transition-opacity duration-200 hover:opacity-90"
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
}
