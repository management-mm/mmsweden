import type { IContactUsData } from '@interfaces/IContactUsData';
import type { IRequestQuoteData } from '@interfaces/IRequestQuoteData';
import axios from 'axios';

axios.defaults.baseURL = 'https://mmsweden-server.onrender.com/';

const handleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    throw new Error(error.response?.data?.message || 'Server error');
  } else {
    throw new Error('Unknown error');
  }
};

export const requestQuote = async (data: IRequestQuoteData) => {
  try {
    const resp = await axios.post('mailer/request-quote', data);
    return resp.data.message;
  } catch (error) {
    handleError(error);
  }
};

export const sellToUs = async (data: FormData) => {
  try {
    const resp = await axios.post('mailer/sell-to-us', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return resp.data.message;
  } catch (error) {
    handleError(error);
  }
};

export const contactUs = async (data: IContactUsData) => {
  try {
    const resp = await axios.post('mailer/contact-us', data);
    return resp.data.message;
  } catch (error) {
    handleError(error);
  }
};
