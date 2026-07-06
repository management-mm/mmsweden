import { Suspense, cache } from 'react';

import type { IProduct } from '@interfaces/IProduct';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import Product from '@components/productDetails/Product';
import RecommendedProducts from '@components/productDetails/RecommendedProducts';

import slugToLabel from '@utils/slugToLabel';

import {
  type AppLocale,
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
} from '@i18n/config';

type Props = {
  params: Promise<{
    locale: AppLocale;
    categorySlug: string;
    subcategorySlug: string;
    slug: string;
  }>;
};

type SeoRef = {
  slug?: string;
  name?: string | Record<string, string>;
};

type ProductWithSeo = IProduct & {
  slug?: string | null;
  seoCategorySlug?: string | null;
  seoSubcategorySlug?: string | null;
  seoCategory?: SeoRef | string | null;
  seoSubcategory?: SeoRef | string | null;
  seoCategoryId?: SeoRef | string | null;
  seoSubcategoryId?: SeoRef | string | null;
};

type ProductConditionKey = 'new' | 'used';

type ProductSeoCopy = {
  condition: Record<ProductConditionKey, string>;
  title: (params: { conditionLabel: string; productName: string }) => string;
  description: (params: {
    conditionLabel: string;
    productName: string;
  }) => string;
  fallbackDescription: string;
  breadcrumbs: {
    home: string;
    allProducts: string;
  };
};

const productSeoCopy: Record<AppLocale, ProductSeoCopy> = {
  en: {
    condition: {
      new: 'New',
      used: 'Used',
    },
    title: ({ conditionLabel, productName }) =>
      `${conditionLabel} ${productName} For Sale | MM Sweden`,
    description: ({ conditionLabel, productName }) =>
      `Buy a ${conditionLabel.toLowerCase()} ${productName} from MM Sweden. We supply used food processing and packaging machinery for industrial food production.`,
    fallbackDescription:
      'Used food processing and packaging equipment from MM Sweden.',
    breadcrumbs: {
      home: 'Home',
      allProducts: 'All Products',
    },
  },

  sv: {
    condition: {
      new: 'Ny',
      used: 'Begagnad',
    },
    title: ({ conditionLabel, productName }) =>
      `${conditionLabel} ${productName} till salu | MM Sweden`,
    description: ({ conditionLabel, productName }) =>
      `Köp en ${conditionLabel.toLowerCase()} ${productName} från MM Sweden. Vi levererar begagnade livsmedels- och förpackningsmaskiner för industriell livsmedelsproduktion.`,
    fallbackDescription:
      'Begagnad livsmedels- och förpackningsutrustning från MM Sweden.',
    breadcrumbs: {
      home: 'Hem',
      allProducts: 'Alla produkter',
    },
  },

  de: {
    condition: {
      new: 'Neue',
      used: 'Gebrauchte',
    },
    title: ({ conditionLabel, productName }) =>
      `${conditionLabel} ${productName} kaufen | MM Sweden`,
    description: ({ conditionLabel, productName }) =>
      `Kaufen Sie eine ${conditionLabel.toLowerCase()} ${productName} bei MM Sweden. Wir liefern gebrauchte Lebensmittel- und Verpackungsmaschinen für die industrielle Lebensmittelproduktion.`,
    fallbackDescription:
      'Gebrauchte Lebensmittel- und Verpackungsmaschinen von MM Sweden.',
    breadcrumbs: {
      home: 'Startseite',
      allProducts: 'Alle Produkte',
    },
  },

  fr: {
    condition: {
      new: 'neuf',
      used: 'd’occasion',
    },
    title: ({ conditionLabel, productName }) =>
      `${productName} ${conditionLabel} à vendre | MM Sweden`,
    description: ({ conditionLabel, productName }) =>
      `Achetez ${productName} ${conditionLabel} chez MM Sweden. Nous fournissons des machines alimentaires et d’emballage d’occasion pour la production industrielle.`,
    fallbackDescription:
      'Machines alimentaires et d’emballage d’occasion de MM Sweden.',
    breadcrumbs: {
      home: 'Accueil',
      allProducts: 'Tous les produits',
    },
  },

  es: {
    condition: {
      new: 'nueva',
      used: 'usada',
    },
    title: ({ conditionLabel, productName }) =>
      `${productName} ${conditionLabel} en venta | MM Sweden`,
    description: ({ conditionLabel, productName }) =>
      `Compre ${productName} ${conditionLabel} en MM Sweden. Suministramos maquinaria alimentaria y de envasado usada para producción industrial.`,
    fallbackDescription:
      'Maquinaria alimentaria y de envasado usada de MM Sweden.',
    breadcrumbs: {
      home: 'Inicio',
      allProducts: 'Todos los productos',
    },
  },

  ru: {
    condition: {
      new: 'новое',
      used: 'б/у',
    },
    title: ({ conditionLabel, productName }) =>
      `${productName}: ${conditionLabel} в продаже | MM Sweden`,
    description: ({ conditionLabel, productName }) =>
      `Купить ${conditionLabel} ${productName} в MM Sweden. Мы поставляем б/у пищевое и упаковочное оборудование для промышленного производства.`,
    fallbackDescription: 'Б/у пищевое и упаковочное оборудование от MM Sweden.',
    breadcrumbs: {
      home: 'Главная',
      allProducts: 'Все товары',
    },
  },

  uk: {
    condition: {
      new: 'нове',
      used: 'вживане',
    },
    title: ({ conditionLabel, productName }) =>
      `${productName}: ${conditionLabel} у продажу | MM Sweden`,
    description: ({ conditionLabel, productName }) =>
      `Купити ${conditionLabel} ${productName} у MM Sweden. Ми постачаємо вживане харчове та пакувальне обладнання для промислового виробництва.`,
    fallbackDescription:
      'Вживане харчове та пакувальне обладнання від MM Sweden.',
    breadcrumbs: {
      home: 'Головна',
      allProducts: 'Усі товари',
    },
  },

  pl: {
    condition: {
      new: 'Nowa',
      used: 'Używana',
    },
    title: ({ conditionLabel, productName }) =>
      `${conditionLabel} ${productName} na sprzedaż | MM Sweden`,
    description: ({ conditionLabel, productName }) =>
      `Kup ${conditionLabel.toLowerCase()} ${productName} w MM Sweden. Dostarczamy używane maszyny spożywcze i pakujące do produkcji przemysłowej.`,
    fallbackDescription: 'Używane maszyny spożywcze i pakujące od MM Sweden.',
    breadcrumbs: {
      home: 'Strona główna',
      allProducts: 'Wszystkie produkty',
    },
  },
};

