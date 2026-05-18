'use client';

import { useState } from 'react';

import clsx from 'clsx';

type SeoIntroSectionProps = {
  h1: string;
  intro?: string | null;
};

export default function SeoIntroSection({ h1, intro }: SeoIntroSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const safeIntro = typeof intro === 'string' ? intro.trim() : '';

  if (!h1 && !safeIntro) return null;

  return (
    <section className="bg-secondary mb-6 rounded-2xl px-4 py-5 md:mb-8 md:px-6 md:py-7">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-[26px] leading-tight font-bold text-gray-950 sm:text-3xl md:text-4xl">
          {h1}
        </h1>

        {safeIntro && (
          <button
            type="button"
            onClick={() => setIsExpanded(prev => !prev)}
            className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 shadow-sm transition hover:bg-gray-100"
            aria-label={isExpanded ? 'Collapse text' : 'Show full text'}
            aria-expanded={isExpanded}
          >
            <span
              className={clsx(
                'text-xl leading-none transition-transform duration-300',
                isExpanded ? 'rotate-180' : 'rotate-0'
              )}
            >
              ↓
            </span>
          </button>
        )}
      </div>

      {safeIntro && (
        <div
          className={clsx(
            'mt-4 w-full text-[15px] leading-7 text-gray-700 md:text-base',
            '[&_a]:font-medium [&_a]:text-blue-700 [&_a]:underline [&_a]:underline-offset-2',
            !isExpanded && 'line-clamp-4 md:line-clamp-2'
          )}
          dangerouslySetInnerHTML={{ __html: safeIntro }}
        />
      )}
    </section>
  );
}
