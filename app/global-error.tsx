'use client';

import { useEffect, useMemo } from 'react';

import PageErrorState from '@components/common/error/PageErrorState';

import { logError } from '@utils/errors/logError';
import { normalizeError } from '@utils/errors/normalizeError';

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: Props) {
  const normalizedError = useMemo(() => normalizeError(error), [error]);

  useEffect(() => {
    logError(error, {
      scope: 'global-error',
      details: {
        digest: error.digest,
      },
    });
  }, [error]);

  return (
    <html>
      <body>
        <PageErrorState
          error={normalizedError}
          title="Application error"
          onRetry={reset}
          homeHref="/"
        />
      </body>
    </html>
  );
}
