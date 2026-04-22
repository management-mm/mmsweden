import { createAsyncThunk } from '@reduxjs/toolkit';
import type { IProduct, MultiLanguageString } from 'interfaces/IProduct';

import { api } from '@store/api';

import { AppError } from '@utils/errors/AppError';
import {
  type ThunkRejectValue,
  createThunkRejectValue,
} from '@utils/errors/createThunkRejectValue';
import { logError } from '@utils/errors/logError';

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
  manufacturer: string;
  industries: string[];
  condition: 'used' | 'new';
  deletionDate: Date | null | string;
  shouldTranslateName: boolean;
  seoSubcategoryId: string;
  seoCategoryId: string;
  productCategoryId: string;
}

export interface IGenerateDescData {
  description: string;
}

export interface IFetchProductsResponse {
  products: IProduct[];
  total: number;
}

export const fetchProductBySlug = createAsyncThunk<
  IProduct,
  { slug: string | undefined },
  { rejectValue: ThunkRejectValue }
>('product/fetchBySlug', async ({ slug }, thunkAPI) => {
  try {
    if (!slug) {
      return thunkAPI.rejectWithValue(
        createThunkRejectValue(new AppError('Slug is required', 'VALIDATION'))
      );
    }

    const response = await api.get(`products/by-slug/${slug}`);
    return response.data;
  } catch (error) {
    logError(error, {
      scope: 'fetchProductBySlug',
      details: { slug },
    });

    return thunkAPI.rejectWithValue(createThunkRejectValue(error));
  }
});

export const fetchRecommendedProductsById = createAsyncThunk<
  IFetchProductsResponse,
  { productId: string | undefined },
  { rejectValue: ThunkRejectValue }
>('fetchRecommendedProductsById', async ({ productId }, thunkAPI) => {
  try {
    if (!productId) {
      return thunkAPI.rejectWithValue(
        createThunkRejectValue(
          new AppError('Product ID is required', 'VALIDATION')
        )
      );
    }

    const response = await api.get(
      `products/${productId}/recommended-products`
    );

    return response.data;
  } catch (error) {
    logError(error, {
      scope: 'fetchRecommendedProductsById',
      details: { productId },
    });

    return thunkAPI.rejectWithValue(createThunkRejectValue(error));
  }
});

export const addProduct = createAsyncThunk<
  IProduct,
  IAddProductData,
  { rejectValue: ThunkRejectValue }
>('products/addProduct', async (newProduct, thunkAPI) => {
  try {
    const data = new FormData();

    for (const property in newProduct) {
      if (Object.prototype.hasOwnProperty.call(newProduct, property)) {
        const key = property as keyof IAddProductData;

        if (key === 'shouldTranslateName') continue;

        if (key === 'industries') {
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
  } catch (error) {
    logError(error, {
      scope: 'addProduct',
      details: {
        idNumber: newProduct.idNumber,
        manufacturer: newProduct.manufacturer,
      },
    });

    return thunkAPI.rejectWithValue(createThunkRejectValue(error));
  }
});

export const updateProduct = createAsyncThunk<
  IProduct,
  IUpdateProductData,
  { rejectValue: ThunkRejectValue }
>('products/updateProduct', async (updatedProduct, thunkAPI) => {
  try {
    const data = new FormData();

    for (const property in updatedProduct) {
      if (Object.prototype.hasOwnProperty.call(updatedProduct, property)) {
        const key = property as keyof IUpdateProductData;

        if (key === 'id') continue;
        if (key === 'shouldTranslateName') continue;
        if (key === 'deletionDate' && !updatedProduct[key]) continue;

        if (
          (key === 'name' || key === 'description') &&
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
          const value = updatedProduct[key];

          if (typeof value === 'string' && value.trim() === '') continue;
          if (value === null || value === undefined) continue;

          data.append(key, String(value));
        }
      }
    }

    const response = await api.put(`products/${updatedProduct.id}`, data, {
      params: {
        shouldTranslateName: String(updatedProduct.shouldTranslateName),
      },
    });

    return response.data;
  } catch (error) {
    logError(error, {
      scope: 'updateProduct',
      details: {
        productId: updatedProduct.id,
        idNumber: updatedProduct.idNumber,
      },
    });

    return thunkAPI.rejectWithValue(createThunkRejectValue(error));
  }
});

export const generateDescWithAi = createAsyncThunk<
  string,
  IGenerateDescData,
  { rejectValue: ThunkRejectValue }
>('products/description/ai', async (descData, thunkAPI) => {
  try {
    const response = await api.post('products/description/ai', descData);
    return response.data;
  } catch (error) {
    logError(error, {
      scope: 'generateDescWithAi',
    });

    return thunkAPI.rejectWithValue(createThunkRejectValue(error));
  }
});

export const deleteProduct = createAsyncThunk<
  IProduct,
  { productId: string | undefined },
  { rejectValue: ThunkRejectValue }
>('products/deleteProduct', async ({ productId }, thunkAPI) => {
  try {
    if (!productId) {
      return thunkAPI.rejectWithValue(
        createThunkRejectValue(
          new AppError('Product ID is required', 'VALIDATION')
        )
      );
    }

    const response = await api.delete(`products/${productId}`);
    return response.data;
  } catch (error) {
    logError(error, {
      scope: 'deleteProduct',
      details: { productId },
    });

    return thunkAPI.rejectWithValue(createThunkRejectValue(error));
  }
});
