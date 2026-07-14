import { useAppSelector } from './useAppSelector';

type PersistedAuthState = {
  _persist?: {
    rehydrated?: boolean;
  };
};

export const useAuth = () => {
  const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn);

  const isRefreshing = useAppSelector(state => state.auth.isRefreshing);

  const isHydrated = useAppSelector(state => {
    const authState = state.auth as typeof state.auth & PersistedAuthState;

    return authState._persist?.rehydrated === true;
  });

  return {
    isLoggedIn,
    isRefreshing,
    isHydrated,
  };
};
