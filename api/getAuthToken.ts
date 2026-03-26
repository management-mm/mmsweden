export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;

  try {
    const persistedAuth = localStorage.getItem('persist:auth');
    if (!persistedAuth) return null;

    const parsedAuth = JSON.parse(persistedAuth);
    if (!parsedAuth?.token) return null;

    const token = JSON.parse(parsedAuth.token);
    return typeof token === 'string' && token.trim() ? token : null;
  } catch (error) {
    console.error('Failed to parse auth token from localStorage:', error);
    return null;
  }
};
