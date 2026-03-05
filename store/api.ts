import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use(config => {
  if (typeof window === 'undefined') return config;

  const raw = window.localStorage.getItem('persist:auth');
  if (!raw) return config;

  try {
    const parsed = JSON.parse(raw);
    const token = parsed.token ? JSON.parse(parsed.token) : null;

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {}

  return config;
});
