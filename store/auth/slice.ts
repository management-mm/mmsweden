import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import {
  type LogInResponse,
  type User,
  logIn,
  logOut,
  refreshUser,
  verifyTwoFactor,
} from './operations';

import type { ThunkRejectValue } from '@utils/errors/createThunkRejectValue';

interface TwoFactorState {
  required: boolean;
  userId: string | null;
  method: 'email' | null;
  message: string | null;
}

export interface AuthState {
  user: User;
  token: string | null;
  isLoggedIn: boolean;
  isRefreshing: boolean;
  isLoading: boolean;
  error: ThunkRejectValue | null;
  twoFactor: TwoFactorState;
}

const initialState: AuthState = {
  user: {
    email: null,
    name: null,
  },
  token: null,
  isLoggedIn: false,
  isRefreshing: false,
  isLoading: false,
  error: null,
  twoFactor: {
    required: false,
    userId: null,
    method: null,
    message: null,
  },
};

const createFallbackRejectValue = (message?: string): ThunkRejectValue => ({
  message: message || 'Something went wrong. Please try again.',
  code: 'UNKNOWN',
});

const resetTwoFactorState = (state: AuthState): void => {
  state.twoFactor = {
    required: false,
    userId: null,
    method: null,
    message: null,
  };
};

const handleLogInPending = (state: AuthState): void => {
  state.isLoading = true;
  state.error = null;
};

const handleLogInFulfilled = (
  state: AuthState,
  action: PayloadAction<LogInResponse>
): void => {
  state.isLoading = false;
  state.error = null;

  if (
    'requiresTwoFactor' in action.payload &&
    action.payload.requiresTwoFactor
  ) {
    state.user = {
      email: null,
      name: null,
    };
    state.token = null;
    state.isLoggedIn = false;
    state.isRefreshing = false;

    state.twoFactor = {
      required: true,
      userId: action.payload.userId,
      method: action.payload.method,
      message: action.payload.message,
    };

    return;
  }

  state.user = action.payload.user;
  state.token = action.payload.token;
  state.isLoggedIn = true;
  state.isRefreshing = false;

  resetTwoFactorState(state);
};

const handleLogInRejected = (
  state: AuthState,
  action: ReturnType<typeof logIn.rejected>
): void => {
  state.isLoading = false;
  state.isLoggedIn = false;
  state.error =
    action.payload ?? createFallbackRejectValue(action.error.message);
};

const handleVerifyTwoFactorPending = (state: AuthState): void => {
  state.isLoading = true;
  state.error = null;
};

const handleVerifyTwoFactorFulfilled = (
  state: AuthState,
  action: PayloadAction<{ user: User; token: string }>
): void => {
  state.user = action.payload.user;
  state.token = action.payload.token;
  state.isLoggedIn = true;
  state.isRefreshing = false;
  state.isLoading = false;
  state.error = null;

  resetTwoFactorState(state);
};

const handleVerifyTwoFactorRejected = (
  state: AuthState,
  action: ReturnType<typeof verifyTwoFactor.rejected>
): void => {
  state.isLoading = false;
  state.isLoggedIn = false;
  state.error =
    action.payload ?? createFallbackRejectValue(action.error.message);
};

const handleLogOutPending = (state: AuthState): void => {
  state.isLoading = true;
  state.error = null;
};

const handleLogOutFulfilled = (state: AuthState): void => {
  state.user = {
    email: null,
    name: null,
  };
  state.token = null;
  state.isLoggedIn = false;
  state.isRefreshing = false;
  state.isLoading = false;
  state.error = null;

  resetTwoFactorState(state);
};

const handleLogOutRejected = (
  state: AuthState,
  action: ReturnType<typeof logOut.rejected>
): void => {
  state.isLoading = false;
  state.error =
    action.payload ?? createFallbackRejectValue(action.error.message);
};

const handleRefreshUserPending = (state: AuthState): void => {
  state.isRefreshing = true;
  state.error = null;
};

const handleRefreshUserFulfilled = (
  state: AuthState,
  action: PayloadAction<User>
): void => {
  state.user = action.payload;
  state.isLoggedIn = true;
  state.isRefreshing = false;
  state.error = null;
};

const handleRefreshUserRejected = (
  state: AuthState,
  action: ReturnType<typeof refreshUser.rejected>
): void => {
  state.user = {
    email: null,
    name: null,
  };
  state.token = null;
  state.isLoggedIn = false;
  state.isRefreshing = false;

  const error =
    action.payload ?? createFallbackRejectValue(action.error.message);

  state.error = error.code === 'UNAUTHORIZED' ? null : error;
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuthState: state => {
      state.user = {
        email: null,
        name: null,
      };
      state.token = null;
      state.isLoggedIn = false;
      state.isRefreshing = false;
      state.isLoading = false;
      state.error = null;

      resetTwoFactorState(state);
    },

    setAuthError: (state, action: PayloadAction<ThunkRejectValue | null>) => {
      state.error = action.payload;
    },

    clearAuthError: state => {
      state.error = null;
    },

    clearTwoFactorState: state => {
      resetTwoFactorState(state);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(logIn.pending, handleLogInPending)
      .addCase(logIn.fulfilled, handleLogInFulfilled)
      .addCase(logIn.rejected, handleLogInRejected)

      .addCase(verifyTwoFactor.pending, handleVerifyTwoFactorPending)
      .addCase(verifyTwoFactor.fulfilled, handleVerifyTwoFactorFulfilled)
      .addCase(verifyTwoFactor.rejected, handleVerifyTwoFactorRejected)

      .addCase(logOut.pending, handleLogOutPending)
      .addCase(logOut.fulfilled, handleLogOutFulfilled)
      .addCase(logOut.rejected, handleLogOutRejected)

      .addCase(refreshUser.pending, handleRefreshUserPending)
      .addCase(refreshUser.fulfilled, handleRefreshUserFulfilled)
      .addCase(refreshUser.rejected, handleRefreshUserRejected);
  },
});

export const {
  resetAuthState,
  setAuthError,
  clearAuthError,
  clearTwoFactorState,
} = authSlice.actions;

export const authReducer = authSlice.reducer;
