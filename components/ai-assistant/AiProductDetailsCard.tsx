'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { AiProduct, Language } from 'types/aiAssistant.types';

import VideoPlayer from '@components/common/VideoPlayer';
import RequestPricingButton from '@components/productDetails/RequestPricingButton';

import { AiAssistantText } from '@enums/i18nConstants';

interface Props {
  product: AiProduct;

  message?: string;

  language?: Language;
}

// =========================================================
// LOCALIZED TEXT
// =========================================================

const getLocalizedText = (
  value: unknown,
  language: Language = 'en'
): string | null => {
  if (typeof value === 'string') {
    return value;
  }

  if (value && typeof value === 'object') {
    const translations = value as Record<string, unknown>;

    const localized = translations[language];

    if (typeof localized === 'string' && localized.trim()) {
      return localized;
    }

    if (typeof translations.en === 'string') {
      return translations.en;
    }

    const fallback = Object.values(translations).find(
      item => typeof item === 'string'
    );

    return typeof fallback === 'string' ? fallback : null;
  }

  return null;
};

// =========================================================
// PRODUCT IMAGE
// =========================================================

const getProductImage = (product: AiProduct): string | null => {
  if (!Array.isArray(product.photos) || product.photos.length === 0) {
    return null;
  }

  const firstPhoto = product.photos[0];

  if (typeof firstPhoto === 'string') {
    return firstPhoto;
  }

  if (firstPhoto && typeof firstPhoto === 'object') {
    const photo = firstPhoto as Record<string, unknown>;

    const possibleUrl = photo.url ?? photo.src ?? photo.path;

    if (typeof possibleUrl === 'string') {
      return possibleUrl;
    }
  }

  return null;
};

// =========================================================
// URL FROM MESSAGE
// =========================================================

const getUrlFromText = (text?: string): string | null => {
  if (!text) {
    return null;
  }

  const match = text.match(/https?:\/\/[^\s]+/i);

  if (!match) {
    return null;
  }

  return match[0].replace(/[),.;]+$/, '').trim();
};

// =========================================================
// CLEAN AI TEXT
// =========================================================

