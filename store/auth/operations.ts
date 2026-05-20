import { createAsyncThunk } from '@reduxjs/toolkit';

import { api } from '@store/api';
import type { RootState } from '@store/store';

import { AppError } from '@utils/errors/AppError';
import {
  type ThunkRejectValue,
  createThunkRejectValue,
} from '@utils/errors/createThunkRejectValue';
import { logError } from '@utils/errors/logError';

interface LogInCredentials {
  email: string;
  password: string;
}

export interface User {
  name?: string | null;
  email: string | null;
}

interface SuccessfulLogInResponse {
  requiresTwoFactor?: false;
  token: string;
  user: User;
}

interface TwoFactorRequiredResponse {
  requiresTwoFactor: true;
  userId: string;
  method: 'email';
  message: string;
}

export type LogInResponse = SuccessfulLogInResponse | TwoFactorRequiredResponse;

interface VerifyTwoFactorCredentials {
  userId: string;
  code: string;
}

interface VerifyTwoFactorResponse {
  token: string;
  user: User;
}

export const logIn = createAsyncThunk<
  LogInResponse,
  LogInCredentials,
  { rejectValue: ThunkRejectValue }
>('auth/login', async (credentials, thunkAPI) => {
  try {
    const response = await api.post<LogInResponse>('auth/login', credentials);

    return response.data;
  } catch (error) {
    logError(error, {
      scope: 'logIn',
      details: {
        email: credentials.email,
      },
    });

    return thunkAPI.rejectWithValue(createThunkRejectValue(error));
  }
});

export const verifyTwoFactor = createAsyncThunk<
  VerifyTwoFactorResponse,
  VerifyTwoFactorCredentials,
  { rejectValue: ThunkRejectValue }
>('auth/2fa/verify', async (credentials, thunkAPI) => {
  try {
    const response = await api.post<VerifyTwoFactorResponse>(
      'auth/2fa/verify',
      credentials
    );

    return response.data;
  } catch (error) {
    logError(error, {
      scope: 'verifyTwoFactor',
      details: {
        userId: credentials.userId,
      },
    });

    return thunkAPI.rejectWithValue(createThunkRejectValue(error));
  }
});

export const logOut = createAsyncThunk<
  void,
  void,
  { rejectValue: ThunkRejectValue }
>('auth/logout', async (_, thunkAPI) => {
  try {
    await api.post('auth/logout');
  } catch (error) {
    logError(error, {
      scope: 'logOut',
    });

    return thunkAPI.rejectWithValue(createThunkRejectValue(error));
  }
});

export const refreshUser = createAsyncThunk<
  User,
  void,
  { state: RootState; rejectValue: ThunkRejectValue }
>('auth/refresh', async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const persistedToken = state.auth.token;

  if (!persistedToken) {
    return thunkAPI.rejectWithValue(
      createThunkRejectValue(
        new AppError('Unable to fetch user', 'UNAUTHORIZED')
      )
    );
  }

  try {
    const response = await api.get<User>('auth/current');

    return response.data;
  } catch (error) {
    logError(error, {
      scope: 'refreshUser',
    });

    return thunkAPI.rejectWithValue(createThunkRejectValue(error));
  }
});
