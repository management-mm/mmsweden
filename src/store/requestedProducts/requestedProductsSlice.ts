import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { IProduct } from 'interfaces/IProduct';
import persistReducer from 'redux-persist/es/persistReducer';
import storage from 'redux-persist/lib/storage';

interface IRequestedProductsState {
  items: IProduct[];
}
const initialState: IRequestedProductsState = {
  items: [],
};
const requestedProductsSlice = createSlice({
  name: 'requestedProducts',
  initialState,
  reducers: {
    toggleRequestedProducts(
      state: IRequestedProductsState,
      action: PayloadAction<IProduct>
    ) {
      const isRequestedProductExist =
        state.items.filter(product => product._id === action.payload._id)
          .length !== 0;
      if (isRequestedProductExist) {
        state.items = state.items.filter(
          product => action.payload._id !== product._id
        );
        return;
      }
      state.items.push(action.payload);
    },
  },
});

const persistConfig = {
  key: 'requestedProducts',
  storage,
};
export const { toggleRequestedProducts } = requestedProductsSlice.actions;
export const requestedProductsReducer = persistReducer(
  persistConfig,
  requestedProductsSlice.reducer
);
