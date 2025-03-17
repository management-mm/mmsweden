import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { IProduct } from 'interfaces/IProduct';

import {
  type IFetchProductsResponse,
  addProduct,
  deleteProduct,
  fetchProductById,
  fetchProducts,
  updateProduct,
} from './operations';

import { handlePending, handleRejected } from '@store/handlers';

const deleteProductFromList = (products: IProduct[], productId: string) => {
  const index = products.findIndex(product => product._id === productId);
  products.splice(index, 1);
};

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

const handleAddProductFulfilled = (
  state: IProductsState,
  action: PayloadAction<IProduct>
) => {
  state.isLoading = false;
  state.error = null;
  state.items.push(action.payload);
  state.productDetails = action.payload;
};

const handleDeleteProductFulfilled = (
  state: IProductsState,
  action: PayloadAction<IProduct>
) => {
  state.isLoading = false;
  state.error = null;
  deleteProductFromList(state.items, action.payload._id);
  state.productDetails = null;
};

const handleUpdateProductFulfilled = (
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
  reducers: {
    clearProduct: state => {
      state.productDetails = null;
    },
  },
  extraReducers: builder =>
    builder
      .addCase(fetchProducts.pending, handlePending)
      .addCase(fetchProducts.fulfilled, handleFetchProductsFulfilled)
      .addCase(fetchProducts.rejected, handleRejected)
      .addCase(fetchProductById.pending, handlePending)
      .addCase(fetchProductById.fulfilled, handleFetchProductByIdFulfilled)
      .addCase(fetchProductById.rejected, handleRejected)
      .addCase(addProduct.pending, handlePending)
      .addCase(addProduct.fulfilled, handleAddProductFulfilled)
      .addCase(addProduct.rejected, handleRejected)
      .addCase(deleteProduct.pending, handlePending)
      .addCase(deleteProduct.fulfilled, handleDeleteProductFulfilled)
      .addCase(deleteProduct.rejected, handleRejected)
      .addCase(updateProduct.pending, handlePending)
      .addCase(updateProduct.fulfilled, handleUpdateProductFulfilled)
      .addCase(updateProduct.rejected, handleRejected),
});

export const { clearProduct } = productsSlice.actions;
export const productsReducer = productsSlice.reducer;
