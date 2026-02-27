import { useAppSelector } from './useAppSelector';

export const useAuth = () => {
  const token = useAppSelector(s => s.auth.token);
  const isRefreshing = useAppSelector(s => s.auth.isRefreshing); // если есть
  const isHydrated = useAppSelector(
    s => (s.auth as any)._persist?.rehydrated === true
  );

  return {
    token,
    isLoggedIn: Boolean(token),
    isRefreshing,
    isHydrated,
  };
};
