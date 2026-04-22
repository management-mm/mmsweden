import { createSlice } from '@reduxjs/toolkit';
import type { IManufacturer } from 'interfaces/IManufacturer';

import { fetchManufacturers, updateManufacturer } from './operations';

import {
  handleFetchFulfilled,
  handlePending,
  handleRejected,
  handleUpdateFulfilled,
} from '@store/handlers';

import type { ThunkRejectValue } from '@utils/errors/createThunkRejectValue';

interface ManufacturersState {
  items: IManufacturer[];
  isLoading: boolean;
  error: ThunkRejectValue | null;
}

const initialState: ManufacturersState = {
  items: [],
  isLoading: false,
  error: null,
};

const manufacturersSlice = createSlice({
  name: 'manufacturers',
  initialState,
  reducers: {
    clearManufacturersError: state => {
      state.error = null;
    },
  },
  extraReducers: builder =>
    builder
      .addCase(fetchManufacturers.pending, handlePending)
      .addCase(fetchManufacturers.fulfilled, (state, action) =>
        handleFetchFulfilled(state, action)
      )
      .addCase(fetchManufacturers.rejected, handleRejected)
      .addCase(updateManufacturer.pending, handlePending)
      .addCase(updateManufacturer.fulfilled, (state, action) =>
        handleUpdateFulfilled(state, action)
      )
      .addCase(updateManufacturer.rejected, handleRejected),
});

export const { clearManufacturersError } = manufacturersSlice.actions;
export const manufacturersReducer = manufacturersSlice.reducer;
