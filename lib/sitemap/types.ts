export type ProductSitemapItem = {
  slug: string;
  updatedAt?: string;
  seoCategorySlug: string;
  seoSubcategorySlug: string;
};

export type SeoSubcategorySitemapItem = {
  slug: string;
  updatedAt?: string;
};

export type SeoCategorySitemapItem = {
  slug: string;
  updatedAt?: string;
  subcategories?: SeoSubcategorySitemapItem[];
};

export type SitemapUrlItem = {
  loc: string;
  lastmod?: string;
  alternates?: string;
};

export type SitemapIndexItem = {
  loc: string;
  lastmod?: string;
};