function getProductSeoCopy(locale: AppLocale) {
  return productSeoCopy[locale] || productSeoCopy[DEFAULT_LOCALE];
}

function isMultiLang(value: unknown): value is Record<string, string> {
  return typeof value === 'object' && value !== null;
}

function isMongoObjectId(value: string) {
  return /^[0-9a-fA-F]{24}$/.test(value);
}

function getApiUrl() {
  return (
    process.env.API_URL?.replace(/\/$/, '') ??
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ??
    'https://mmsweden-server.onrender.com'
  );
}

function getSiteUrl() {
  return process.env.SITE_URL?.replace(/\/$/, '') ?? 'https://www.mmsweden.se';
}

function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

const getProduct = cache(
  async (slug: string): Promise<ProductWithSeo | null> => {
    const normalizedSlug = slug.trim();

    if (!normalizedSlug || isMongoObjectId(normalizedSlug)) {
      return null;
    }

    const baseUrl = getApiUrl();

    try {
      const res = await fetch(
        `${baseUrl}/products/by-slug/${encodeURIComponent(normalizedSlug)}`,
        {
          next: { revalidate: 300 },
        }
      );

      if (!res.ok) {
        return null;
      }

      return res.json();
    } catch {
      return null;
    }
  }
);

function buildProductPath(
  categorySlug: string,
  subcategorySlug: string,
  slug: string
) {
  return `/all-products/${categorySlug}/${subcategorySlug}/${slug}`;
}

function buildProductUrl(
  siteUrl: string,
  locale: AppLocale,
  categorySlug: string,
  subcategorySlug: string,
  slug: string
) {
  return `${siteUrl}/${locale}${buildProductPath(
    categorySlug,
    subcategorySlug,
    slug
  )}`;
}

function extractStringSlug(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const slug = value.trim();

  if (!slug || isMongoObjectId(slug)) {
    return undefined;
  }

  return slug;
}

