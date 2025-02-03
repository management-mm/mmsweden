import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { IProduct } from 'interfaces/IProduct';

import type { LanguageKeys } from '@enums/languageKeys';

// 'https://mmsweden-server.onrender.com/'

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

export interface IAddProductData {
  name: string;
  idNumber: string;
  description: string;
  dimensions: string;
  photos: File[];
  video: string;
  category: string;
  manufacturer: string;
  industries: string;
  condition: 'used' | 'new';
  shouldTranslateName: boolean;
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

export const addProduct = createAsyncThunk<
  IProduct,
  IAddProductData,
  { rejectValue: string }
>('products/addProduct', async (newProduct, thunkAPI) => {
  try {
    const data = new FormData();
    for (const property in newProduct) {
      if (Object.prototype.hasOwnProperty.call(newProduct, property)) {
        const key = property as keyof IAddProductData;
        if (key === 'shouldTranslateName') continue;
        else if (key === 'photos') {
          newProduct[key].forEach(photo => {
            data.append('photos', photo);
          });
        } else {
          data.append(key, newProduct[key] as string);
        }
      }
    }
    const response = await axios.post('products', data, {
      params: {
        shouldTranslateName: String(newProduct.shouldTranslateName),
      },
    });
    return response.data;
  } catch (e) {
    console.log(e);
    return thunkAPI.rejectWithValue((e as Error).message);
  }
});

export const deleteProduct = createAsyncThunk<
  IProduct,
  { productId: string | undefined },
  { rejectValue: string }
>("products/deleteProduct",
  async ({productId}, thunkAPI) => {
    try {
      const response = await axios.delete(`products/${productId}`);
      return response.data
    } catch (e) {
      return thunkAPI.rejectWithValue((e as Error).message);
    }
  }
)
