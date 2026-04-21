import { getCategoryBySlug } from '@api/categoriesService';
import type { ISeoCategory } from '@interfaces/ISeoCategory';

import type { AppLocale } from '@i18n/config';

type BreadcrumbItem = {
  slug: string;
  label: string;
};

const getLocalizedCategoryName = (
  category: ISeoCategory | null,
  locale: AppLocale
): string => {
  if (!category) return '';

  return category.name?.[locale] || category.name?.en || '';
};

export const getBreadcrumbCategories = async (
  locale: AppLocale,
  categorySlug?: string,
  subcategorySlug?: string
): Promise<{
  category?: BreadcrumbItem;
  subcategory?: BreadcrumbItem;
}> => {
  const [categoryData, subcategoryData] = await Promise.all([
    categorySlug ? getCategoryBySlug(categorySlug) : Promise.resolve(null),
    subcategorySlug
      ? getCategoryBySlug(subcategorySlug)
      : Promise.resolve(null),
  ]);

  const categoryLabel = getLocalizedCategoryName(categoryData, locale);
  const subcategoryLabel = getLocalizedCategoryName(subcategoryData, locale);

  return {
    category:
      categorySlug && categoryLabel
        ? {
            slug: categorySlug,
            label: categoryLabel,
          }
        : undefined,
    subcategory:
      subcategorySlug && subcategoryLabel
        ? {
            slug: subcategorySlug,
            label: subcategoryLabel,
          }
        : undefined,
  };
};
