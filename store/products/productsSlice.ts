import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { IProduct } from 'interfaces/IProduct';

import {
  addProduct,
  deleteProduct,
  fetchProductBySlug,
  generateDescWithAi,
  updateProduct,
} from './operations';

import type { ThunkRejectValue } from '@utils/errors/createThunkRejectValue';

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
  error: ThunkRejectValue | null;
  cache: Record<string, ProductsCacheEntry>;
  statusByKey: Record<string, 'idle' | 'loading' | 'succeeded' | 'failed'>;
  errorByKey: Record<string, ThunkRejectValue | null>;
}

type ProductRejectedAction =
  | ReturnType<typeof fetchProductBySlug.rejected>
  | ReturnType<typeof addProduct.rejected>
  | ReturnType<typeof deleteProduct.rejected>
  | ReturnType<typeof updateProduct.rejected>;

type AiRejectedAction = ReturnType<typeof generateDescWithAi.rejected>;

const createFallbackRejectValue = (message?: string): ThunkRejectValue => ({
  message: message || 'Something went wrong. Please try again.',
  code: 'UNKNOWN',
});

const getRejectedPayload = (
  action: ProductRejectedAction | AiRejectedAction
): ThunkRejectValue => {
  return action.payload ?? createFallbackRejectValue(action.error.message);
};

const handlePending = (state: IProductsState) => {
  state.isLoading = true;
  state.error = null;
};

const handleRejected = (
  state: IProductsState,
  action: ProductRejectedAction
) => {
  state.isLoading = false;
  state.error = getRejectedPayload(action);
};

const handleGenerateDescWithAiPending = (state: IProductsState) => {
  state.isAiGenerating = true;
  state.error = null;
};

const handleGenerateDescWithAiRejected = (
  state: IProductsState,
  action: AiRejectedAction
) => {
  state.isAiGenerating = false;
  state.error = getRejectedPayload(action);
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
      state.error = null;
    },
    clearProductsError: state => {
      state.error = null;
    },
    setInitialProducts: (
      state,
      action: PayloadAction<{
        items: IProduct[];
        total: number;
        cacheKey?: string;
      }>
    ) => {
      const { items, total, cacheKey } = action.payload;

      state.items = items;
      state.total = total;
      state.isLoading = false;
      state.error = null;

      if (cacheKey) {
        state.cache[cacheKey] = {
          items,
          total,
          lastFetchedAt: Date.now(),
        };

        state.statusByKey[cacheKey] = 'succeeded';
        state.errorByKey[cacheKey] = null;
      }
    },
  },
  extraReducers: builder =>
    builder
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
      .addCase(generateDescWithAi.rejected, handleGenerateDescWithAiRejected),
});

export const { clearProduct, clearProductsError, setInitialProducts } =
  productsSlice.actions;
export const productsReducer = productsSlice.reducer;
