export type AppErrorCode =
  | 'NETWORK'
  | 'TIMEOUT'
  | 'ABORTED'
  | 'VALIDATION'
  | 'NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'SERVER'
  | 'UNKNOWN';

export class AppError extends Error {
  code: AppErrorCode;
  status?: number;
  details?: unknown;
  isOperational: boolean;

  constructor(
    message: string,
    code: AppErrorCode,
    options?: {
      status?: number;
      details?: unknown;
      isOperational?: boolean;
    }
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = options?.status;
    this.details = options?.details;
    this.isOperational = options?.isOperational ?? true;
  }
}
