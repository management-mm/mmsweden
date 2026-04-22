'use client';

import Link from 'next/link';

import { AppError } from '@utils/errors/AppError';
import { getErrorMessage } from '@utils/errors/getErrorMessage';

type PageErrorStateProps = {
  error?: AppError | null;
  title?: string;
  description?: string;
  retryLabel?: string;
  homeLabel?: string;
  onRetry?: () => void;
  homeHref?: string;
  className?: string;
};

export default function PageErrorState({
  error,
  title = 'Something went wrong',
  description,
  retryLabel = 'Try again',
  homeLabel = 'Go to home page',
  onRetry,
  homeHref = '/',
  className = '',
}: PageErrorStateProps) {
  const readableDescription = description || getErrorMessage(error);

  return (
    <section
      className={`flex min-h-[50vh] flex-col items-center justify-center px-4 py-12 text-center ${className}`}
    >
      <div className="w-full max-w-[560px] rounded-[20px] border border-black/10 bg-white px-6 py-8 shadow-sm">
        <p className="mb-3 text-[32px] leading-none">⚠️</p>

        <h1 className="text-primary mb-3 text-[24px] font-semibold md:text-[32px]">
          {title}
        </h1>

        <p className="text-desc mx-auto mb-6 max-w-[420px] text-[14px] md:text-[16px]">
          {readableDescription}
        </p>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          {onRetry && error?.code !== 'ABORTED' && (
            <button
              type="button"
              onClick={onRetry}
              className="bg-primary rounded-full px-5 py-3 text-[14px] font-medium text-white transition-opacity duration-200 hover:opacity-90"
            >
              {retryLabel}
            </button>
          )}

          <Link
            href={homeHref}
            className="border-primary text-primary rounded-full border px-5 py-3 text-[14px] font-medium transition-colors duration-200 hover:bg-black/5"
          >
            {homeLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
