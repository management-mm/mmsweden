import axios from 'axios';

export const getNextProductId = async (): Promise<number> => {
  const baseUrl =
    process.env.API_URL || process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');

  if (!baseUrl) {
    throw new Error('API_URL is not defined on the server');
  }
  const { data } = await axios.get<{ seq: number }>(
    `${baseUrl}/counters/product`
  );

  return data.seq + 1;
};