const cleanText = (text: string): string => {
  return (
    text
      // Markdown bold
      .replace(/\*\*(.*?)\*\*/g, '$1')

      // Markdown underline / bold
      .replace(/__(.*?)__/g, '$1')

      // Markdown code
      .replace(/`([^`]+)`/g, '$1')

      // URLs
      .replace(/https?:\/\/[^\s]+/gi, '')

      /*
       * Remove possible video headings generated
       * by older AI responses.
       */
      .replace(/^Видео этой машины:\s*$/gim, '')
      .replace(/^Відео цієї машини:\s*$/gim, '')
      .replace(/^Video(?: of this machine)?:\s*$/gim, '')
      .replace(/^Video dieser Maschine:\s*$/gim, '')
      .replace(/^Vidéo de cette machine\s*:\s*$/gim, '')
      .replace(/^Vídeo de esta máquina\s*:\s*$/gim, '')
      .replace(/^Video av den här maskinen:\s*$/gim, '')
      .replace(/^Film tej maszyny:\s*$/gim, '')

      // Markdown headings
      .replace(/^#{1,6}\s+/gm, '')

      // Bullets
      .replace(/^\s*[-*]\s+/gm, '• ')

      .replace(/\n{3,}/g, '\n\n')

      .trim()
  );
};

// =========================================================
// VIDEO URL
// =========================================================

const getVideoUrl = (value: unknown): string | null => {
  if (!value) {
    return null;
  }

  // STRING

  if (typeof value === 'string') {
    const trimmed = value.trim();

    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }

    return null;
  }

  // ARRAY

  if (Array.isArray(value)) {
    for (const item of value) {
      const result = getVideoUrl(item);

      if (result) {
        return result;
      }
    }

    return null;
  }

  // OBJECT

  if (typeof value === 'object') {
    const item = value as Record<string, unknown>;

    const preferredKeys = [
      'url',
      'src',
      'video',
      'videoUrl',
      'youtube',
      'youtubeUrl',
      'link',
      'path',
      'secure_url',

      'en',
      'sv',
      'de',
      'fr',
      'es',
      'ru',
      'uk',
      'pl',
    ];

    for (const key of preferredKeys) {
      if (key in item) {
        const result = getVideoUrl(item[key]);

        if (result) {
          return result;
        }
      }
    }

    for (const childValue of Object.values(item)) {
      const result = getVideoUrl(childValue);

      if (result) {
        return result;
      }
    }
  }

  return null;
};

// =========================================================
// DIMENSIONS
// =========================================================

const formatDimensions = (dimensions: unknown): string | null => {
  if (!dimensions) {
    return null;
  }

  if (typeof dimensions === 'string') {
    return dimensions;
  }

  if (typeof dimensions === 'number') {
    return String(dimensions);
  }

  if (typeof dimensions === 'object') {
    const dimensionObject = dimensions as Record<string, unknown>;

    const values = Object.entries(dimensionObject)
      .filter(
        ([, value]) => typeof value === 'string' || typeof value === 'number'
      )
      .map(([key, value]) => `${key}: ${String(value)}`);

    if (values.length > 0) {
      return values.join(' · ');
    }
  }

  return null;
};

// =========================================================
// SEO SLUG
// =========================================================

const getSeoSlug = (value: unknown): string | null => {
  if (!value) {
    return null;
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'object') {
    const item = value as Record<string, unknown>;

    if (typeof item.slug === 'string') {
      return item.slug;
    }
  }

  return null;
};

// =========================================================
// COMPONENT
// =========================================================

export const AiProductDetailsCard = ({
  product,
  message,
  language = 'en',
}: Props) => {
  const router = useRouter();

  const t = useTranslations();

  const image = getProductImage(product);

  const name =
    getLocalizedText(product.name, language) ??
    t(AiAssistantText.ProductDetailsMachineFallback);

  const description = getLocalizedText(product.description, language);

  const manufacturer =
    typeof product.manufacturer === 'string' ? product.manufacturer : null;

  const idNumber =
    typeof product.idNumber === 'string' ? product.idNumber : null;

  const normalizedCondition =
    typeof product.condition === 'string'
      ? product.condition.toLowerCase()
      : null;

  const condition =
    normalizedCondition === 'used'
      ? t(AiAssistantText.ProductDetailsConditionUsed)
      : normalizedCondition === 'new'
        ? t(AiAssistantText.ProductDetailsConditionNew)
        : typeof product.condition === 'string'
          ? product.condition
          : null;

  const dimensions = formatDimensions(product.dimensions);

  const productVideoUrl = getVideoUrl(product.video);

  const messageVideoUrl = getUrlFromText(message);

  const videoUrl = productVideoUrl ?? messageVideoUrl;

  console.log('AI VIDEO RESULT:', {
    raw: product.video,

    videoUrl,
  });

  const categorySlug = getSeoSlug(product.seoCategoryId);

  const subcategorySlug = getSeoSlug(product.seoSubcategoryId);

  const productSlug = typeof product.slug === 'string' ? product.slug : null;

  const handleViewMachine = () => {
    if (!categorySlug || !subcategorySlug || !productSlug) {
      console.warn('Cannot build product URL:', {
        categorySlug,
        subcategorySlug,
        productSlug,
        product,
      });

      return;
    }

    router.push(
      `/all-products/${categorySlug}/${subcategorySlug}/${productSlug}`
    );
  };

  const cleanedMessage = message ? cleanText(message) : '';

  return (
    <div className="w-full max-w-full min-w-0 overflow-hidden rounded-2xl border border-black/[0.07] bg-white">
      {/* IMAGE */}

      <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
        {image ? (
          <img src={image} alt={name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
            {t(AiAssistantText.ProductDetailsNoImage)}
          </div>
        )}

        {condition && (
          <span className="absolute top-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-medium text-neutral-700 shadow-sm">
            {condition}
          </span>
        )}
      </div>

      {/* CONTENT */}

      <div className="p-4">
        <h3 className="text-[16px] leading-snug font-semibold text-neutral-900">
          {name}
        </h3>

        {manufacturer && (
          <div className="mt-1 text-xs text-neutral-500">{manufacturer}</div>
        )}

        {/* META */}

        <div className="mt-3 flex flex-wrap gap-2">
          {idNumber && (
            <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] text-neutral-600">
              #{idNumber}
            </span>
          )}

          {dimensions && (
            <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] text-neutral-600">
              {dimensions}
            </span>
          )}
        </div>

        {/* DATABASE DESCRIPTION */}

        {description && (
          <p className="mt-4 line-clamp-3 text-[13px] leading-5 text-neutral-600">
            {description}
          </p>
        )}

        {/* VIDEO */}

        <div className="mt-4 w-full min-w-0 border-t border-black/[0.06] pt-4">
          <div className="mb-3 text-[11px] font-semibold tracking-wide text-neutral-400 uppercase">
            {t(AiAssistantText.ProductDetailsVideo)}
          </div>

          {videoUrl ? (
            <div className="relative h-[180px] max-h-[180px] w-full max-w-full overflow-hidden rounded-xl bg-black [&>div]:!h-full [&>div]:!max-h-[180px] [&>div]:!w-full [&>div>div]:!h-full [&>div>div]:!max-h-[180px] [&>div>div]:!w-full">
              <VideoPlayer
                video={videoUrl}
                className="!h-full !max-h-[180px] !w-full lg:!h-full lg:!max-h-[180px]"
                containerIconClassName="
                  !h-11
                  !w-11
                "
              />
            </div>
          ) : (
            <div className="rounded-xl bg-neutral-50 px-4 py-3 text-[13px] leading-5 text-neutral-500">
              {t(AiAssistantText.ProductDetailsVideoUnavailable)}
            </div>
          )}
        </div>

        {/* AI DESCRIPTION */}

        {cleanedMessage && (
          <div className="mt-4 border-t border-black/[0.06] pt-4">
            <div className="mb-2 text-[11px] font-semibold tracking-wide text-neutral-400 uppercase">
              {t(AiAssistantText.ProductDetailsAboutMachine)}
            </div>

            <div className="text-[13px] leading-[1.6] whitespace-pre-line text-neutral-700">
              {cleanedMessage}
            </div>
          </div>
        )}

        {/* ACTIONS */}

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            disabled={!product.slug}
            onClick={handleViewMachine}
            className="border-primary font-inter text-primary flex cursor-pointer items-center justify-center rounded-[32px] border bg-transparent px-5 py-[14px] text-[12px] font-semibold"
          >
            {t(AiAssistantText.ProductDetailsViewMachine)}
          </button>

          <div className="flex-1">
            <RequestPricingButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
};
