import { getAuthToken } from '@api/getAuthToken';
import axios from 'axios';

import { resetAuthState, setAuthError } from '@store/auth/slice';
import type { AppStore } from '@store/store';

import { AppError } from '@utils/errors/AppError';
import { createThunkRejectValue } from '@utils/errors/createThunkRejectValue';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use(config => {
  const token = getAuthToken();

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let is401Handled = false;
let responseInterceptorInitialized = false;

export const setupApiInterceptors = (store: AppStore) => {
  if (responseInterceptorInitialized) return;

  responseInterceptorInitialized = true;

  api.interceptors.response.use(
    response => response,
    error => {
      const status = error.response?.status;
      const requestUrl = error.config?.url ?? '';
      const hasToken = !!getAuthToken();

      const isAuthRequest =
        requestUrl.includes('/auth/login') ||
        requestUrl.includes('/auth/signup') ||
        requestUrl.includes('/auth/logout');

      if (
        typeof window !== 'undefined' &&
        status === 401 &&
        hasToken &&
        !isAuthRequest &&
        !is401Handled
      ) {
        is401Handled = true;

        store.dispatch(resetAuthState());
        store.dispatch(
          setAuthError(
            createThunkRejectValue(
              new AppError(
                'Session expired. Please log in again.',
                'UNAUTHORIZED',
                { status: 401 }
              )
            )
          )
        );

        window.localStorage.removeItem('persist:auth');

        setTimeout(() => {
          is401Handled = false;
        }, 300);
      }

      return Promise.reject(error);
    }
  );
};
