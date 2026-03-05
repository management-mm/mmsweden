import { IProduct } from '@interfaces/IProduct';
import slugify from 'slugify';

import getProductName from './getProductName';

import { LanguageKeys } from '@enums/languageKeys';

export function generateProductSlug(product: IProduct): string {
  const rawName = getProductName(product.name, LanguageKeys.EN);

  return slugify(rawName, {
    lower: true,
    strict: true,
  });
}
