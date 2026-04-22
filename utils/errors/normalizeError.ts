import axios from 'axios';

import { AppError, type AppErrorCode } from './AppError';

const isAbortError = (error: unknown): boolean => {
  return error instanceof Error && error.name === 'AbortError';
};

const getCodeByStatus = (status?: number): AppErrorCode => {
  if (!status) return 'UNKNOWN';
  if (status === 400 || status === 422) return 'VALIDATION';
  if (status === 401) return 'UNAUTHORIZED';
  if (status === 403) return 'FORBIDDEN';
  if (status === 404) return 'NOT_FOUND';
  if (status >= 500) return 'SERVER';

  return 'UNKNOWN';
};

const getDefaultMessageByCode = (code: AppErrorCode): string => {
  switch (code) {
    case 'NETWORK':
      return 'Network error. Please check your internet connection.';
    case 'TIMEOUT':
      return 'The request took too long. Please try again.';
    case 'ABORTED':
      return 'The request was cancelled.';
    case 'VALIDATION':
      return 'Please check the entered data.';
    case 'NOT_FOUND':
      return 'The requested resource was not found.';
    case 'UNAUTHORIZED':
      return 'You need to sign in again.';
    case 'FORBIDDEN':
      return 'You do not have permission to perform this action.';
    case 'SERVER':
      return 'Server error. Please try again later.';
    default:
      return 'Something went wrong. Please try again.';
  }
};

const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

export const normalizeError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  if (isAbortError(error)) {
    return new AppError(getDefaultMessageByCode('ABORTED'), 'ABORTED');
  }

  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const responseData = error.response?.data;

    const serverMessage =
      isObject(responseData) && typeof responseData.message === 'string'
        ? responseData.message
        : undefined;

    const code =
      error.code === 'ECONNABORTED'
        ? 'TIMEOUT'
        : error.response
          ? getCodeByStatus(status)
          : 'NETWORK';

    return new AppError(
      serverMessage || error.message || getDefaultMessageByCode(code),
      code,
      {
        status,
        details: responseData,
      }
    );
  }

  if (isObject(error)) {
    const message =
      typeof error.message === 'string' ? error.message : undefined;

    const status =
      typeof error.status === 'number'
        ? error.status
        : typeof error.statusCode === 'number'
          ? error.statusCode
          : undefined;

    const code =
      typeof error.code === 'string'
        ? (error.code as AppErrorCode)
        : getCodeByStatus(status);

    if (message) {
      return new AppError(message, code, {
        status,
        details: error,
      });
    }
  }

  if (error instanceof TypeError && error.message.includes('fetch')) {
    return new AppError(getDefaultMessageByCode('NETWORK'), 'NETWORK');
  }

  if (error instanceof Error) {
    return new AppError(
      error.message || getDefaultMessageByCode('UNKNOWN'),
      'UNKNOWN',
      {
        details: error,
      }
    );
  }

  return new AppError(getDefaultMessageByCode('UNKNOWN'), 'UNKNOWN', {
    details: error,
  });
};
