import { getProducts } from '@api/productsService';
import type { IProduct } from '@interfaces/IProduct';
import { getTranslations } from 'next-intl/server';

import LatestArrivalsCarousel from './LatestArrivalsCarousel';

import { Title } from '@enums/i18nConstants';

import type { AppLocale } from '@i18n/config';

const PER_PAGE = 10;
const MAX_RENDER = 10;

type Props = {
  locale: AppLocale;
};

const LatestArrivals = async ({ locale }: Props) => {
  let productsRaw: IProduct[] = [];

  try {
    const result = await getProducts({
      sort: 'latest',
      perPage: PER_PAGE,
      page: 1,
      lang: locale,
    });

    productsRaw = result.products ?? [];
  } catch (error) {
    console.error('Failed to load latest arrivals:', error);
  }

  const products = productsRaw
    .filter(product => !product.deletionDate)
    .slice(0, MAX_RENDER);

  const t = await getTranslations();
  const title = t(Title.LatestArrivals);

  if (!products.length) {
    return null;
  }

  return (
    <LatestArrivalsCarousel products={products} locale={locale} title={title} />
  );
};

export default LatestArrivals;
