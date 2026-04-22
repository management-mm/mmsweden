import { type PayloadAction } from '@reduxjs/toolkit';

import type { ThunkRejectValue } from '@utils/errors/createThunkRejectValue';

type StateWithLoading = {
  isLoading: boolean;
};

type StateWithError = {
  error: ThunkRejectValue | null;
};

type StateWithItems<U> = {
  items: U[];
};

const createFallbackRejectValue = (message?: string): ThunkRejectValue => ({
  message: message || 'Something went wrong. Please try again.',
  code: 'UNKNOWN',
});

const getRejectedPayload = (
  action: PayloadAction<ThunkRejectValue | undefined> & {
    error?: { message?: string };
  }
): ThunkRejectValue => {
  return action.payload ?? createFallbackRejectValue(action.error?.message);
};

export const handlePending = <T>(
  state: T & StateWithLoading & StateWithError
) => {
  state.isLoading = true;
  state.error = null;
};

export const handleRejected = <T>(
  state: T & StateWithLoading & StateWithError,
  action: PayloadAction<ThunkRejectValue | undefined> & {
    error?: { message?: string };
  }
) => {
  state.isLoading = false;
  state.error = getRejectedPayload(action);
};

export const handleFetchFulfilled = <T, U>(
  state: T & StateWithItems<U> & StateWithLoading & StateWithError,
  action: PayloadAction<U[]>
) => {
  state.isLoading = false;
  state.error = null;
  state.items = action.payload;
};

export const handleUpdateFulfilled = <T, U extends { _id: string }>(
  state: T & StateWithItems<U> & StateWithLoading & StateWithError,
  action: PayloadAction<U>
) => {
  state.isLoading = false;
  state.error = null;

  const index = state.items.findIndex(item => item._id === action.payload._id);

  if (index !== -1) {
    state.items[index] = action.payload;
  }
};

export const handleProductRejected = <T>(
  state: T & StateWithLoading & StateWithError,
  action: PayloadAction<ThunkRejectValue | undefined> & {
    error?: { message?: string };
  }
) => {
  state.isLoading = false;
  state.error = getRejectedPayload(action);
};
