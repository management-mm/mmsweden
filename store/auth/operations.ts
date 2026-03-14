import { createAsyncThunk } from '@reduxjs/toolkit';

import { api } from '@store/api';
import type { RootState } from '@store/store';

interface LogInCredentials {
  email: string;
  password: string;
}

interface LogInResponse {
  token: string;
  user: { name: string | null; email: string | null };
}

export const logIn = createAsyncThunk<
  LogInResponse,
  LogInCredentials,
  { rejectValue: string }
>('auth/login', async (credentials, thunkAPI) => {
  try {
    const response = await api.post('auth/login', credentials);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue((error as Error).message);
  }
});

export const logOut = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logout',
  async (_, thunkAPI) => {
    try {
      await api.post('auth/logout');
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  }
);

export const refreshUser = createAsyncThunk<
  { email: string | null },
  void,
  { state: RootState; rejectValue: string }
>('auth/refresh', async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const persistedToken = state.auth.token;

  if (!persistedToken) {
    return thunkAPI.rejectWithValue('Unable to fetch user');
  }

  try {
    const response = await api.get('auth/current');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue((error as Error).message);
  }
});
