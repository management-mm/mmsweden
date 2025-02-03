import axios from 'axios';
import type { IProduct } from 'interfaces/IProduct';

axios.defaults.baseURL = 'https://mmsweden-server.onrender.com/';

export const fetchRecommendedProductsById = async (
  productId: string | undefined
): Promise<IProduct[]> => {
  const response = await axios.get(
    `products/${productId}/recommended-products`
  );
  return response.data;
};
