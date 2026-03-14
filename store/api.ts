import axios from 'axios';

import { resetAuthState, setAuthError } from '@store/auth/slice';
import type { AppStore } from '@store/store';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

const getPersistedToken = (): string | null => {
  if (typeof window === 'undefined') return null;

  const raw = window.localStorage.getItem('persist:auth');
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    return parsed.token ? JSON.parse(parsed.token) : null;
  } catch {
    return null;
  }
};

api.interceptors.request.use(config => {
  const token = getPersistedToken();

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
      const hasToken = !!getPersistedToken();

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
        store.dispatch(setAuthError('Session expired. Please log in again.'));

        window.localStorage.removeItem('persist:auth');

        setTimeout(() => {
          is401Handled = false;
        }, 300);
      }

      return Promise.reject(error);
    }
  );
};
