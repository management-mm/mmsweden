import { createSlice } from '@reduxjs/toolkit';
import type { IManufacturer } from 'interfaces/IManufacturer';

import { fetchManufacturers, updateManufacturer } from './operations';

import {
  handleFetchFulfilled,
  handlePending,
  handleRejected,
  handleUpdateFulfilled,
} from '@store/handlers';

const manufacturersSlice = createSlice({
  name: 'manufacturers',
  initialState: {
    items: [] as IManufacturer[],
    isLoading: false,
    error: null,
  },
  reducers: {},
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

export const manufacturersReducer = manufacturersSlice.reducer;
