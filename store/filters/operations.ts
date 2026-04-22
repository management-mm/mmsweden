import type { MultiLanguageString } from '@interfaces/IProduct';
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { ICategory } from 'interfaces/ICategory';
import type { IIndustry } from 'interfaces/IIndustry';
import type { IManufacturer } from 'interfaces/IManufacturer';

import { api } from '@store/api';

import {
  type ThunkRejectValue,
  createThunkRejectValue,
} from '@utils/errors/createThunkRejectValue';
import { logError } from '@utils/errors/logError';

import { AppLocale } from '@i18n/config';

export interface IFetchCategoriesOrIndustriesParams {
  lang: AppLocale;
  keyword?: string;
}

export interface IFetchManufacturersParams {
  keyword?: string;
}

export interface IUpdateFilterData {
  id: string;
  name: MultiLanguageString | string;
}

export const fetchCategories = createAsyncThunk<
  ICategory[],
  IFetchCategoriesOrIndustriesParams,
  { rejectValue: ThunkRejectValue }
>('categories/fetchCategories', async (params, thunkAPI) => {
  try {
    const response = await api.get<ICategory[]>('categories/', {
      params,
    });

    return response.data;
  } catch (error) {
    logError(error, {
      scope: 'fetchCategories',
      details: params,
    });

    return thunkAPI.rejectWithValue(createThunkRejectValue(error));
  }
});

export const fetchManufacturers = createAsyncThunk<
  IManufacturer[],
  IFetchManufacturersParams,
  { rejectValue: ThunkRejectValue }
>('manufacturers/fetchManufacturers', async (params, thunkAPI) => {
  try {
    const response = await api.get<IManufacturer[]>('manufacturers/', {
      params,
    });

    return response.data;
  } catch (error) {
    logError(error, {
      scope: 'fetchManufacturers',
      details: params,
    });

    return thunkAPI.rejectWithValue(createThunkRejectValue(error));
  }
});

export const fetchIndustries = createAsyncThunk<
  IIndustry[],
  IFetchCategoriesOrIndustriesParams,
  { rejectValue: ThunkRejectValue }
>('industries/fetchIndustries', async (params, thunkAPI) => {
  try {
    const response = await api.get<IIndustry[]>('industries/', {
      params,
    });

    return response.data;
  } catch (error) {
    logError(error, {
      scope: 'fetchIndustries',
      details: params,
    });

    return thunkAPI.rejectWithValue(createThunkRejectValue(error));
  }
});

export const updateCategory = createAsyncThunk<
  ICategory,
  IUpdateFilterData,
  { rejectValue: ThunkRejectValue }
>('categories/updateCategory', async (updatedCategory, thunkAPI) => {
  try {
    const response = await api.put(`categories/${updatedCategory.id}`, {
      name: updatedCategory.name,
    });

    return response.data;
  } catch (error) {
    logError(error, {
      scope: 'updateCategory',
      details: {
        id: updatedCategory.id,
      },
    });

    return thunkAPI.rejectWithValue(createThunkRejectValue(error));
  }
});

export const updateManufacturer = createAsyncThunk<
  IManufacturer,
  IUpdateFilterData,
  { rejectValue: ThunkRejectValue }
>('manufacturers/updateManufacturer', async (updatedManufacturer, thunkAPI) => {
  try {
    const response = await api.put(`manufacturers/${updatedManufacturer.id}`, {
      name: updatedManufacturer.name,
    });

    return response.data;
  } catch (error) {
    logError(error, {
      scope: 'updateManufacturer',
      details: {
        id: updatedManufacturer.id,
      },
    });

    return thunkAPI.rejectWithValue(createThunkRejectValue(error));
  }
});

export const updateIndustry = createAsyncThunk<
  IIndustry,
  IUpdateFilterData,
  { rejectValue: ThunkRejectValue }
>('industries/updateIndustry', async (updatedIndustry, thunkAPI) => {
  try {
    const response = await api.put(`industries/${updatedIndustry.id}`, {
      name: updatedIndustry.name,
    });

    return response.data;
  } catch (error) {
    logError(error, {
      scope: 'updateIndustry',
      details: {
        id: updatedIndustry.id,
      },
    });

    return thunkAPI.rejectWithValue(createThunkRejectValue(error));
  }
});
