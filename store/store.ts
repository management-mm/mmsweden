import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
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

const rootReducer = combineReducers({
  auth: persistReducer<AuthState>(authPersistConfig, authReducer),
  selectedProducts: selectedProductsReducer,
  products: productsReducer,
  requestedProducts: requestedProductsReducer,
  manufacturers: manufacturersReducer,
  categories: categoriesReducer,
  industries: industriesReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor =
  typeof window !== 'undefined' ? persistStore(store) : null;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
