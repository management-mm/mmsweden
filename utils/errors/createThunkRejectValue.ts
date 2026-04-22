import { AppError, type AppErrorCode } from './AppError';
import { normalizeError } from './normalizeError';

export type ThunkRejectValue = {
  message: string;
  code: AppErrorCode;
  status?: number;
  details?: unknown;
};

export const createThunkRejectValue = (error: unknown): ThunkRejectValue => {
  const normalizedError =
    error instanceof AppError ? error : normalizeError(error);

  return {
    message: normalizedError.message,
    code: normalizedError.code,
    status: normalizedError.status,
    details: normalizedError.details,
  };
};
