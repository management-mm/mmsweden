'use client';

import { useState } from 'react';

import { AiProduct, Language } from 'types/aiAssistant.types';

interface Props {
  products: AiProduct[];
  language?: Language;

  total?: number;

  onSelectProduct?: (product: AiProduct) => void;
}

const INITIAL_VISIBLE_COUNT = 3;

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

    const url = photo.url ?? photo.src ?? photo.path;

    if (typeof url === 'string') {
      return url;
    }
  }

  return null;
};

// =========================================================
// LOCALIZED PRODUCT NAME
// =========================================================

const getProductName = (
  product: AiProduct,
  language: Language = 'en'
): string => {
  if (typeof product.name === 'string') {
    return product.name;
  }

  const localizedName = product.name?.[language];

  if (typeof localizedName === 'string' && localizedName.trim()) {
    return localizedName;
  }

  if (typeof product.name?.en === 'string' && product.name.en.trim()) {
    return product.name.en;
  }

  const fallback = Object.values(product.name ?? {}).find(
    value => typeof value === 'string'
  );

  return typeof fallback === 'string' ? fallback : 'Machine';
};

// =========================================================
// CONDITION
// =========================================================

const formatCondition = (
  condition?: string,
  language: Language = 'en'
): string | null => {
  if (!condition) {
    return null;
  }

  const normalized = condition.toLowerCase();

  const labels: Record<
    Language,
    {
      used: string;
      new: string;
    }
  > = {
    en: {
      used: 'Used',
      new: 'New',
    },

    sv: {
      used: 'Begagnad',
      new: 'Ny',
    },

    de: {
      used: 'Gebraucht',
      new: 'Neu',
    },

    fr: {
      used: 'Occasion',
      new: 'Neuf',
    },

    es: {
      used: 'Usada',
      new: 'Nueva',
    },

    ru: {
      used: 'Б/у',
      new: 'Новая',
    },

    uk: {
      used: 'Б/в',
      new: 'Нова',
    },

    pl: {
      used: 'Używana',
      new: 'Nowa',
    },
  };

  if (normalized === 'used') {
    return labels[language].used;
  }

  if (normalized === 'new') {
    return labels[language].new;
  }

  return condition;
};

// =========================================================
// UI LABELS
// =========================================================

const getShowMoreLabel = (count: number, language: Language): string => {
  const labels: Record<Language, string> = {
    en: `Show ${count} more`,
    sv: `Visa ${count} till`,
    de: `${count} weitere anzeigen`,
    fr: `Afficher ${count} de plus`,
    es: `Mostrar ${count} más`,
    ru: `Показать ещё ${count}`,
    uk: `Показати ще ${count}`,
    pl: `Pokaż jeszcze ${count}`,
  };

  return labels[language];
};

const getShowLessLabel = (language: Language): string => {
  const labels: Record<Language, string> = {
    en: 'Show less',
    sv: 'Visa mindre',
    de: 'Weniger anzeigen',
    fr: 'Afficher moins',
    es: 'Mostrar menos',
    ru: 'Скрыть',
    uk: 'Сховати',
    pl: 'Pokaż mniej',
  };

  return labels[language];
};

const getNoImageLabel = (language: Language): string => {
  const labels: Record<Language, string> = {
    en: 'No image',
    sv: 'Ingen bild',
    de: 'Kein Bild',
    fr: 'Pas d’image',
    es: 'Sin imagen',
    ru: 'Нет фото',
    uk: 'Немає фото',
    pl: 'Brak zdjęcia',
  };

  return labels[language];
};

// =========================================================
// COMPONENT
// =========================================================

export const AiProductList = ({
  products,
  language = 'en',
  total,
  onSelectProduct,
}: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const visibleProducts = isExpanded
    ? products
    : products.slice(0, INITIAL_VISIBLE_COUNT);

  const canExpand = products.length > INITIAL_VISIBLE_COUNT;

  const remainingCount = Math.max(products.length - INITIAL_VISIBLE_COUNT, 0);

  const totalFound = total ?? products.length;

  const currentlyVisible = visibleProducts.length;

  return (
    <div className="mt-3 flex flex-col gap-2">
      <div className="mb-1 text-[13px] leading-5 text-neutral-500">
        {isExpanded ? (
          <>
            Showing{' '}
            <span className="font-medium text-neutral-800">
              {currentlyVisible}
            </span>{' '}
            of{' '}
            <span className="font-medium text-neutral-800">{totalFound}</span>{' '}
            matching machines
          </>
        ) : (
          <>
            Showing{' '}
            <span className="font-medium text-neutral-800">
              {currentlyVisible}
            </span>{' '}
            results
          </>
        )}
      </div>
      {visibleProducts.map(product => {
        const image = getProductImage(product);

        const name = getProductName(product, language);

        const condition = formatCondition(product.condition, language);

        return (
          <button
            key={product._id}
            type="button"
            onClick={() => onSelectProduct?.(product)}
            className="group flex w-full items-center gap-3 rounded-xl border border-black/[0.08] bg-white p-2 text-left transition-all duration-150 hover:border-black/15 hover:shadow-sm"
          >
            {/* IMAGE */}

            <div className="h-[68px] w-[78px] shrink-0 overflow-hidden rounded-lg bg-neutral-100">
              {image ? (
                <img
                  src={image}
                  alt={name}
                  className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center px-2 text-center text-[10px] text-neutral-400">
                  {getNoImageLabel(language)}
                </div>
              )}
            </div>

            {/* PRODUCT INFO */}

            <div className="min-w-0 flex-1">
              <div className="line-clamp-2 text-[13px] leading-[1.35] font-semibold text-neutral-900">
                {name}
              </div>

              {product.manufacturer && (
                <div className="mt-1 truncate text-[11px] text-neutral-500">
                  {product.manufacturer}
                </div>
              )}

              <div className="mt-1.5 flex items-center gap-2">
                {condition && (
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-600">
                    {condition}
                  </span>
                )}

                {product.idNumber && (
                  <span className="text-[10px] text-neutral-400">
                    #{product.idNumber}
                  </span>
                )}
              </div>
            </div>

            {/* ARROW */}

            <div className="pr-1 text-xl text-neutral-300 transition group-hover:translate-x-0.5 group-hover:text-neutral-600">
              ›
            </div>
          </button>
        );
      })}

      {/* SHOW MORE / SHOW LESS */}

      {canExpand && (
        <button
          type="button"
          onClick={() => setIsExpanded(current => !current)}
          className="mt-2 rounded-xl py-2.5 text-center text-xs font-medium text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
        >
          {isExpanded
            ? getShowLessLabel(language)
            : getShowMoreLabel(remainingCount, language)}
        </button>
      )}
    </div>
  );
};
