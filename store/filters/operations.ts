import type { MultiLanguageString } from '@interfaces/IProduct';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { ICategory } from 'interfaces/ICategory';
import type { IIndustry } from 'interfaces/IIndustry';
import type { IManufacturer } from 'interfaces/IManufacturer';

import type { LanguageKeys } from '@enums/languageKeys';

// 'https://mmsweden-server.onrender.com/'

axios.defaults.baseURL = 'https://mmsweden-server.onrender.com/';

export interface IFetchCategoriesOrIndustriesParams {
  lang: LanguageKeys;
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
  { rejectValue: string }
>('categories/fetchCategories', async (params, thunkAPI) => {
  try {
    const response = await axios.get<ICategory[]>('categories/', {
      params,
    });
    return response.data;
  } catch (e) {
    return thunkAPI.rejectWithValue((e as Error).message);
  }
});

export const fetchManufacturers = createAsyncThunk<
  IManufacturer[],
  IFetchManufacturersParams,
  { rejectValue: string }
>('manufacturers/fetchManufacturers', async (params, thunkAPI) => {
  try {
    const response = await axios.get<IManufacturer[]>('manufacturers/', {
      params,
    });
    return response.data;
  } catch (e) {
    return thunkAPI.rejectWithValue((e as Error).message);
  }
});

export const fetchIndustries = createAsyncThunk<
  IIndustry[],
  IFetchCategoriesOrIndustriesParams,
  { rejectValue: string }
>('industries/fetchIndustries', async (params, thunkAPI) => {
  try {
    const response = await axios.get<IIndustry[]>('industries/', {
      params,
    });
    return response.data;
  } catch (e) {
    return thunkAPI.rejectWithValue((e as Error).message);
  }
});

export const updateCategory = createAsyncThunk<
  ICategory,
  IUpdateFilterData,
  { rejectValue: string }
>('categories/updateCategory', async (updatedCategory, thunkAPI) => {
  try {
    const response = await axios.put(`categories/${updatedCategory.id}`, {
      name: updatedCategory.name,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    return thunkAPI.rejectWithValue((e as Error).message);
  }
});

export const updateManufacturer = createAsyncThunk<
  IManufacturer,
  IUpdateFilterData,
  { rejectValue: string }
>('manufacturers/updateManufacturer', async (updatedManufacturer, thunkAPI) => {
  try {
    const response = await axios.put(
      `manufacturers/${updatedManufacturer.id}`,
      { name: updatedManufacturer.name }
    );
    return response.data;
  } catch (e) {
    console.log(e);
    return thunkAPI.rejectWithValue((e as Error).message);
  }
});

export const updateIndustry = createAsyncThunk<
  IIndustry,
  IUpdateFilterData,
  { rejectValue: string }
>('industries/updateIndustry', async (updatedIndustry, thunkAPI) => {
  try {
    const response = await axios.put(`industries/${updatedIndustry.id}`, {
      name: updatedIndustry.name,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    return thunkAPI.rejectWithValue((e as Error).message);
  }
});
