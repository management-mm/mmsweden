import { createSlice } from '@reduxjs/toolkit';
import type { ICategory } from 'interfaces/ICategory';

import { fetchCategories, updateCategory } from './operations';

import {
  handleFetchFulfilled,
  handlePending,
  handleRejected,
  handleUpdateFulfilled,
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
      .addCase(fetchCategories.rejected, handleRejected)
      .addCase(updateCategory.pending, handlePending)
      .addCase(updateCategory.fulfilled, (state, action) =>
        handleUpdateFulfilled(state, action)
      )
      .addCase(updateCategory.rejected, handleRejected),
});

export const categoriesReducer = categoriesSlice.reducer;
