import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import { logIn, logOut, refreshUser } from './operations';

interface User {
  email: string | null;
}

export interface AuthState {
  user: User;
  token: string | null;
  isLoggedIn: boolean;
  isRefreshing: boolean;
}

export const initialState: AuthState = {
  user: { email: null },
  token: null,
  isLoggedIn: false,
  isRefreshing: false,
};

const handleLogInFulfilled = (
  state: AuthState,
  action: PayloadAction<{ user: User; token: string }>
) => {
  state.user = action.payload.user;
  state.token = action.payload.token;
  state.isLoggedIn = true;
};

const handleLogOutFulfilled = (state: AuthState) => {
  state.user = { email: null };
  state.token = null;
  state.isLoggedIn = false;
};

const handleRefreshUserPending = (state: AuthState) => {
  state.isRefreshing = true;
};

const handleRefreshUserFulfilled = (
  state: AuthState,
  action: PayloadAction<User>
) => {
  state.user = action.payload;
  state.isLoggedIn = true;
  state.isRefreshing = false;
};

const handleRefreshUserRejected = (state: AuthState) => {
  state.isRefreshing = false;
  state.token = null;
  state.isLoggedIn = false;
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: builder =>
    builder
      .addCase(logIn.fulfilled, handleLogInFulfilled)
      .addCase(logOut.fulfilled, handleLogOutFulfilled)
      .addCase(refreshUser.pending, handleRefreshUserPending)
      .addCase(refreshUser.fulfilled, handleRefreshUserFulfilled)
      .addCase(refreshUser.rejected, handleRefreshUserRejected),
});

export const authReducer = authSlice.reducer;
