import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { IProduct } from 'interfaces/IProduct';

import {
  type IFetchProductsParams,
  type IFetchProductsResponse,
  addProduct,
  deleteProduct,
  fetchProductBySlug,
  fetchProducts,
  generateDescWithAi,
  updateProduct,
} from './operations';

import { handlePending, handleRejected } from '@store/handlers';

const deleteProductFromList = (products: IProduct[], productId: string) => {
  const index = products.findIndex(product => product._id === productId);
  if (index !== -1) products.splice(index, 1);
};

type ProductsCacheEntry = {
  items: IProduct[];
  total: number;
  lastFetchedAt: number | null;
};

interface IProductsState {
  items: IProduct[];
  descWithAi: string;
  total: number;
  productDetails: IProduct | null;
  itemsForQuote: IProduct[];
  isAiGenerating: boolean;
  isLoading: boolean;
  error: string | null;
  cache: Record<string, ProductsCacheEntry>;
  statusByKey: Record<string, 'idle' | 'loading' | 'succeeded' | 'failed'>;
  errorByKey: Record<string, string | null>;
}

const handleFetchProductsPending = (
  state: IProductsState,
  action: PayloadAction<unknown, string, { arg: IFetchProductsParams }>
) => {
  state.isLoading = true;
  state.error = null;

  const cacheKey = action.meta.arg.cacheKey;
  if (cacheKey) {
    state.statusByKey[cacheKey] = 'loading';
    state.errorByKey[cacheKey] = null;
  }
};

const handleFetchProductsRejected = (
  state: IProductsState,
  action: PayloadAction<unknown, string, { arg: IFetchProductsParams }>
) => {
  state.isLoading = false;
  state.error = 'Request failed';

  const cacheKey = action.meta.arg.cacheKey;
  if (cacheKey) {
    state.statusByKey[cacheKey] = 'failed';
    state.errorByKey[cacheKey] = 'Request failed';
  }
};
const handleFetchProductsFulfilled = (
  state: IProductsState,
  action: PayloadAction<
    IFetchProductsResponse,
    string,
    { arg: IFetchProductsParams }
  >
) => {
  state.isLoading = false;
  state.error = null;

  const mode = action.meta.arg.mode ?? 'replace';

  if (mode === 'append') {
    state.items = [...state.items, ...action.payload.products];
  } else {
    state.items = action.payload.products;
  }

  state.total = action.payload.total;

  const cacheKey = action.meta.arg.cacheKey;
  if (cacheKey) {
    state.cache[cacheKey] = {
      items: action.payload.products,
      total: action.payload.total,
      lastFetchedAt: Date.now(),
    };
    state.statusByKey[cacheKey] = 'succeeded';
    state.errorByKey[cacheKey] = null;
  }
};

const handleFetchProductBySlugFulfilled = (
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

const handleGenerateDescWithAiPending = (state: IProductsState) => {
  state.isAiGenerating = true;
};

const handleGenerateDescWithAiFulfilled = (
  state: IProductsState,
  action: PayloadAction<string>
) => {
  state.isAiGenerating = false;
  state.error = null;
  state.descWithAi = action.payload;
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

const initialState: IProductsState = {
  items: [],
  descWithAi: '',
  total: 0,
  productDetails: null,
  itemsForQuote: [],
  isAiGenerating: false,
  isLoading: false,
  error: null,
  cache: {},
  statusByKey: {},
  errorByKey: {},
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProduct: state => {
      state.productDetails = null;
    },
  },
  extraReducers: builder =>
    builder
      .addCase(fetchProducts.pending, handleFetchProductsPending)
      .addCase(fetchProducts.fulfilled, handleFetchProductsFulfilled)
      .addCase(fetchProducts.rejected, handleFetchProductsRejected)
      .addCase(fetchProductBySlug.pending, handlePending)
      .addCase(fetchProductBySlug.fulfilled, handleFetchProductBySlugFulfilled)
      .addCase(fetchProductBySlug.rejected, handleRejected)
      .addCase(addProduct.pending, handlePending)
      .addCase(addProduct.fulfilled, handleAddProductFulfilled)
      .addCase(addProduct.rejected, handleRejected)
      .addCase(deleteProduct.pending, handlePending)
      .addCase(deleteProduct.fulfilled, handleDeleteProductFulfilled)
      .addCase(deleteProduct.rejected, handleRejected)
      .addCase(updateProduct.pending, handlePending)
      .addCase(updateProduct.fulfilled, handleUpdateProductFulfilled)
      .addCase(updateProduct.rejected, handleRejected)
      .addCase(generateDescWithAi.pending, handleGenerateDescWithAiPending)
      .addCase(generateDescWithAi.fulfilled, handleGenerateDescWithAiFulfilled)
      .addCase(generateDescWithAi.rejected, handleRejected),
});

export const { clearProduct } = productsSlice.actions;
export const productsReducer = productsSlice.reducer;
