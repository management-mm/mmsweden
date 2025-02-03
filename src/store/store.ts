import { configureStore } from '@reduxjs/toolkit';
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
import storage from 'redux-persist/lib/storage';

import { authReducer } from './auth/slice';
import { categoriesReducer } from './filters/categoriesSlice';
import { industriesReducer } from './filters/industriesSlice';
import { manufacturersReducer } from './filters/manufacturersSlice';
import { productsReducer } from './products/productsSlice';
import { requestedProductsReducer } from './requestedProducts/requestedProductsSlice';

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['token'],
};

export const store = configureStore({
  reducer: {
    auth: persistReducer(authPersistConfig, authReducer),
    products: productsReducer,
    requestedProducts: requestedProductsReducer,
    manufacturers: manufacturersReducer,
    categories: categoriesReducer,
    industries: industriesReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER',
        ],
        ignoredPaths: ['register'],
      },
    }),
});

export type AppStore = typeof store;

export const persistor = persistStore(store);

export type RootState = ReturnType<AppStore['getState']>;

export type AppDispatch = AppStore['dispatch'];
