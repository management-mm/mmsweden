import type { AppError } from './AppError';
import type { ThunkRejectValue } from './createThunkRejectValue';

type ErrorLike = AppError | ThunkRejectValue | null | undefined;

export const getErrorMessage = (error?: ErrorLike): string => {
  if (!error) {
    return 'Something went wrong. Please try again.';
  }

  const message = error.message?.trim();

  if (message) {
    return message;
  }

  switch (error.code) {
    case 'NETWORK':
      return 'Network error. Please check your internet connection.';
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
