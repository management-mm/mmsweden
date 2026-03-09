import axios from 'axios';
import type { IProduct } from 'interfaces/IProduct';

axios.defaults.baseURL = 'https://mmsweden-server.onrender.com/';

export const fetchRecommendedProductsBySlug = async (
  slug: string | undefined
): Promise<IProduct[]> => {
  const response = await axios.get(
    `products/${slug}/recommended-products`
  );
  return response.data;
};
