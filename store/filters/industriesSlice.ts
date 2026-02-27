import { createSlice } from '@reduxjs/toolkit';
import type { IIndustry } from 'interfaces/IIndustry';

import { fetchIndustries, updateIndustry } from './operations';

import {
  handleFetchFulfilled,
  handlePending,
  handleRejected,
  handleUpdateFulfilled,
} from '@store/handlers';

const industriesSlice = createSlice({
  name: 'industries',
  initialState: {
    items: [] as IIndustry[],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder =>
    builder
      .addCase(fetchIndustries.pending, handlePending)
      .addCase(fetchIndustries.fulfilled, (state, action) =>
        handleFetchFulfilled(state, action)
      )
      .addCase(fetchIndustries.rejected, handleRejected)
      .addCase(updateIndustry.pending, handlePending)
      .addCase(updateIndustry.fulfilled, (state, action) =>
        handleUpdateFulfilled(state, action)
      )
      .addCase(updateIndustry.rejected, handleRejected),
});

export const industriesReducer = industriesSlice.reducer;
