import { type PayloadAction } from '@reduxjs/toolkit';

export const handlePending = <T>(state: T & { isLoading: boolean }) => {
  state.isLoading = true;
};

export const handleRejected = <T>(
  state: T & { isLoading: boolean; error: string | null },
  action: PayloadAction<string | undefined>
) => {
  state.isLoading = false;
  state.error = action.payload ?? null;
};

export const handleFetchFulfilled = <T, U>(
  state: T & { items: U[]; isLoading: boolean; error: string | null },
  action: PayloadAction<U[]>
) => {
  state.isLoading = false;
  state.error = null;
  state.items = action.payload;
};

export const handleUpdateFulfilled = <T, U extends { _id: string }>(
  state: T & { items: U[]; isLoading: boolean; error: string | null },
  action: PayloadAction<U>
) => {
  state.isLoading = false;
  state.error = null;

  const index = state.items.findIndex(item => item._id === action.payload._id);
  if (index !== -1) {
    state.items[index] = action.payload;
  }
};
