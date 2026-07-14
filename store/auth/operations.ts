import { createAsyncThunk } from '@reduxjs/toolkit';

import { api } from '@store/api';

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

interface BackendAuthenticatedResponse {
  authenticated: true;
}

interface SuccessfulLogInResponse {
  requiresTwoFactor?: false;
  authenticated: true;
  user: User;
}

interface TwoFactorRequiredResponse {
  requiresTwoFactor: true;
  userId: string;
  method: 'email';
  message: string;
}

type BackendLogInResponse =
  BackendAuthenticatedResponse | TwoFactorRequiredResponse;

export type LogInResponse = SuccessfulLogInResponse | TwoFactorRequiredResponse;

interface VerifyTwoFactorCredentials {
  userId: string;
  code: string;
}

export interface VerifyTwoFactorResponse {
  authenticated: true;
  user: User;
}

const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>('auth/current');

  return response.data;
};

export const logIn = createAsyncThunk<
  LogInResponse,
  LogInCredentials,
  { rejectValue: ThunkRejectValue }
>('auth/login', async (credentials, thunkAPI) => {
  try {
    const response = await api.post<BackendLogInResponse>(
      'auth/login',
      credentials
    );

    const result = response.data;

    if ('requiresTwoFactor' in result && result.requiresTwoFactor) {
      return result;
    }

    const user = await getCurrentUser();

    return {
      authenticated: true,
      requiresTwoFactor: false,
      user,
    };
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
    await api.post<BackendAuthenticatedResponse>(
      'auth/2fa/verify',
      credentials
    );

    const user = await getCurrentUser();

    return {
      authenticated: true,
      user,
    };
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
  { rejectValue: ThunkRejectValue }
>('auth/refresh', async (_, thunkAPI) => {
  try {
    return await getCurrentUser();
  } catch (error) {
    logError(error, {
      scope: 'refreshUser',
    });

    return thunkAPI.rejectWithValue(createThunkRejectValue(error));
  }
});
