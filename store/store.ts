import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
} from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';

import { type AuthState, authReducer } from './auth/slice';
import { categoriesReducer } from './filters/categoriesSlice';
import { industriesReducer } from './filters/industriesSlice';
import { manufacturersReducer } from './filters/manufacturersSlice';
import { productsReducer } from './products/productsSlice';
import { requestedProductsReducer } from './requestedProducts/requestedProductsSlice';
import { selectedProductsReducer } from './selectedProductsSlice';

const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: unknown) {
      return Promise.resolve(value);
    },
    removeItem() {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== 'undefined'
    ? createWebStorage('local')
    : createNoopStorage();

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['token'],
};

export const rootReducer = combineReducers({
  auth: persistReducer<AuthState>(authPersistConfig, authReducer),
  selectedProducts: selectedProductsReducer,
  products: productsReducer,
  requestedProducts: requestedProductsReducer,
  manufacturers: manufacturersReducer,
  categories: categoriesReducer,
  industries: industriesReducer,
});

export const makeStore = () =>
  configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore['dispatch'];
