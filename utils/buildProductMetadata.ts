import type { IProduct } from '@interfaces/IProduct';
import type { Metadata } from 'next';

import type { ProductSeoData, ProductWithSeo } from './resolveProductSeoData';
import slugToLabel from './slugToLabel';

import {
  type AppLocale,
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
} from '@i18n/config';

type ProductConditionKey = 'new' | 'used';

export type ProductSeoCopy = {
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isMultiLang(value: unknown): value is Record<string, string> {
  if (!isRecord(value)) {
    return false;
  }

  return Object.values(value).some(item => typeof item === 'string');
}

function getNonEmptyString(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const normalizedValue = value.trim();

  return normalizedValue || undefined;
}

function normalizeSiteUrl(siteUrl: string): string {
  return siteUrl.replace(/\/+$/, '');
}

export function getProductSeoCopy(locale: AppLocale): ProductSeoCopy {
  return productSeoCopy[locale] ?? productSeoCopy[DEFAULT_LOCALE];
}

export function getLocalizedText(
  value: unknown,
  locale: AppLocale,
  fallback: string
): string {
  const directValue = getNonEmptyString(value);

  if (directValue) {
    return directValue;
  }

  if (isMultiLang(value)) {
    const candidates = [
      value[locale],
      value[DEFAULT_LOCALE],
      ...Object.values(value),
    ];

    for (const candidate of candidates) {
      const localizedValue = getNonEmptyString(candidate);

      if (localizedValue) {
        return localizedValue;
      }
    }
  }

  return fallback;
}

function getConditionLabel(
  condition: IProduct['condition'] | undefined,
  locale: AppLocale
): string {
  const copy = getProductSeoCopy(locale);

  return condition === 'new' ? copy.condition.new : copy.condition.used;
}

export function buildProductUrl(
  siteUrl: string,
  locale: AppLocale,
  categorySlug: string,
  subcategorySlug: string,
  slug: string
): string {
  const normalizedSiteUrl = normalizeSiteUrl(siteUrl);

  return `${normalizedSiteUrl}/${locale}/all-products/${categorySlug}/${subcategorySlug}/${slug}`;
}

export function buildNotFoundProductMetadata(): Metadata {
  return {
    title: 'Product Not Found | MM Sweden',
    description: 'The requested product could not be found.',
    robots: {
      index: false,
      follow: false,
    },
  };
}

type BuildProductMetadataParams = {
  product: ProductWithSeo;
  seoData: Pick<
    ProductSeoData,
    'categorySlug' | 'subcategorySlug' | 'productSlug'
  >;
  locale: AppLocale;
  siteUrl: string;
};

export function buildProductMetadata({
  product,
  seoData,
  locale,
  siteUrl,
}: BuildProductMetadataParams): Metadata {
  const normalizedSiteUrl = normalizeSiteUrl(siteUrl);
  const canonicalUrl = buildProductUrl(
    normalizedSiteUrl,
    locale,
    seoData.categorySlug,
    seoData.subcategorySlug,
    seoData.productSlug
  );

  const languages: Record<string, string> = {};

  for (const localeItem of SUPPORTED_LOCALES) {
    languages[localeItem] = buildProductUrl(
      normalizedSiteUrl,
      localeItem,
      seoData.categorySlug,
      seoData.subcategorySlug,
      seoData.productSlug
    );
  }

  languages['x-default'] = buildProductUrl(
    normalizedSiteUrl,
    DEFAULT_LOCALE,
    seoData.categorySlug,
    seoData.subcategorySlug,
    seoData.productSlug
  );

  const copy = getProductSeoCopy(locale);
  const localizedName = getLocalizedText(
    product.name,
    locale,
    slugToLabel(seoData.productSlug)
  );
  const conditionLabel = getConditionLabel(product.condition, locale);
  const title = copy.title({
    conditionLabel,
    productName: localizedName,
  });
  const description = copy.description({
    conditionLabel,
    productName: localizedName,
  });
  const ogImage = product.photos?.find(
    (photo): photo is string =>
      typeof photo === 'string' && photo.trim().length > 0
  );

  return {
    metadataBase: new URL(normalizedSiteUrl),
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
