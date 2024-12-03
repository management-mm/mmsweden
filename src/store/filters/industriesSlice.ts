import { createSlice } from '@reduxjs/toolkit';
import type { IIndustry } from 'interfaces/IIndustry';

import { fetchIndustries } from './operations';

import {
  handleFetchFulfilled,
  handlePending,
  handleRejected,
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
      .addCase(fetchIndustries.rejected, handleRejected),
});

export const industriesReducer = industriesSlice.reducer;
