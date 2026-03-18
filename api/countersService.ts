import axios from 'axios';

const baseUrl =
  process.env.API_URL || process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');

export const getNextProductId = async (): Promise<number> => {
  const seq = await getProductCounter();
  return seq + 1;
};

export const getProductCounter = async (): Promise<number> => {
  const baseUrl = (
    process.env.API_URL || process.env.NEXT_PUBLIC_API_URL
  )?.replace(/\/$/, '');

  if (!baseUrl) {
    throw new Error('API_URL is not defined');
  }

  const { data } = await axios.get<{ seq: number }>(
    `${baseUrl}/counters/product`
  );

  return data.seq;
};

export const updateNextProductId = async (seq: number): Promise<number> => {
  if (!baseUrl) {
    throw new Error('API_URL is not defined');
  }

  const { data } = await axios.patch<{ seq: number }>(
    `${baseUrl}/counters/product`,
    { seq }
  );

  return data.seq;
};
