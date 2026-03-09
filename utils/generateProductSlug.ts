import { IProduct } from '@interfaces/IProduct';
import slugify from 'slugify';

import getProductName from './getProductName';

import { DEFAULT_LOCALE } from '@i18n/config';

export function generateProductSlug(product: IProduct): string {
  const rawName = getProductName(product.name, DEFAULT_LOCALE);

  return slugify(rawName, {
    lower: true,
    strict: true,
  });
}
