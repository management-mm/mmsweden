import axios from 'axios';
import type { ICategory } from 'interfaces/ICategory';
import type { IIndustry } from 'interfaces/IIndustry';
import type { IManufacturer } from 'interfaces/IManufacturer';
import type { IProduct } from 'interfaces/IProduct';

// 'https://mmsweden-server.onrender.com/'
axios.defaults.baseURL = 'https://mmsweden-server.onrender.com/';

export const fetchCategories = async (): Promise<ICategory[]> => {
  const response = await axios.get('categories/');
  return response.data;
};

export const fetchManufacturers = async (): Promise<IManufacturer[]> => {
  const response = await axios.get('manufacturers/');
  return response.data;
};

export const fetchIndustries = async (): Promise<IIndustry[]> => {
  const response = await axios.get('industries/');
  return response.data;
};

export const fetchProductById = async (
  productId: string | undefined
): Promise<IProduct> => {
  const response = await axios.get(`products/${productId}`);
  return response.data;
};

export const fetchRecommendedProductsById = async (
  productId: string | undefined
): Promise<IProduct[]> => {
  const response = await axios.get(
    `products/${productId}/recommended-products`
  );
  return response.data;
};
