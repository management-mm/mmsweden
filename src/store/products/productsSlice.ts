import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { IProduct } from 'interfaces/IProduct';

import {
  type IFetchProductsResponse,
  fetchProductById,
  fetchProducts,
} from './operations';

import { handlePending, handleRejected } from '@store/handlers';

interface IProductsState {
  items: IProduct[];
  total: number;
  productDetails: IProduct | null;
  itemsForQuote: IProduct[];
  isLoading: boolean;
  error: string | null;
}

const handleFetchProductsFulfilled = (
  state: IProductsState,
  action: PayloadAction<IFetchProductsResponse>
) => {
  state.isLoading = false;
  state.error = null;
  state.items = action.payload.products;
  state.total = action.payload.total;
};

const handleFetchProductByIdFulfilled = (
  state: IProductsState,
  action: PayloadAction<IProduct>
) => {
  state.isLoading = false;
  state.error = null;
  state.productDetails = action.payload;
};

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    productDetails: null,
    total: 0,
    itemsForQuote: [],
    isLoading: false,
    error: null,
  } as IProductsState,
  reducers: {},
  extraReducers: builder =>
    builder
      .addCase(fetchProducts.pending, handlePending)
      .addCase(fetchProducts.fulfilled, handleFetchProductsFulfilled)
      .addCase(fetchProducts.rejected, handleRejected)
      .addCase(fetchProductById.pending, handlePending)
      .addCase(fetchProductById.fulfilled, handleFetchProductByIdFulfilled)
      .addCase(fetchProductById.rejected, handleRejected),
});

export const productsReducer = productsSlice.reducer;
