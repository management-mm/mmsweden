'use client';

import { ISeoCategoryProposal } from '@interfaces/IAdminSeoAi';

import LanguageValues from './LanguageValues';

type Props = {
  type: 'category' | 'subcategory';
  entity: ISeoCategoryProposal;
};

export default function SeoEntityCard({ type, entity }: Props) {
  const title = type === 'category' ? 'SEO Category' : 'SEO Subcategory';

  const description =
    type === 'category'
      ? 'Top-level category · Level 1'
      : 'Child category · Level 2';

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="mb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-600">
            {type === 'category' ? '1' : '2'}
          </div>

          <div>
            <h3 className="font-semibold text-gray-800">{title}</h3>

            <p className="text-xs text-gray-500">{description}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <LanguageValues label="Category name" value={entity.name} />

        <div>
          <p className="text-xs font-medium text-gray-500">Slug</p>

          <div className="mt-1 rounded-lg bg-gray-50 px-3 py-2 font-mono text-sm text-gray-700">
            /{entity.slug}
          </div>
        </div>

        <LanguageValues label="SEO title" value={entity.seo.title} />

        <LanguageValues
          label="Meta description"
          value={entity.seo.description}
        />

        <LanguageValues label="H1" value={entity.seo.h1} />

        <LanguageValues label="Intro content" value={entity.content.intro} />
      </div>
    </div>
  );
}
