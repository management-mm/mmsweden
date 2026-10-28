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

const soldProductSeoCopy: Record<
  AppLocale,
  { titlePrefix: string; description: string }
> = {
  en: {
    titlePrefix: 'Sold:',
    description:
      'This machine has been sold. Explore similar used food processing machinery at MM Sweden.',
  },
  sv: {
    titlePrefix: 'Såld:',
    description:
      'Den här maskinen är såld. Se liknande begagnade livsmedelsmaskiner hos MM Sweden.',
  },
  de: {
    titlePrefix: 'Verkauft:',
    description:
      'Diese Maschine ist verkauft. Entdecken Sie ähnliche gebrauchte Lebensmittelmaschinen bei MM Sweden.',
  },
  fr: {
    titlePrefix: 'Vendu :',
    description:
      'Cette machine a été vendue. Découvrez des équipements alimentaires d’occasion similaires chez MM Sweden.',
  },
  es: {
    titlePrefix: 'Vendido:',
    description:
      'Esta máquina ya se ha vendido. Descubra maquinaria alimentaria usada similar en MM Sweden.',
  },
  ru: {
    titlePrefix: 'Продано:',
    description:
      'Эта машина продана. Посмотрите аналогичное оборудование для пищевой промышленности в MM Sweden.',
  },
  uk: {
    titlePrefix: 'Продано:',
    description:
      'Цю машину продано. Перегляньте схоже обладнання для харчової промисловості в MM Sweden.',
  },
  pl: {
    titlePrefix: 'Sprzedano:',
    description:
      'Ta maszyna została sprzedana. Zobacz podobne używane maszyny spożywcze w MM Sweden.',
  },
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
      `${productName} – ${conditionLabel === 'Ny' ? 'ny maskin' : 'begagnad maskin'} | MM Sweden`,
    description: ({ productName }) =>
      `Se ${productName} hos MM Sweden. Läs om specifikationer och kontakta oss för mer information.`,
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
      `${productName} ${conditionLabel === 'Neue' ? 'neu' : 'gebraucht'} kaufen | MM Sweden`,
    description: ({ productName }) =>
      `Entdecken Sie ${productName} bei MM Sweden. Vergleichen Sie die technischen Daten und fragen Sie das Gerät an.`,
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
      `${productName} – équipement ${conditionLabel === 'neuf' ? 'neuf' : 'd’occasion'} | MM Sweden`,
    description: ({ productName }) =>
      `Découvrez ${productName} chez MM Sweden. Consultez les caractéristiques et demandez plus d’informations.`,
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
      `${productName} – maquinaria ${conditionLabel === 'nueva' ? 'nueva' : 'usada'} | MM Sweden`,
    description: ({ productName }) =>
      `Consulte ${productName} en MM Sweden. Vea las características del equipo y solicite más información.`,
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
      `${productName} — ${conditionLabel === 'новое' ? 'новое оборудование' : 'оборудование б/у'} | MM Sweden`,
    description: ({ productName }) =>
      `Оборудование ${productName} в MM Sweden. Ознакомьтесь с техническими характеристиками и отправьте запрос.`,
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
      `${productName} — ${conditionLabel === 'нове' ? 'нове обладнання' : 'вживане обладнання'} | MM Sweden`,
    description: ({ productName }) =>
      `Обладнання ${productName} у MM Sweden. Ознайомтеся з технічними характеристиками та надішліть запит.`,
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
      `${productName} – ${conditionLabel === 'Nowa' ? 'nowy sprzęt' : 'sprzęt używany'} | MM Sweden`,
    description: ({ productName }) =>
      `Sprawdź ${productName} w MM Sweden. Zobacz dane techniczne urządzenia i zapytaj o szczegóły.`,
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

/**
 * Build a meaningful equipment name using ONLY verified fields returned by
 * the product API. Never infer a model, year or output from the free text.
 * Missing structured fields simply do not appear in the public title.
 */
export function getProductSearchName(
  product: ProductWithSeo,
  locale: AppLocale,
  fallbackSlug: string
): string {
  const localizedName = getLocalizedText(
    product.name,
    locale,
    slugToLabel(fallbackSlug)
  )
    .replace(/\s+/g, ' ')
    .trim();

  const manufacturer = getNonEmptyString(product.manufacturer);
  const model = getNonEmptyString(product.model);
  const year =
    typeof product.yearOfManufacture === 'number' ||
    typeof product.yearOfManufacture === 'string'
      ? String(product.yearOfManufacture).trim()
      : '';
  const capacity = getNonEmptyString(product.capacity);

  const nameParts: string[] = [];
  for (const part of [manufacturer, model]) {
    if (
      part &&
      part.length <= 80 &&
      !localizedName.toLocaleLowerCase().includes(part.toLocaleLowerCase())
    ) {
      nameParts.push(part);
    }
  }

  let result = [...nameParts, localizedName].join(' ');
  // Only a genuinely populated, four-digit manufacture year is useful.
  // Do not mistake internal identifiers or stock numbers for a year.
  if (/^(18|19|20)\d{2}$/.test(year)) {
    const numericYear = Number(year);
    if (
      numericYear <= new Date().getUTCFullYear() + 1 &&
      !new RegExp(`\\b${year}\\b`).test(result)
    ) {
      result += `, ${year}`;
    }
  }

  if (
    capacity &&
    capacity.length <= 35 &&
    !result.toLocaleLowerCase().includes(capacity.toLocaleLowerCase())
  ) {
    result += `, ${capacity}`;
  }

  return result;
}

function cleanDescription(value: string): string {
  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Use the actual text for this machine instead of identical catalogue copy. */
export function getProductSeoDescription(
  product: ProductWithSeo,
  locale: AppLocale,
  productName: string
): string {
  const source = product.description;
  const exactTranslation =
    typeof source === 'string'
      ? locale === DEFAULT_LOCALE
        ? source
        : undefined
      : source && typeof source === 'object'
        ? source[locale]
        : undefined;
  const specificDescription = exactTranslation
    ? cleanDescription(exactTranslation)
    : '';

  if (specificDescription) {
    // Search snippets are short. Cut at a word boundary, never in the middle
    // of a specification, and do not silently translate unreviewed source text.
    if (specificDescription.length <= 160) return specificDescription;
    const boundary = specificDescription.lastIndexOf(' ', 157);
    return `${specificDescription.slice(0, boundary > 100 ? boundary : 157).trimEnd()}…`;
  }

  const copy = getProductSeoCopy(locale);
  return copy.description({
    conditionLabel:
      product.condition === 'new' ? copy.condition.new : copy.condition.used,
    productName,
  });
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
  const localizedName = getProductSearchName(
    product,
    locale,
    seoData.productSlug
  );
  const conditionLabel = getConditionLabel(product.condition, locale);
  const title = copy.title({
    conditionLabel,
    productName: localizedName,
  });
  const description = getProductSeoDescription(product, locale, localizedName);
  const sold = Boolean(product.deletionDate);
  const soldCopy = soldProductSeoCopy[locale];
  const seoTitle = sold
    ? `${soldCopy.titlePrefix} ${localizedName} | MM Sweden`
    : title;
  const seoDescription = sold ? soldCopy.description : description;
  const ogImage = product.photos?.find(
    (photo): photo is string =>
      typeof photo === 'string' && photo.trim().length > 0
  );

  return {
    metadataBase: new URL(normalizedSiteUrl),
    title: seoTitle,
    description: seoDescription,
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
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
      title: seoTitle,
      description: seoDescription,
      images: ogImage ? [ogImage] : [],
    },
  };
}
