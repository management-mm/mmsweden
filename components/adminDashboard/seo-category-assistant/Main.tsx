'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';

import {
  createSeoStructure,
  generateSeoProposal,
  getSeoParentCategories,
} from '@api/adminSeoAiService';
import { ISeoProposalResponse } from '@interfaces/IAdminSeoAi';

import SeoProposal from './SeoProposal';

import { getErrorMessage } from '@utils/errors/getErrorMessage';
import { normalizeError } from '@utils/errors/normalizeError';

// ============================================================
// TYPES
// ============================================================

type SeoStructureMode = 'CREATE_CATEGORY_WITH_SUBCATEGORY' | 'ADD_SUBCATEGORY';

interface SeoParentCategory {
  _id: string;

  name: {
    en: string;
    sv?: string;
    de?: string;
    fr?: string;
    es?: string;
    ru?: string;
    uk?: string;
    pl?: string;
  };

  slug: string;

  level: number;
}

function extractParentCategories(value: unknown): SeoParentCategory[] {
  if (Array.isArray(value)) {
    return value as SeoParentCategory[];
  }

  if (value && typeof value === 'object') {
    const firstLevel = (value as Record<string, unknown>).data;

    if (Array.isArray(firstLevel)) {
      return firstLevel as SeoParentCategory[];
    }

    if (firstLevel && typeof firstLevel === 'object') {
      const secondLevel = (firstLevel as Record<string, unknown>).data;

      if (Array.isArray(secondLevel)) {
        return secondLevel as SeoParentCategory[];
      }
    }
  }

  return [];
}

// ============================================================
// COMPONENT
// ============================================================

