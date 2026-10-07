'use client';

import { useEffect, useState } from 'react';

import {
  getAiCategories,
  getAiCategoryProducts,
  getAiSubcategories,
} from '@api/aiAssistantService';
import { AiCategory, AiProduct, Language } from 'types/aiAssistant.types';

import { AiProductList } from './AiProductList';

interface Props {
  language?: Language;

  onClose: () => void;

  onSelectProduct: (product: AiProduct) => void;
}

type View = 'categories' | 'subcategories' | 'products';

const labels: Record<
  Language,
  {
    categories: string;
    subcategories: string;
    machines: string;
    loading: string;
    empty: string;
    error: string;
    back: string;
  }
> = {
  en: {
    categories: 'Browse categories',
    subcategories: 'Choose a subcategory',
    machines: 'Machines',
    loading: 'Loading...',
    empty: 'Nothing found.',
    error: 'Could not load categories.',
    back: 'Back',
  },

  sv: {
    categories: 'Bläddra bland kategorier',
    subcategories: 'Välj en underkategori',
    machines: 'Maskiner',
    loading: 'Laddar...',
    empty: 'Inget hittades.',
    error: 'Kunde inte ladda kategorier.',
    back: 'Tillbaka',
  },

  de: {
    categories: 'Kategorien durchsuchen',
    subcategories: 'Unterkategorie wählen',
    machines: 'Maschinen',
    loading: 'Wird geladen...',
    empty: 'Nichts gefunden.',
    error: 'Kategorien konnten nicht geladen werden.',
    back: 'Zurück',
  },

  fr: {
    categories: 'Parcourir les catégories',
    subcategories: 'Choisir une sous-catégorie',
    machines: 'Machines',
    loading: 'Chargement...',
    empty: 'Aucun résultat.',
    error: 'Impossible de charger les catégories.',
    back: 'Retour',
  },

  es: {
    categories: 'Explorar categorías',
    subcategories: 'Elige una subcategoría',
    machines: 'Máquinas',
    loading: 'Cargando...',
    empty: 'No se encontró nada.',
    error: 'No se pudieron cargar las categorías.',
    back: 'Atrás',
  },

  ru: {
    categories: 'Категории оборудования',
    subcategories: 'Выберите подкатегорию',
    machines: 'Оборудование',
    loading: 'Загрузка...',
    empty: 'Ничего не найдено.',
    error: 'Не удалось загрузить категории.',
    back: 'Назад',
  },

  uk: {
    categories: 'Категорії обладнання',
    subcategories: 'Оберіть підкатегорію',
    machines: 'Обладнання',
    loading: 'Завантаження...',
    empty: 'Нічого не знайдено.',
    error: 'Не вдалося завантажити категорії.',
    back: 'Назад',
  },

  pl: {
    categories: 'Kategorie urządzeń',
    subcategories: 'Wybierz podkategorię',
    machines: 'Maszyny',
    loading: 'Ładowanie...',
    empty: 'Nic nie znaleziono.',
    error: 'Nie udało się załadować kategorii.',
    back: 'Wstecz',
  },
};