function extractObjectSlug(value: unknown): string | undefined {
  if (
    typeof value === 'object' &&
    value !== null &&
    'slug' in value &&
    typeof value.slug === 'string'
  ) {
    const slug = value.slug.trim();

    if (!slug || isMongoObjectId(slug)) {
      return undefined;
    }

    return slug;
  }

  return undefined;
}

function extractName(
  value: unknown
): string | Record<string, string> | undefined {
  if (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    (typeof value.name === 'string' || isMultiLang(value.name))
  ) {
    return value.name;
  }

  return undefined;
}

function getLocalizedText(
  value: unknown,
  locale: AppLocale,
  fallback: string
): string {
  if (typeof value === 'string' && value.trim()) {
    return value;
  }

  if (isMultiLang(value)) {
    return value[locale] || value.en || Object.values(value)[0] || fallback;
  }

  return fallback;
}

function getConditionLabel(
  condition: IProduct['condition'] | undefined,
  locale: AppLocale
): string {
  const copy = getProductSeoCopy(locale);

  if (condition === 'new') {
    return copy.condition.new;
  }

  return copy.condition.used;
}

function resolveProductSeoData(
  product: ProductWithSeo,
  locale: AppLocale,
  routeCategorySlug: string,
  routeSubcategorySlug: string,
  routeSlug: string
) {
  const actualCategorySlug =
    extractStringSlug(product.seoCategorySlug) ??
    extractObjectSlug(product.seoCategory) ??
    extractObjectSlug(product.seoCategoryId);

  const actualSubcategorySlug =
    extractStringSlug(product.seoSubcategorySlug) ??
    extractObjectSlug(product.seoSubcategory) ??
    extractObjectSlug(product.seoSubcategoryId);

  const actualProductSlug =
    extractStringSlug(product.slug) ?? extractStringSlug(routeSlug);

  const hasCanonicalPath = Boolean(
    actualCategorySlug && actualSubcategorySlug && actualProductSlug
  );

  const categorySlug = actualCategorySlug ?? routeCategorySlug;
  const subcategorySlug = actualSubcategorySlug ?? routeSubcategorySlug;
  const productSlug = actualProductSlug ?? routeSlug;

  const categoryNameSource =
    extractName(product.seoCategory) ?? extractName(product.seoCategoryId);

  const subcategoryNameSource =
    extractName(product.seoSubcategory) ??
    extractName(product.seoSubcategoryId);

  const categoryLabel = getLocalizedText(
    categoryNameSource,
    locale,
    slugToLabel(categorySlug)
  );

  const subcategoryLabel = getLocalizedText(
    subcategoryNameSource,
    locale,
    slugToLabel(subcategorySlug)
  );

  const shouldRedirect =
    hasCanonicalPath &&
    (routeCategorySlug !== actualCategorySlug ||
      routeSubcategorySlug !== actualSubcategorySlug ||
      routeSlug !== actualProductSlug);

  return {
    categorySlug,
    subcategorySlug,
    productSlug,
    categoryLabel,
    subcategoryLabel,
    hasCanonicalPath,
    shouldRedirect,
  };
}

function buildBreadcrumbJsonLd(items: Array<{ name: string; item: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: entry.name,
      item: entry.item,
    })),
  };
}

function buildProductJsonLd(params: {
  product: ProductWithSeo;
  locale: AppLocale;
  canonicalUrl: string;
  localizedName: string;
  localizedDescription: string;
}) {
  const { product, locale, canonicalUrl, localizedName, localizedDescription } =
    params;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: localizedName,
    description: localizedDescription,
    sku: product.idNumber,
    productID: product.idNumber,
    image: product.photos ?? [],
    brand: product.manufacturer
      ? {
          '@type': 'Brand',
          name: product.manufacturer,
        }
      : undefined,
    itemCondition:
      product.condition === 'new'
        ? 'https://schema.org/NewCondition'
        : product.condition === 'used'
          ? 'https://schema.org/UsedCondition'
          : undefined,
    url: canonicalUrl,
    inLanguage: locale,
    offers: {
      '@type': 'Offer',
      url: canonicalUrl,
      priceCurrency: 'SEK',
      availability: 'https://schema.org/InStock',
    },
  } satisfies Record<string, unknown>;
}

