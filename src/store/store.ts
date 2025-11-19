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

import { type AuthState, authReducer } from './auth/slice';
import { categoriesReducer } from './filters/categoriesSlice';
import { industriesReducer } from './filters/industriesSlice';
import { manufacturersReducer } from './filters/manufacturersSlice';
import { productsReducer } from './products/productsSlice';
import { requestedProductsReducer } from './requestedProducts/requestedProductsSlice';
import { selectedProductsReducer } from './selectedProductsSlice';

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['token'],
};

export const store = configureStore({
  reducer: {
    auth: persistReducer<AuthState>(authPersistConfig, authReducer),
    selectedProducts: selectedProductsReducer,
    products: productsReducer,
    requestedProducts: requestedProductsReducer,
    manufacturers: manufacturersReducer,
    categories: categoriesReducer,
    industries: industriesReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export type AppStore = typeof store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
