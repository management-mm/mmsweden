export const getApiUrl = () => {
  const apiUrl =
    process.env.API_URL?.replace(/\/$/, '') ||
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');

  if (!apiUrl) {
    throw new Error('API_URL is not configured');
  }

  return apiUrl;
};