function buildNotFoundProductMetadata(): Metadata {
  return {
    title: 'Product Not Found | MM Sweden',
    description: 'The requested product could not be found.',
    robots: {
      index: false,
      follow: false,
    },
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, categorySlug, subcategorySlug, slug } = await params;
  const siteUrl = getSiteUrl();

  const product = await getProduct(slug);

  if (!product) {
    return buildNotFoundProductMetadata();
  }

  const seoData = resolveProductSeoData(
    product,
    locale,
    categorySlug,
    subcategorySlug,
    slug
  );

  if (!seoData.hasCanonicalPath) {
    return buildNotFoundProductMetadata();
  }

  const canonicalUrl = buildProductUrl(
    siteUrl,
    locale,
    seoData.categorySlug,
    seoData.subcategorySlug,
    seoData.productSlug
  );

  const languages = Object.fromEntries([
    ...SUPPORTED_LOCALES.map(localeItem => [
      localeItem,
      buildProductUrl(
        siteUrl,
        localeItem,
        seoData.categorySlug,
        seoData.subcategorySlug,
        seoData.productSlug
      ),
    ]),
    [
      'x-default',
      buildProductUrl(
        siteUrl,
        DEFAULT_LOCALE,
        seoData.categorySlug,
        seoData.subcategorySlug,
        seoData.productSlug
      ),
    ],
  ]);

  const copy = getProductSeoCopy(locale);

  const localizedName = getLocalizedText(
    product.name,
    locale,
    seoData.productSlug
  ).trim();

  const conditionLabel = getConditionLabel(product.condition, locale);

  const title = copy.title({
    conditionLabel,
    productName: localizedName,
  });

  const description = copy.description({
    conditionLabel,
    productName: localizedName,
  });

  const ogImage = product.photos?.[0];

  return {
    metadataBase: new URL(siteUrl),

    title,
    description,

    alternates: {
      canonical: canonicalUrl,
      languages,
    },

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: localizedName,
            },
          ]
        : [],
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function ProductDetailsPage({ params }: Props) {
  const { locale, categorySlug, subcategorySlug, slug } = await params;
  const siteUrl = getSiteUrl();

  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const seoData = resolveProductSeoData(
    product,
    locale,
    categorySlug,
    subcategorySlug,
    slug
  );

  if (!seoData.hasCanonicalPath) {
    notFound();
  }

  if (seoData.shouldRedirect) {
    redirect(
      `/${locale}${buildProductPath(
        seoData.categorySlug,
        seoData.subcategorySlug,
        seoData.productSlug
      )}`
    );
  }

  const canonicalUrl = buildProductUrl(
    siteUrl,
    locale,
    seoData.categorySlug,
    seoData.subcategorySlug,
    seoData.productSlug
  );

  const copy = getProductSeoCopy(locale);

  const localizedName = getLocalizedText(
    product.name,
    locale,
    seoData.productSlug
  );

  const localizedDescription = getLocalizedText(
    product.description,
    locale,
    copy.fallbackDescription
  );

  const productJsonLd = buildProductJsonLd({
    product,
    locale,
    canonicalUrl,
    localizedName,
    localizedDescription,
  });

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    {
      name: copy.breadcrumbs.home,
      item: `${siteUrl}/${locale}`,
    },
    {
      name: copy.breadcrumbs.allProducts,
      item: `${siteUrl}/${locale}/all-products`,
    },
    {
      name: seoData.categoryLabel,
      item: `${siteUrl}/${locale}/all-products/${seoData.categorySlug}`,
    },
    {
      name: seoData.subcategoryLabel,
      item: `${siteUrl}/${locale}/all-products/${seoData.categorySlug}/${seoData.subcategorySlug}`,
    },
    {
      name: localizedName,
      item: canonicalUrl,
    },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(productJsonLd),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(breadcrumbJsonLd),
        }}
      />

      <Product
        product={product}
        locale={locale}
        slug={seoData.productSlug}
        categorySlug={seoData.categorySlug}
        subcategorySlug={seoData.subcategorySlug}
      />

      <Suspense fallback={<div>Loading recommended products...</div>}>
        <RecommendedProducts
          locale={locale}
          slug={seoData.productSlug}
          categorySlug={seoData.categorySlug}
          subcategorySlug={seoData.subcategorySlug}
        />
      </Suspense>
    </>
  );
}
