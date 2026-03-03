import slugify from 'slugify';
import { LanguageKeys } from '@enums/languageKeys';
import getProductName from './getProductName';
import { IProduct } from '@interfaces/IProduct';

export function generateProductSlug(product: IProduct): string {
  const rawName = getProductName(product.name, LanguageKeys.EN);

  return slugify(rawName, {
    lower: true,
    strict: true,
  });
}