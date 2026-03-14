import axios from 'axios';
import type { IProduct } from 'interfaces/IProduct';

export const fetchRecommendedProductsBySlug = async (
  slug: string | undefined
): Promise<IProduct[]> => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/products/${slug}/recommended-products`
  );
  return response.data;
};


