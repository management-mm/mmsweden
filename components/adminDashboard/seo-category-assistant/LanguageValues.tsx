'use client';

import { useState } from 'react';

import { IMultiLanguageValue, TSeoLanguage } from '@interfaces/IAdminSeoAi';

type Props = {
  label: string;
  value: IMultiLanguageValue;
};

const languages: {
  key: TSeoLanguage;
  label: string;
}[] = [
  {
    key: 'en',
    label: 'English',
  },
  {
    key: 'sv',
    label: 'Swedish',
  },
  {
    key: 'de',
    label: 'German',
  },
  {
    key: 'fr',
    label: 'French',
  },
  {
    key: 'es',
    label: 'Spanish',
  },
  {
    key: 'ru',
    label: 'Russian',
  },
  {
    key: 'uk',
    label: 'Ukrainian',
  },
  {
    key: 'pl',
    label: 'Polish',
  },
];

export default function LanguageValues({ label, value }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50">
      <button
        type="button"
        onClick={() => setExpanded(current => !current)}
        className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left"
      >
        <div>
          <p className="text-xs font-medium text-gray-500">{label}</p>

          <p className="mt-1 text-sm text-gray-800">{value.en}</p>
        </div>

        <span className="text-sm text-gray-400">
          {expanded ? 'Hide' : 'All languages'}
        </span>
      </button>

      {expanded && (
        <div className="border-t border-gray-200 px-4 py-4">
          <div className="grid gap-4 md:grid-cols-2">
            {languages.map(language => (
              <div key={language.key}>
                <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
                  {language.label}
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-700">
                  {value[language.key]}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
