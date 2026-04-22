import { AppError } from './AppError';
import { normalizeError } from './normalizeError';

type LogErrorContext = {
  scope?: string;
  route?: string;
  details?: unknown;
};

export const logError = (error: unknown, context: LogErrorContext = {}) => {
  const normalizedError =
    error instanceof AppError ? error : normalizeError(error);

  const payload = {
    message: normalizedError.message,
    code: normalizedError.code,
    status: normalizedError.status,
    details: normalizedError.details,
    scope: context.scope,
    route: context.route,
    contextDetails: context.details,
  };

  if (process.env.NODE_ENV === 'development') {
    console.warn('[AppError]', payload);
    return;
  }

  console.error('[AppError]', payload);
};
