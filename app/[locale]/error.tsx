'use client';

import { useEffect, useMemo } from 'react';

import PageErrorState from '@components/common/error/PageErrorState';

import { logError } from '@utils/errors/logError';
import { normalizeError } from '@utils/errors/normalizeError';

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: Props) {
  const normalizedError = useMemo(() => normalizeError(error), [error]);

  useEffect(() => {
    logError(error, {
      scope: 'route-error',
      details: {
        digest: error.digest,
      },
    });
  }, [error]);

  return (
    <PageErrorState
      error={normalizedError}
      title="Something went wrong"
      onRetry={reset}
      homeHref="/"
    />
  );
}
