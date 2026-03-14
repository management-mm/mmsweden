import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import { logIn, logOut, refreshUser } from './operations';

export interface User {
  email: string | null;
}

export interface AuthState {
  user: User;
  token: string | null;
  isLoggedIn: boolean;
  isRefreshing: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: { email: null },
  token: null,
  isLoggedIn: false,
  isRefreshing: false,
  error: null,
};

const handleLogInFulfilled = (
  state: AuthState,
  action: PayloadAction<{ user: User; token: string }>
) => {
  state.user = action.payload.user;
  state.token = action.payload.token;
  state.isLoggedIn = true;
  state.isRefreshing = false;
  state.error = null;
};

const handleLogOutFulfilled = (state: AuthState) => {
  state.user = { email: null };
  state.token = null;
  state.isLoggedIn = false;
  state.isRefreshing = false;
  state.error = null;
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
  state.error = null;
};

const handleRefreshUserRejected = (state: AuthState) => {
  state.user = { email: null };
  state.token = null;
  state.isLoggedIn = false;
  state.isRefreshing = false;
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuthState: state => {
      state.user = { email: null };
      state.token = null;
      state.isLoggedIn = false;
      state.isRefreshing = false;
    },
    setAuthError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearAuthError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(logIn.fulfilled, handleLogInFulfilled)
      .addCase(logOut.fulfilled, handleLogOutFulfilled)
      .addCase(refreshUser.pending, handleRefreshUserPending)
      .addCase(refreshUser.fulfilled, handleRefreshUserFulfilled)
      .addCase(refreshUser.rejected, handleRefreshUserRejected);
  },
});

export const { resetAuthState, setAuthError, clearAuthError } =
  authSlice.actions;
export const authReducer = authSlice.reducer;
