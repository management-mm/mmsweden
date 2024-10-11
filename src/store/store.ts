import { configureStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';

import { categoriesReducer } from './filters/categoriesSlice';
import { industriesReducer } from './filters/industriesSlice';
import { manufacturersReducer } from './filters/manufacturersSlice';
import { productsReducer } from './products/productsSlice';
import { requestedProductsReducer } from './requestedProducts/requestedProductsSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    requestedProducts: requestedProductsReducer,
    manufacturers: manufacturersReducer,
    categories: categoriesReducer,
    industries: industriesReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredPaths: ['register'],
      },
    }),
});

export type AppStore = typeof store;

export const persistor = persistStore(store);

export type RootState = ReturnType<AppStore['getState']>;

export type AppDispatch = AppStore['dispatch'];
