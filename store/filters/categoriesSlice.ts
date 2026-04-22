import { createSlice } from '@reduxjs/toolkit';
import type { ICategory } from 'interfaces/ICategory';

import { fetchCategories, updateCategory } from './operations';

import {
  handleFetchFulfilled,
  handlePending,
  handleRejected,
  handleUpdateFulfilled,
} from '@store/handlers';

import type { ThunkRejectValue } from '@utils/errors/createThunkRejectValue';

interface CategoriesState {
  items: ICategory[];
  isLoading: boolean;
  error: ThunkRejectValue | null;
}

const initialState: CategoriesState = {
  items: [],
  isLoading: false,
  error: null,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearCategoriesError: state => {
      state.error = null;
    },
  },
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

export const { clearCategoriesError } = categoriesSlice.actions;
export const categoriesReducer = categoriesSlice.reducer;
