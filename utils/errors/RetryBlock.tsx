'use client';

import { AppError } from '@utils/errors/AppError';

type RetryBlockProps = {
  error?: AppError | null;
  message?: string;
  onRetry?: () => void;
  className?: string;
};

const getReadableMessage = (error?: AppError | null, message?: string) => {
  if (message) return message;
  if (!error) return 'Something went wrong. Please try again.';

  switch (error.code) {
    case 'NETWORK':
      return 'Network error. Check your internet connection and try again.';
    case 'TIMEOUT':
      return 'The request took too long. Please try again.';
    case 'VALIDATION':
      return 'Please check the entered data.';
    case 'NOT_FOUND':
      return 'The requested data was not found.';
    case 'UNAUTHORIZED':
      return 'You need to sign in again.';
    case 'FORBIDDEN':
      return 'You do not have access to this action.';
    case 'SERVER':
      return 'Server error. Please try again later.';
    case 'ABORTED':
      return 'Request was cancelled.';
    default:
      return 'Something went wrong. Please try again.';
  }
};

export default function RetryBlock({
  error,
  message,
  onRetry,
  className = '',
}: RetryBlockProps) {
  const readableMessage = getReadableMessage(error, message);

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
          Try again
        </button>
      )}
    </div>
  );
}