export const AiCategoryBrowser = ({
  language = 'en',
  onClose,
  onSelectProduct,
}: Props) => {
  const [view, setView] = useState<View>('categories');

  const [categories, setCategories] = useState<AiCategory[]>([]);

  const [subcategories, setSubcategories] = useState<AiCategory[]>([]);

  const [products, setProducts] = useState<AiProduct[]>([]);

  const [total, setTotal] = useState(0);

  const [selectedCategory, setSelectedCategory] = useState<AiCategory | null>(
    null
  );

  const [selectedSubcategory, setSelectedSubcategory] =
    useState<AiCategory | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const text = labels[language];

  // =========================================================
  // LOAD ROOT CATEGORIES
  // =========================================================

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getAiCategories(language);

        setCategories(result);
      } catch (error) {
        console.error('AI categories error:', error);

        setError(text.error);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [language, text.error]);

  // =========================================================
  // SELECT CATEGORY
  // =========================================================

  const handleCategoryClick = async (category: AiCategory) => {
    setSelectedCategory(category);

    setSelectedSubcategory(null);

    setError(null);
    setIsLoading(true);

    try {
      const result = await getAiSubcategories(category.slug, language);

      const found = result?.subcategories ?? [];

      if (found.length > 0) {
        setSubcategories(found);

        setView('subcategories');

        return;
      }

      await loadProducts(category);
    } catch (error) {
      console.error('AI subcategories error:', error);

      setError(text.error);
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================
  // SELECT SUBCATEGORY
  // =========================================================

  const handleSubcategoryClick = async (subcategory: AiCategory) => {
    if (!selectedCategory) {
      return;
    }

    setSelectedSubcategory(subcategory);

    await loadProducts(selectedCategory, subcategory);
  };

  // =========================================================
  // LOAD PRODUCTS
  // =========================================================

  const loadProducts = async (
    category: AiCategory,
    subcategory?: AiCategory
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getAiCategoryProducts(
        category.slug,
        subcategory?.slug
      );

      setProducts(response.products ?? []);

      setTotal(response.total ?? response.products?.length ?? 0);

      setView('products');
    } catch (error) {
      console.error('AI category products error:', error);

      setError(text.error);
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================
  // BACK
  // =========================================================

  const handleBack = () => {
    if (view === 'products') {
      if (subcategories.length > 0) {
        setView('subcategories');

        return;
      }

      setView('categories');

      return;
    }

    if (view === 'subcategories') {
      setView('categories');

      setSelectedCategory(null);

      return;
    }

    onClose();
  };

  // =========================================================
  // TITLE
  // =========================================================

  const title = (() => {
    if (view === 'categories') {
      return text.categories;
    }

    if (view === 'subcategories') {
      return selectedCategory?.name ?? text.subcategories;
    }

    return selectedSubcategory?.name ?? selectedCategory?.name ?? text.machines;
  })();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* CATEGORY HEADER */}

      <div className="flex items-center gap-3 border-b border-black/[0.05] px-4 py-3">
        <button
          type="button"
          onClick={handleBack}
          aria-label={text.back}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
        >
          ←
        </button>

        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-neutral-900">
            {title}
          </div>

          {view === 'subcategories' && (
            <div className="mt-0.5 text-[11px] text-neutral-400">
              {text.subcategories}
            </div>
          )}
        </div>
      </div>

      {/* CONTENT */}

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
        {isLoading && (
          <div className="flex h-32 items-center justify-center text-sm text-neutral-400">
            {text.loading}
          </div>
        )}

        {!isLoading && error && (
          <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* CATEGORIES */}

        {!isLoading && !error && view === 'categories' && (
          <div className="flex flex-col gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                type="button"
                onClick={() => handleCategoryClick(category)}
                className="group flex w-full items-center justify-between rounded-xl border border-black/[0.07] bg-white px-4 py-3.5 text-left transition hover:border-black/[0.14] hover:shadow-sm"
              >
                <span className="text-[14px] font-medium text-neutral-800">
                  {category.name}
                </span>

                <span className="text-xl text-neutral-300 transition group-hover:translate-x-0.5 group-hover:text-neutral-600">
                  ›
                </span>
              </button>
            ))}

            {categories.length === 0 && (
              <div className="py-10 text-center text-sm text-neutral-400">
                {text.empty}
              </div>
            )}
          </div>
        )}

        {/* SUBCATEGORIES */}

        {!isLoading && !error && view === 'subcategories' && (
          <div className="flex flex-col gap-2">
            {subcategories.map(subcategory => (
              <button
                key={subcategory.id}
                type="button"
                onClick={() => handleSubcategoryClick(subcategory)}
                className="group flex w-full items-center justify-between rounded-xl border border-black/[0.07] bg-white px-4 py-3.5 text-left transition hover:border-black/[0.14] hover:shadow-sm"
              >
                <span className="text-[14px] font-medium text-neutral-800">
                  {subcategory.name}
                </span>

                <span className="text-xl text-neutral-300 transition group-hover:translate-x-0.5 group-hover:text-neutral-600">
                  ›
                </span>
              </button>
            ))}
          </div>
        )}

        {/* PRODUCTS */}

        {!isLoading && !error && view === 'products' && (
          <>
            <div className="mb-2 px-1 text-[13px] text-neutral-500">
              {total} {text.machines.toLowerCase()}
            </div>

            <AiProductList
              products={products}
              total={total}
              language={language}
              onSelectProduct={onSelectProduct}
            />

            {products.length === 0 && (
              <div className="py-10 text-center text-sm text-neutral-400">
                {text.empty}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
