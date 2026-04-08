import type { MultiLanguageString } from './IProduct';

export interface ISeoCategory {
  _id: string;
  name: MultiLanguageString;
  slug: string;
  parentId: string;
  isActive: boolean;
  sortOrder: number;
  seo?: {
    title: MultiLanguageString;
    description: MultiLanguageString;
  };
  productCategoryId?: string;
}
