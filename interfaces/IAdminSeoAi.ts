export type TSeoLanguage =
  'en' | 'sv' | 'de' | 'fr' | 'es' | 'ru' | 'uk' | 'pl';

export type IMultiLanguageValue = Record<TSeoLanguage, string>;

export interface ISeoFields {
  title: IMultiLanguageValue;
  description: IMultiLanguageValue;
  h1: IMultiLanguageValue;
}

export interface ISeoContent {
  intro: IMultiLanguageValue;
}

export interface ISeoCategoryProposal {
  name: IMultiLanguageValue;
  slug: string;
  seo: ISeoFields;
  content: ISeoContent;
}

export interface IProductCategoryProposal {
  name: IMultiLanguageValue;
  slug: string;
  synonyms: string[];
}

export type TDuplicateRisk = 'LOW' | 'MEDIUM' | 'HIGH';

export interface ISeoRecommendation {
  primaryKeyword: string;
  reason: string;
  duplicateRisk: TDuplicateRisk;
  warnings: string[];
}

export interface ISeoStructureProposal {
  recommendation: ISeoRecommendation;

  seoCategory: ISeoCategoryProposal;

  seoSubcategory: ISeoCategoryProposal;

  productCategory: IProductCategoryProposal;
}

export interface ISeoConflict {
  entity: 'SEO_CATEGORY' | 'SEO_SUBCATEGORY' | 'PRODUCT_CATEGORY';

  field: 'slug' | 'name';

  value: string;

  existingId?: string;

  existingSlug?: string;

  blocking: boolean;

  resolution: 'REUSE_EXISTING' | 'BLOCK';

  message: string;
}

export interface ISeoProposalResponse {
  mode: TSeoStructureMode;

  input: {
    categoryQuery: string | null;

    subcategoryQuery: string;

    parentCategoryId: string | null;
  };

  research: {
    webSearchUsed: boolean;
  };

  proposal: ISeoStructureProposal;

  preview: {
    seoCategory: ISeoCategoryProposal & {
      level: 1;

      parentId: null;

      isActive: boolean;

      sortOrder: number | null;

      willReuseExisting: boolean;

      existingId: string | null;

      existingSlug: string | null;
    };

    seoSubcategory: ISeoCategoryProposal & {
      level: 2;

      parentId: string;

      isActive: boolean;

      sortOrder: number;
    };

    productCategory: IProductCategoryProposal & {
      isActive: boolean;
    };
  };

  conflicts: {
    hasBlockingConflicts: boolean;

    items: ISeoConflict[];
  };
}

export interface ICreateSeoStructureResponse {
  success: boolean;

  message: string;

  data: {
    seoCategory: unknown;

    seoCategoryReused: boolean;

    seoSubcategory: unknown;

    productCategory: unknown;
  };
}

export type TSeoStructureMode =
  'CREATE_CATEGORY_WITH_SUBCATEGORY' | 'ADD_SUBCATEGORY';

export interface IGenerateSeoProposalPayload {
  mode: TSeoStructureMode;

  categoryQuery?: string;

  subcategoryQuery: string;

  parentCategoryId?: string;
}

export interface ICreateSeoStructurePayload {
  mode: TSeoStructureMode;

  parentCategoryId?: string;

  proposal: ISeoStructureProposal;
}
