import type { IProduct } from '@interfaces/IProduct';
import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import persistReducer from 'redux-persist/es/persistReducer';
import storage from 'redux-persist/lib/storage';

interface ISelectedProductsState {
  items: IProduct[];
}

const initialState: ISelectedProductsState = {
  items: [],
};

const selectedProductsSlice = createSlice({
  name: 'selectedProducts',
  initialState,
  reducers: {
    toggleSelectedProducts(
      state: ISelectedProductsState,
      action: PayloadAction<IProduct>
    ) {
      const isSelectedProductExist =
        state.items.filter(product => product._id === action.payload._id)
          .length !== 0;
      if (isSelectedProductExist) {
        state.items = state.items.filter(
          product => action.payload._id !== product._id
        );
        return;
      }
      state.items.push(action.payload);
    },
    switchItems(
      state: ISelectedProductsState,
      action: PayloadAction<{ fromSlot: number; toSlot: number }>
    ) {
      const { fromSlot, toSlot } = action.payload;

      if (
        fromSlot < 0 ||
        toSlot < 0 ||
        fromSlot >= state.items.length ||
        toSlot >= state.items.length
      ) {
        return;
      }

      const temp = state.items[fromSlot];
      state.items[fromSlot] = state.items[toSlot];
      state.items[toSlot] = temp;
    },
    clearAll(state: ISelectedProductsState) {
      state.items = [];
    },
  },
});

const persistConfig = {
  key: 'selectedProducts',
  storage,
};

export const { toggleSelectedProducts, switchItems, clearAll } =
  selectedProductsSlice.actions;
export const selectedProductsReducer = persistReducer(
  persistConfig,
  selectedProductsSlice.reducer
);
