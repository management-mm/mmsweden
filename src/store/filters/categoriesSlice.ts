import { createSlice } from '@reduxjs/toolkit';
import type { ICategory } from 'interfaces/ICategory';

import { fetchCategories } from './operations';

import {
  handleFetchFulfilled,
  handlePending,
  handleRejected,
} from '@store/handlers';

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    items: [] as ICategory[],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder =>
    builder
      .addCase(fetchCategories.pending, handlePending)
      .addCase(fetchCategories.fulfilled, (state, action) =>
        handleFetchFulfilled(state, action)
      )
      .addCase(fetchCategories.rejected, handleRejected),
});

export const categoriesReducer = categoriesSlice.reducer;
