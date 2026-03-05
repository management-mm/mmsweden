'use client';

import { createAsyncThunk } from '@reduxjs/toolkit';
import type { IProduct, MultiLanguageString } from 'interfaces/IProduct';

import { api } from '@store/api';

import type { LanguageKeys } from '@enums/languageKeys';

// 'https://mmsweden-server.onrender.com/'

export interface IFetchProductsParams {
  lang?: LanguageKeys;
  sort?: string;
  perPage?: number;
  page?: number;
  keyword?: string;
  category?: string[];
  industry?: string[];
  manufacturer?: string;
  mode?: 'replace' | 'append';
  cacheKey?: string;
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
  industries: string[];
  condition: 'used' | 'new';
  shouldTranslateName: boolean;
}

export interface IUpdateProductData {
  id: string;
  name: string | MultiLanguageString;
  idNumber: string;
  description: string | MultiLanguageString;
  dimensions: string;
  photoQueue: (string | File)[];
  photos: File[];
  video: string;
  category: string | MultiLanguageString;
  manufacturer: string;
  industries: string[];
  condition: 'used' | 'new';
  deletionDate: Date | null | string;
  shouldTranslateName: boolean;
}

export interface IGenerateDescData {
  description: string;
}

export interface IFetchProductsResponse {
  products: IProduct[];
  total: number;
}

export const fetchProducts = createAsyncThunk<
  IFetchProductsResponse,
  IFetchProductsParams,
  { rejectValue: string }
>('products/fetchAll', async (args, thunkAPI) => {
  try {
    const { cacheKey, mode, ...queryParams } = args;

    const response = await api.get<IFetchProductsResponse>('products/', {
      params: queryParams,
    });

    return response.data;
  } catch (e) {
    return thunkAPI.rejectWithValue((e as Error).message);
  }
});

export const fetchProductBySlug = createAsyncThunk<
  IProduct,
  { slug: string | undefined },
  { rejectValue: string }
>('product/fetchBySlug', async ({ slug }, thunkAPI) => {
  try {
    if (!slug) return thunkAPI.rejectWithValue('Slug is required');

    const response = await api.get(`products/by-slug/${slug}`);
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
    const response = await api.get(
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
    console.log(newProduct.photos);
    for (const property in newProduct) {
      if (Object.prototype.hasOwnProperty.call(newProduct, property)) {
        const key = property as keyof IAddProductData;
        if (key === 'shouldTranslateName') continue;
        else if (key === 'industries') {
          data.append('industries', newProduct[key].join(','));
        } else if (key === 'photos') {
          newProduct[key].forEach(photo => {
            data.append('photos', photo);
          });
        } else {
          data.append(key, newProduct[key] as string);
        }
      }
    }
    const response = await api.post('products', data, {
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

export const updateProduct = createAsyncThunk<
  IProduct,
  IUpdateProductData,
  { rejectValue: string }
>('products/updateProduct', async (updatedProduct, thunkAPI) => {
  try {
    const data = new FormData();

    for (const property in updatedProduct) {
      if (Object.prototype.hasOwnProperty.call(updatedProduct, property)) {
        const key = property as keyof IUpdateProductData;

        if (key === 'id') continue;
        if (key === 'shouldTranslateName') continue;
        if (key === 'deletionDate' && !updatedProduct[key]) continue;
        else if (
          (key === 'name' || key === 'description' || key === 'category') &&
          typeof updatedProduct[key] === 'object'
        ) {
          data.append(key, JSON.stringify(updatedProduct[key]));
        } else if (key === 'industries') {
          data.append('industries', updatedProduct[key].join(','));
        } else if (key === 'photoQueue') {
          const stringsArray = updatedProduct[key].map(item => {
            if (typeof item === 'string') {
              return item;
            }
            return 'file';
          });
          data.append('photoQueue', stringsArray.join(','));
        } else if (key === 'photos') {
          updatedProduct[key].forEach(photo => {
            data.append('photos', photo);
          });
        } else {
          const v = updatedProduct[key];

          if (typeof v === 'string' && v.trim() === '') continue;
          if (v === null || v === undefined) continue;

          data.append(key, v as string);
        }
      }
    }
    const response = await api.put(`products/${updatedProduct.id}`, data, {
      params: {
        shouldTranslateName: String(updatedProduct.shouldTranslateName),
      },
    });
    return response.data;
  } catch (e) {
    return thunkAPI.rejectWithValue((e as Error).message);
  }
});

export const generateDescWithAi = createAsyncThunk<
  string,
  IGenerateDescData,
  { rejectValue: string }
>('products/description/ai', async (descData, thunkAPI) => {
  try {
    const response = await api.post('products/description/ai', descData);
    return response.data;
  } catch (e) {
    return thunkAPI.rejectWithValue((e as Error).message);
  }
});

export const deleteProduct = createAsyncThunk<
  IProduct,
  { productId: string | undefined },
  { rejectValue: string }
>('products/deleteProduct', async ({ productId }, thunkAPI) => {
  try {
    const response = await api.delete(`products/${productId}`);
    return response.data;
  } catch (e) {
    return thunkAPI.rejectWithValue((e as Error).message);
  }
});
