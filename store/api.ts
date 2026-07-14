import axios from 'axios';

import { resetAuthState, setAuthError } from '@store/auth/slice';
import type { AppStore } from '@store/store';

import { AppError } from '@utils/errors/AppError';
import { createThunkRejectValue } from '@utils/errors/createThunkRejectValue';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

let is401Handled = false;
let responseInterceptorInitialized = false;

const isAuthenticationRequest = (requestUrl: string): boolean => {
  return requestUrl.includes('/auth/');
};

export const setupApiInterceptors = (store: AppStore): void => {
  if (responseInterceptorInitialized) {
    return;
  }

  responseInterceptorInitialized = true;

  api.interceptors.response.use(
    response => response,
    error => {
      const status = error.response?.status;
      const requestUrl = error.config?.url ?? '';
      const isLoggedIn = store.getState().auth.isLoggedIn;

      if (
        typeof window !== 'undefined' &&
        status === 401 &&
        isLoggedIn &&
        !isAuthenticationRequest(requestUrl) &&
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
                {
                  status: 401,
                }
              )
            )
          )
        );

        window.setTimeout(() => {
          is401Handled = false;
        }, 300);
      }

      return Promise.reject(error);
    }
  );
};
