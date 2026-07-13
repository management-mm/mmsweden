import { useAppSelector } from './useAppSelector';

type PersistedAuthState = {
  _persist?: {
    rehydrated?: boolean;
  };
};

export const useAuth = () => {
  const token = useAppSelector(state => state.auth.token);
  const isRefreshing = useAppSelector(state => state.auth.isRefreshing);

  const isHydrated = useAppSelector(state => {
    const authState = state.auth as typeof state.auth & PersistedAuthState;

    return authState._persist?.rehydrated === true;
  });

  return {
    token,
    isLoggedIn: Boolean(token),
    isRefreshing,
    isHydrated,
  };
};
