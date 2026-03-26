import { fetchRecommendedProductsBySlug } from '@api/productsService';
import type { IProduct } from '@interfaces/IProduct';
import { getTranslations } from 'next-intl/server';

import RecommendedProductsCarousel from './RecommendedProductsCarousel';

import { Title } from '@enums/i18nConstants';

import type { AppLocale } from '@i18n/config';

type Props = {
  locale: AppLocale;
  slug: string;
};

const RecommendedProducts = async ({ locale, slug }: Props) => {
  let recommendedProducts: IProduct[] = [];

  try {
    recommendedProducts = await fetchRecommendedProductsBySlug(slug);
  } catch (error) {
    console.error('Failed to load recommended products:', error);
  }

  if (!recommendedProducts?.length) {
    return null;
  }

  const t = await getTranslations();
  const title = t(Title.YouMayAlsoBeInterestedIn);

  return (
    <RecommendedProductsCarousel
      products={recommendedProducts}
      language={locale}
      title={title}
    />
  );
};

export default RecommendedProducts;
