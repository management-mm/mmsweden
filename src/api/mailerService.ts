import type { IContactUsData } from '@interfaces/IContactUsData';
import type { IRequestQuoteData } from '@interfaces/IRequestQuoteData';
import axios from 'axios';

axios.defaults.baseURL = 'https://mmsweden-server.onrender.com/';

export const requestQuote = async (data: IRequestQuoteData) => {
  const resp = await axios.post("mailer/request-quote", data);
  return resp.data.message;
}

export const sellToUs = async (data: FormData) => {
  const resp = await axios.post("mailer/sell-to-us", data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return resp.data.message;
}

export const contactUs = async (data: IContactUsData) => {
  const resp = await axios.post("mailer/contact-us", data);
  return resp.data.message;
}