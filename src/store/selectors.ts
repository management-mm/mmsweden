import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '@store/store';

export const makeSelectIsProductSelected = () =>
  createSelector(
    [
      (state: RootState) => state.selectedProducts.items,
      (_: RootState, productId: string) => productId,
    ],
    (items, productId) => items.some(p => p._id === productId)
  );

export const selectProducts = (state: RootState) => state.products.items;

export const selectProductDetails = (state: RootState) =>
  state.products.productDetails;

export const selectTotal = (state: RootState) => state.products.total;

export const selectIsLoading = (state: RootState) => state.products.isLoading;

export const selectRequestedProducts = (state: RootState) =>
  state.requestedProducts.items;

export const selectManufacturers = (state: RootState) =>
  state.manufacturers.items;

export const selectManufacturersIsLoading = (state: RootState) =>
  state.manufacturers.isLoading;

export const selectManufacturersError = (state: RootState) =>
  state.manufacturers.error;

export const selectCategories = (state: RootState) => state.categories.items;

export const selectCategoriesIsLoading = (state: RootState) =>
  state.categories.isLoading;

export const selectCategoriesError = (state: RootState) =>
  state.categories.error;

export const selectIndustries = (state: RootState) => state.industries.items;

export const selectIndustriesIsLoading = (state: RootState) =>
  state.industries.isLoading;

export const selectIndustriesError = (state: RootState) =>
  state.industries.error;

export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn;

export const selectUser = (state: RootState) => state.auth.user;

export const selectIsRefreshing = (state: RootState) => state.auth.isRefreshing;

export const selectSelectedProducts = (state: RootState) =>
  state.selectedProducts.items;
