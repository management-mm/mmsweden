import { createSlice } from '@reduxjs/toolkit';
import type { IIndustry } from 'interfaces/IIndustry';

import { fetchIndustries, updateIndustry } from './operations';

import {
  handleFetchFulfilled,
  handlePending,
  handleRejected,
  handleUpdateFulfilled,
} from '@store/handlers';

import type { ThunkRejectValue } from '@utils/errors/createThunkRejectValue';

interface IndustriesState {
  items: IIndustry[];
  isLoading: boolean;
  error: ThunkRejectValue | null;
}

const initialState: IndustriesState = {
  items: [],
  isLoading: false,
  error: null,
};

const industriesSlice = createSlice({
  name: 'industries',
  initialState,
  reducers: {
    clearIndustriesError: state => {
      state.error = null;
    },
  },
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

export const { clearIndustriesError } = industriesSlice.actions;
export const industriesReducer = industriesSlice.reducer;
