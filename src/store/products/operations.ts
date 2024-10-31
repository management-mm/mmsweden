import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { IProduct } from 'interfaces/IProduct';

import type { LanguageKeys } from '@enums/languageKeys';

axios.defaults.baseURL = 'https://mmsweden-server.onrender.com/';

export interface IFetchProductsParams {
  lang?: LanguageKeys;
  sort?: string;
  perPage?: number;
  page?: number;
  keyword?: string;
  category?: string[];
  industry?: string[];
  manufacturer?: string;
}

export interface IFetchProductsResponse {
  products: IProduct[];
  total: number;
}

export const fetchProducts = createAsyncThunk<
  IFetchProductsResponse,
  IFetchProductsParams,
  { rejectValue: string }
>('products/fetchAll', async (params, thunkAPI) => {
  try {
    const response = await axios.get<IFetchProductsResponse>('products/', {
      params,
    });
    return response.data;
  } catch (e) {
    return thunkAPI.rejectWithValue((e as Error).message);
  }
});

export const fetchProductById = createAsyncThunk<
  IProduct,
  { productId: string | undefined },
  { rejectValue: string }
>('fetchProductById', async ({ productId }, thunkAPI) => {
  try {
    const response = await axios.get(`products/${productId}`);
    return response.data;
  } catch (e) {
    return thunkAPI.rejectWithValue((e as Error).message);
  }
});

export const fetchRecommendedProductsById = createAsyncThunk<
  IFetchProductsResponse,
  { productId: string | undefined },
  { rejectValue: string }
>('fetchRecommendedProductsById', async ({ productId }, thunkAPI) => {
  try {
    const response = await axios.get(
      `products/${productId}/recommended-products`
    );
    return response.data;
  } catch (e) {
    return thunkAPI.rejectWithValue((e as Error).message);
  }
});
