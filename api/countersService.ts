import { api } from '@store/api';

import { AppError } from '@utils/errors/AppError';
import { normalizeError } from '@utils/errors/normalizeError';

const rawBaseUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
const baseUrl = rawBaseUrl?.replace(/\/$/, '');

const getBaseUrl = (): string => {
  if (!baseUrl) {
    throw new AppError(
      'API URL is not configured. Set API_URL or NEXT_PUBLIC_API_URL.',
      'UNKNOWN',
      {
        isOperational: false,
      }
    );
  }

  return baseUrl;
};

const buildUrl = (path: string): string => {
  return `${getBaseUrl()}${path}`;
};

export const getNextProductId = async (): Promise<number> => {
  try {
    const seq = await getProductCounter();
    return seq + 1;
  } catch (error) {
    throw normalizeError(error);
  }
};

export const getProductCounter = async (): Promise<number> => {
  try {
    const { data } = await api.get<{ seq: number }>(
      buildUrl('/counters/product')
    );
    return data.seq;
  } catch (error) {
    throw normalizeError(error);
  }
};

export const updateNextProductId = async (seq: number): Promise<number> => {
  try {
    const { data } = await api.patch<{ seq: number }>(
      buildUrl('/counters/product'),
      { seq }
    );

    return data.seq;
  } catch (error) {
    throw normalizeError(error);
  }
};
