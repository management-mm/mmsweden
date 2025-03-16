import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import type { RootState } from '@store/store';

// http://localhost:3000/
// https://mmsweden-server.onrender.com/

axios.defaults.baseURL = 'https://mmsweden-server.onrender.com/';

const setAuthHeader = (token: string) => {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
};

const clearAuthHeader = () => {
  axios.defaults.headers.common.Authorization = '';
};

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
    console.log(credentials);
    const response = await axios.post('auth/login', credentials);
    setAuthHeader(response.data.token);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue((error as Error).message);
  }
});

export const logOut = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logout',
  async (_, thunkAPI) => {
    try {
      await axios.post('auth/logout');
      clearAuthHeader();
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
    setAuthHeader(persistedToken);
    const response = await axios.get('auth/current');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue((error as Error).message);
  }
});
