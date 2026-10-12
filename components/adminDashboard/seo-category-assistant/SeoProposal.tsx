'use client';

import { ISeoProposalResponse, TDuplicateRisk } from '@interfaces/IAdminSeoAi';

import LanguageValues from './LanguageValues';
import SeoEntityCard from './SeoEntityCard';

type Props = {
  result: ISeoProposalResponse;

  creating: boolean;

  created: boolean;

  onRegenerate: () => void;

  onCreate: () => void;
};

const riskClasses: Record<TDuplicateRisk, string> = {
  LOW: 'bg-green-50 text-green-700 border-green-200',

  MEDIUM: 'bg-amber-50 text-amber-700 border-amber-200',

  HIGH: 'bg-red-50 text-red-700 border-red-200',
};

export default function SeoProposal({
  result,
  creating,
  created,
  onRegenerate,
  onCreate,
}: Props) {
  const { proposal, conflicts, research } = result;

  const reusableMatches = conflicts.items.filter(
    conflict => conflict.resolution === 'REUSE_EXISTING'
  );

  const blockingConflicts = conflicts.items.filter(
    conflict => conflict.blocking
  );

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h2 className="font-semibold text-gray-800">AI Recommendation</h2>

              {research?.webSearchUsed && (
                <span className="rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                  Web research completed
                </span>
              )}
            </div>

            <p className="text-sm leading-6 text-gray-600">
              {proposal.recommendation.reason}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <div>
              <p className="mb-1 text-xs text-gray-400">Primary keyword</p>

              <p className="text-sm font-semibold text-gray-700">
                {proposal.recommendation.primaryKeyword}
              </p>
            </div>

            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                riskClasses[proposal.recommendation.duplicateRisk]
              }`}
            >
              {proposal.recommendation.duplicateRisk} duplicate risk
            </span>
          </div>
        </div>
      </div>

      {proposal.recommendation.warnings.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
          <h3 className="font-semibold text-amber-800">AI warnings</h3>

          <ul className="mt-3 space-y-2">
            {proposal.recommendation.warnings.map((warning, index) => (
              <li
                key={`${warning}-${index}`}
                className="flex gap-2 text-sm leading-6 text-amber-700"
              >
                <span>•</span>

                <span>{warning}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {reusableMatches.length > 0 && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-5">
          <h3 className="font-semibold text-green-800">
            Existing category will be reused
          </h3>

          <p className="mt-1 text-sm text-green-700">
            The parent SEO category already exists. It will not be created
            again. The new subcategory will be linked to the existing category.
          </p>

          <div className="mt-4 space-y-2">
            {reusableMatches.map((match, index) => (
              <div
                key={`${match.entity}-${match.value}-${index}`}
                className="rounded-lg border border-green-100 bg-white px-4 py-3"
              >
                <p className="text-sm font-medium text-gray-800">
                  {match.message}
                </p>

                {match.existingSlug && (
                  <p className="mt-1 text-xs text-gray-500">
                    Existing category: /{match.existingSlug}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {blockingConflicts.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <h3 className="font-semibold text-red-800">
            Existing taxonomy conflicts
          </h3>

          <p className="mt-1 text-sm text-red-600">
            This structure cannot be created until these conflicts are resolved.
          </p>

          <div className="mt-4 space-y-2">
            {blockingConflicts.map((conflict, index) => (
              <div
                key={`${conflict.entity}-${conflict.field}-${index}`}
                className="rounded-lg border border-red-100 bg-white px-4 py-3"
              >
                <p className="text-sm font-medium text-gray-800">
                  {conflict.message}
                </p>

                {conflict.existingSlug && (
                  <p className="mt-1 text-xs text-gray-500">
                    Existing slug: /{conflict.existingSlug}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="mb-4">
          <h2 className="font-semibold text-gray-800">Recommended taxonomy</h2>

          <p className="mt-1 text-sm text-gray-500">
            Review all three entities before creating the structure.
          </p>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <SeoEntityCard type="category" entity={proposal.seoCategory} />

          <SeoEntityCard type="subcategory" entity={proposal.seoSubcategory} />
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-600">
            3
          </div>

          <div>
            <h3 className="font-semibold text-gray-800">Product Category</h3>

            <p className="text-xs text-gray-500">
              Canonical machine type used for product classification
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <LanguageValues
            label="Product category name"
            value={proposal.productCategory.name}
          />

          <div>
            <p className="text-xs font-medium text-gray-500">Slug</p>

            <div className="mt-1 rounded-lg bg-gray-50 px-3 py-2 font-mono text-sm text-gray-700">
              /{proposal.productCategory.slug}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500">Synonyms</p>

            <div className="mt-2 flex flex-wrap gap-2">
              {proposal.productCategory.synonyms.map(synonym => (
                <span
                  key={synonym}
                  className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600"
                >
                  {synonym}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="font-semibold text-gray-800">Confirm and create</h3>

            <p className="mt-1 text-sm text-gray-500">
              Nothing has been saved yet. Creating the structure will add the
              SEO Category, SEO Subcategory and Product Category to the
              database.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              disabled={creating}
              onClick={onRegenerate}
              className="inline-flex min-h-10 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Regenerate
            </button>

            <button
              type="button"
              disabled={creating || created || conflicts.hasBlockingConflicts}
              onClick={onCreate}
              className="inline-flex min-h-10 items-center justify-center rounded-lg bg-gray-800 px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {creating
                ? 'Creating...'
                : created
                  ? 'Structure created'
                  : 'Create SEO Structure'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