export default function Main() {
  // ==========================================================
  // MODE
  // ==========================================================

  const [mode, setMode] = useState<SeoStructureMode>(
    'CREATE_CATEGORY_WITH_SUBCATEGORY'
  );

  // ==========================================================
  // FORM
  // ==========================================================

  const [categoryQuery, setCategoryQuery] = useState('');

  const [subcategoryQuery, setSubcategoryQuery] = useState('');

  const [parentCategoryId, setParentCategoryId] = useState('');

  // ==========================================================
  // EXISTING LEVEL 1 CATEGORIES
  // ==========================================================

  const [parentCategories, setParentCategories] = useState<SeoParentCategory[]>(
    []
  );

  const [loadingParentCategories, setLoadingParentCategories] = useState(false);

  const [parentCategoriesError, setParentCategoriesError] = useState('');

  // ==========================================================
  // RESULT
  // ==========================================================

  const [result, setResult] = useState<ISeoProposalResponse | null>(null);

  const [generating, setGenerating] = useState(false);

  const [creating, setCreating] = useState(false);

  const [created, setCreated] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const [successMessage, setSuccessMessage] = useState('');

  // ==========================================================
  // LOAD EXISTING LEVEL 1 CATEGORIES
  // ==========================================================

  const loadParentCategories = useCallback(async () => {
    try {
      setLoadingParentCategories(true);

      setParentCategoriesError('');

      const response = await getSeoParentCategories();

      console.log('SEO categories response:', response);

      const categories = extractParentCategories(response);

      console.log('SEO categories extracted:', categories);

      setParentCategories(
        [...categories].sort((a, b) => a.name.en.localeCompare(b.name.en))
      );
    } catch (error) {
      console.error('SEO categories error:', error);

      const normalizedError = normalizeError(error);

      setParentCategoriesError(getErrorMessage(normalizedError));

      setParentCategories([]);
    } finally {
      setLoadingParentCategories(false);
    }
  }, []);

  useEffect(() => {
    void loadParentCategories();
  }, [loadParentCategories]);

  // ==========================================================
  // SELECTED PARENT
  // ==========================================================

  const selectedParentCategory = useMemo(() => {
    return (
      parentCategories.find(category => category._id === parentCategoryId) ??
      null
    );
  }, [parentCategories, parentCategoryId]);

  // ==========================================================
  // CAN GENERATE
  // ==========================================================

  const canGenerate = useMemo(() => {
    const hasSubcategory = Boolean(subcategoryQuery.trim());

    if (mode === 'CREATE_CATEGORY_WITH_SUBCATEGORY') {
      return Boolean(categoryQuery.trim() && hasSubcategory);
    }

    return Boolean(parentCategoryId && hasSubcategory);
  }, [mode, categoryQuery, subcategoryQuery, parentCategoryId]);

  // ==========================================================
  // RESET RESULT AFTER FORM CHANGE
  // ==========================================================

  const clearGeneratedResult = useCallback(() => {
    setResult(null);
    setCreated(false);
    setSuccessMessage('');
    setErrorMessage('');
  }, []);

  // ==========================================================
  // CHANGE MODE
  // ==========================================================

  const handleModeChange = useCallback(
    (nextMode: SeoStructureMode) => {
      if (generating || creating) {
        return;
      }

      setMode(nextMode);

      setResult(null);

      setCreated(false);

      setErrorMessage('');

      setSuccessMessage('');

      if (nextMode === 'CREATE_CATEGORY_WITH_SUBCATEGORY') {
        setParentCategoryId('');
      } else {
        setCategoryQuery('');
      }
    },
    [generating, creating]
  );

  // ==========================================================
  // GENERATE PROPOSAL
  // ==========================================================

  const handleGenerate = useCallback(async () => {
    const trimmedSubcategoryQuery = subcategoryQuery.trim();

    if (!trimmedSubcategoryQuery) {
      return;
    }

    if (mode === 'CREATE_CATEGORY_WITH_SUBCATEGORY' && !categoryQuery.trim()) {
      return;
    }

    if (mode === 'ADD_SUBCATEGORY' && !parentCategoryId) {
      return;
    }

    try {
      setGenerating(true);

      setErrorMessage('');

      setSuccessMessage('');

      setCreated(false);

      const data =
        mode === 'CREATE_CATEGORY_WITH_SUBCATEGORY'
          ? await generateSeoProposal({
              mode,

              categoryQuery: categoryQuery.trim(),

              subcategoryQuery: trimmedSubcategoryQuery,
            })
          : await generateSeoProposal({
              mode,

              parentCategoryId,

              subcategoryQuery: trimmedSubcategoryQuery,
            });

      setResult(data);
    } catch (error) {
      const normalizedError = normalizeError(error);

      setErrorMessage(getErrorMessage(normalizedError));
    } finally {
      setGenerating(false);
    }
  }, [mode, categoryQuery, subcategoryQuery, parentCategoryId]);

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!canGenerate) {
        return;
      }

      void handleGenerate();
    },
    [canGenerate, handleGenerate]
  );

  // ==========================================================
  // CREATE STRUCTURE
  // ==========================================================

  const handleCreate = useCallback(async () => {
    if (!result) {
      return;
    }

    if (result.conflicts.hasBlockingConflicts) {
      return;
    }

    try {
      setCreating(true);

      setErrorMessage('');

      setSuccessMessage('');

      const response = await createSeoStructure({
        mode: result.mode,

        parentCategoryId: result.input.parentCategoryId ?? undefined,

        proposal: result.proposal,
      });

      setCreated(true);

      setSuccessMessage(
        response.message || 'SEO structure created successfully.'
      );

      // Refresh Level 1 categories in case we just created one.
      await loadParentCategories();
    } catch (error) {
      const normalizedError = normalizeError(error);

      setErrorMessage(getErrorMessage(normalizedError));
    } finally {
      setCreating(false);
    }
  }, [result, loadParentCategories]);

  // ==========================================================
  // RESET
  // ==========================================================

  const handleReset = useCallback(() => {
    setMode('CREATE_CATEGORY_WITH_SUBCATEGORY');

    setCategoryQuery('');

    setSubcategoryQuery('');

    setParentCategoryId('');

    setResult(null);

    setErrorMessage('');

    setSuccessMessage('');

    setCreated(false);
  }, []);

  // ==========================================================
  // HAS FORM VALUES
  // ==========================================================

  const hasFormValues = Boolean(
    categoryQuery || subcategoryQuery || parentCategoryId
  );

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <section className="p-6">
      <div className="mx-auto max-w-[1200px]">
        <div className="rounded-2xl bg-white p-6 shadow-md">
          {/* ==================================================
              HEADER
          ================================================== */}

          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                AI SEO Category Assistant
              </h1>

              <p className="mt-1 max-w-3xl text-sm leading-6 text-gray-500">
                Research industry terminology, compare it with the existing
                taxonomy and prepare the correct SEO Category, SEO Subcategory
                and Product Category structure.
              </p>
            </div>

            {(result || hasFormValues) && (
              <button
                type="button"
                disabled={generating || creating}
                onClick={handleReset}
                className="inline-flex min-h-10 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Start over
              </button>
            )}
          </div>

          <div className="mb-6 h-px bg-gray-200" />

          {/* ==================================================
              STEP 1
          ================================================== */}

          <div className="mb-6">
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-800 text-sm font-semibold text-white">
                1
              </div>

              <div>
                <h2 className="font-semibold text-gray-800">
                  Choose taxonomy structure
                </h2>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Decide whether you want to create a completely new Level 1
                  category with its first subcategory, or add a new subcategory
                  to an existing category.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="rounded-xl border border-gray-200 bg-gray-50 p-4"
            >
              {/* ==============================================
                  MODE
              ============================================== */}

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <button
                  type="button"
                  disabled={generating || creating}
                  onClick={() =>
                    handleModeChange('CREATE_CATEGORY_WITH_SUBCATEGORY')
                  }
                  className={`rounded-xl border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    mode === 'CREATE_CATEGORY_WITH_SUBCATEGORY'
                      ? 'border-gray-800 bg-white ring-1 ring-gray-800'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                        mode === 'CREATE_CATEGORY_WITH_SUBCATEGORY'
                          ? 'border-gray-800'
                          : 'border-gray-300'
                      }`}
                    >
                      {mode === 'CREATE_CATEGORY_WITH_SUBCATEGORY' && (
                        <div className="h-2.5 w-2.5 rounded-full bg-gray-800" />
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        New Category + Subcategory
                      </p>

                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        Create a new Level 1 SEO Category together with a new
                        Level 2 SEO Subcategory.
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  disabled={generating || creating}
                  onClick={() => handleModeChange('ADD_SUBCATEGORY')}
                  className={`rounded-xl border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    mode === 'ADD_SUBCATEGORY'
                      ? 'border-gray-800 bg-white ring-1 ring-gray-800'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                        mode === 'ADD_SUBCATEGORY'
                          ? 'border-gray-800'
                          : 'border-gray-300'
                      }`}
                    >
                      {mode === 'ADD_SUBCATEGORY' && (
                        <div className="h-2.5 w-2.5 rounded-full bg-gray-800" />
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        Add Subcategory
                      </p>

                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        Keep an existing Level 1 category and add a new Level 2
                        subcategory below it.
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              {/* ==============================================
                  CREATE CATEGORY + SUBCATEGORY
              ============================================== */}

              {mode === 'CREATE_CATEGORY_WITH_SUBCATEGORY' && (
                <div className="mt-6 space-y-5">
                  <div>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <label
                        htmlFor="seo-category-query"
                        className="text-sm font-medium text-gray-700"
                      >
                        SEO Category · Level 1
                      </label>

                      <span className="text-xs text-gray-400">Required</span>
                    </div>

                    <input
                      id="seo-category-query"
                      type="text"
                      value={categoryQuery}
                      disabled={generating || creating}
                      onChange={event => {
                        setCategoryQuery(event.target.value);

                        clearGeneratedResult();
                      }}
                      placeholder="e.g. Palletizing & End-of-Line"
                      className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 transition outline-none placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                    />

                    <p className="mt-2 text-xs leading-5 text-gray-500">
                      Enter the broad Level 1 category idea. The AI may improve
                      the terminology, but it will not move this concept under
                      another existing category.
                    </p>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <label
                        htmlFor="seo-subcategory-query"
                        className="text-sm font-medium text-gray-700"
                      >
                        SEO Subcategory · Level 2
                      </label>

                      <span className="text-xs text-gray-400">Required</span>
                    </div>

                    <input
                      id="seo-subcategory-query"
                      type="text"
                      value={subcategoryQuery}
                      disabled={generating || creating}
                      onChange={event => {
                        setSubcategoryQuery(event.target.value);

                        clearGeneratedResult();
                      }}
                      placeholder="e.g. Palletizers"
                      className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 transition outline-none placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                    />

                    <p className="mt-2 text-xs leading-5 text-gray-500">
                      Every new Level 1 category must be created together with
                      at least one Level 2 subcategory.
                    </p>
                  </div>

                  <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
                    <p className="text-sm font-medium text-blue-800">
                      New taxonomy structure
                    </p>

                    <p className="mt-1 text-xs leading-5 text-blue-700">
                      New Level 1 Category
                      {' → '}
                      New Level 2 Subcategory
                      {' → '}
                      New Product Category
                    </p>
                  </div>
                </div>
              )}

              {/* ==============================================
                  ADD SUBCATEGORY
              ============================================== */}

              {mode === 'ADD_SUBCATEGORY' && (
                <div className="mt-6 space-y-5">
                  <div>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <label
                        htmlFor="seo-parent-category"
                        className="text-sm font-medium text-gray-700"
                      >
                        Existing SEO Category · Level 1
                      </label>

                      <span className="text-xs text-gray-400">Required</span>
                    </div>

                    <select
                      id="seo-parent-category"
                      value={parentCategoryId}
                      disabled={
                        generating || creating || loadingParentCategories
                      }
                      onChange={event => {
                        setParentCategoryId(event.target.value);

                        clearGeneratedResult();
                      }}
                      className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 transition outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                    >
                      <option value="">
                        {loadingParentCategories
                          ? 'Loading categories...'
                          : 'Select existing Level 1 category'}
                      </option>

                      {parentCategories.map(category => (
                        <option key={category._id} value={category._id}>
                          {category.name.en} (/
                          {category.slug})
                        </option>
                      ))}
                    </select>

                    {parentCategoriesError && (
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <p className="text-xs text-red-600">
                          {parentCategoriesError}
                        </p>

                        <button
                          type="button"
                          disabled={loadingParentCategories}
                          onClick={() => void loadParentCategories()}
                          className="text-xs font-medium text-red-700 underline disabled:opacity-50"
                        >
                          Try again
                        </button>
                      </div>
                    )}

                    {selectedParentCategory && (
                      <div className="mt-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
                        <p className="text-xs font-medium tracking-wide text-green-700 uppercase">
                          Existing parent
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-800">
                          {selectedParentCategory.name.en}
                        </p>

                        <p className="mt-0.5 text-xs text-gray-500">
                          /{selectedParentCategory.slug}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <label
                        htmlFor="existing-category-subcategory-query"
                        className="text-sm font-medium text-gray-700"
                      >
                        SEO Subcategory · Level 2
                      </label>

                      <span className="text-xs text-gray-400">Required</span>
                    </div>

                    <input
                      id="existing-category-subcategory-query"
                      type="text"
                      value={subcategoryQuery}
                      disabled={generating || creating}
                      onChange={event => {
                        setSubcategoryQuery(event.target.value);

                        clearGeneratedResult();
                      }}
                      placeholder="e.g. Industrial Bread Slicers"
                      className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 transition outline-none placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                    />

                    <p className="mt-2 text-xs leading-5 text-gray-500">
                      The selected Level 1 category will stay unchanged. The AI
                      will research only the new subcategory and Product
                      Category structure.
                    </p>
                  </div>

                  <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3">
                    <p className="text-sm font-medium text-green-800">
                      Existing parent will be reused
                    </p>

                    <p className="mt-1 text-xs leading-5 text-green-700">
                      Existing Level 1 Category
                      {' → '}
                      New Level 2 Subcategory
                      {' → '}
                      New Product Category
                    </p>
                  </div>
                </div>
              )}

              {/* ==============================================
                  SUBMIT
              ============================================== */}

              <div className="mt-6 flex flex-col gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-2xl text-xs leading-5 text-gray-500">
                  The assistant will search the web, compare industry
                  terminology and check the existing MM Sweden taxonomy. Nothing
                  is created automatically.
                </p>

                <button
                  type="submit"
                  disabled={generating || creating || !canGenerate}
                  className="inline-flex min-h-11 min-w-[210px] items-center justify-center rounded-lg bg-gray-800 px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {generating ? 'Researching...' : 'Research SEO Structure'}
                </button>
              </div>
            </form>
          </div>

          {/* ==================================================
              GENERATING
          ================================================== */}

          {generating && (
            <div className="mb-6 rounded-xl border border-gray-200 px-6 py-12">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-gray-700" />

                <div>
                  <p className="font-medium text-gray-800">
                    Researching taxonomy terminology...
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Checking public web sources and the existing MM Sweden
                    taxonomy.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================
              ERROR
          ================================================== */}

          {!generating && errorMessage && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-5">
              <h2 className="font-semibold text-red-800">
                SEO assistant error
              </h2>

              <p className="mt-1 text-sm text-red-600">{errorMessage}</p>

              {!created && (
                <button
                  type="button"
                  disabled={generating || creating || !canGenerate}
                  onClick={() => void handleGenerate()}
                  className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Try again
                </button>
              )}
            </div>
          )}

          {/* ==================================================
              SUCCESS
          ================================================== */}

          {successMessage && (
            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-5">
              <h2 className="font-semibold text-green-800">
                SEO structure created
              </h2>

              <p className="mt-1 text-sm text-green-700">{successMessage}</p>
            </div>
          )}

          {/* ==================================================
              PROPOSAL
          ================================================== */}

          {!generating && result && (
            <>
              <div className="mb-6 flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-800 text-sm font-semibold text-white">
                  2
                </div>

                <div>
                  <h2 className="font-semibold text-gray-800">
                    Research and recommendation
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Review the AI recommendation carefully before creating
                    anything in the database.
                  </p>
                </div>
              </div>

              <SeoProposal
                result={result}
                creating={creating}
                created={created}
                onRegenerate={() => void handleGenerate()}
                onCreate={() => void handleCreate()}
              />
            </>
          )}

          {/* ==================================================
              EMPTY STATE
          ================================================== */}

          {!generating && !result && !errorMessage && (
            <div className="rounded-xl border border-dashed border-gray-300 px-6 py-14 text-center">
              <h2 className="font-semibold text-gray-800">
                No SEO proposal yet
              </h2>

              <p className="mx-auto mt-1 max-w-xl text-sm leading-6 text-gray-500">
                Choose how the taxonomy should be structured, enter the Level 1
                and Level 2 ideas where required, and let the assistant research
                the terminology before anything is created.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
