import type { IContactUsData } from '@interfaces/IContactUsData';
import type { IRequestQuoteData } from '@interfaces/IRequestQuoteData';
import axios from 'axios';

import { AppError } from '@utils/errors/AppError';
import { normalizeError } from '@utils/errors/normalizeError';

const rawBaseUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
const baseURL = rawBaseUrl?.replace(/\/$/, '');

type MailerResponse = {
  message: Record<string, string>;
};

const mailerApi = axios.create({
  baseURL,
});

const getBaseUrl = (): string => {
  if (!baseURL) {
    throw new AppError(
      'API URL is not configured. Set API_URL or NEXT_PUBLIC_API_URL.',
      'UNKNOWN',
      {
        isOperational: false,
      }
    );
  }

  return baseURL;
};

const rethrowMailerError = (error: unknown): never => {
  throw normalizeError(error);
};

export const requestQuote = async (
  data: IRequestQuoteData
): Promise<Record<string, string>> => {
  try {
    getBaseUrl();

    const response = await mailerApi.post<MailerResponse>(
      'mailer/request-quote',
      data
    );

    return response.data.message;
  } catch (error) {
    throw normalizeError(error);
  }
};

export const sellToUs = async (
  data: FormData
): Promise<Record<string, string>> => {
  try {
    getBaseUrl();

    const response = await mailerApi.post<MailerResponse>(
      'mailer/sell-to-us',
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.message;
  } catch (error) {
    throw normalizeError(error);
  }
};

export const contactUs = async (
  data: IContactUsData
): Promise<Record<string, string>> => {
  try {
    getBaseUrl();

    const response = await mailerApi.post<MailerResponse>(
      'mailer/contact-us',
      data
    );

    return response.data.message;
  } catch (error) {
    throw normalizeError(error);
  }
};
