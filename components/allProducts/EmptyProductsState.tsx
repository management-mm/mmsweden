import { LiaSearchMinusSolid } from 'react-icons/lia';

import { useTranslations } from 'next-intl';

import { NotFoundText } from '@enums/i18nConstants';

type EmptyProductsStateVariant = 'search' | 'filters' | 'category' | 'default';

interface EmptyProductsStateProps {
  variant?: EmptyProductsStateVariant;
  searchQuery?: string;
  categoryName?: string;
  className?: string;
}

const contentMap: Record<
  EmptyProductsStateVariant,
  {
    title: string;
    description: string;
  }
> = {
  search: {
    title: NotFoundText.NoProductsFound,
    description: NotFoundText.NoProductsFoundDesc,
  },
  filters: {
    title: NotFoundText.NoMatching,
    description: NotFoundText.NoMatchingDesc,
  },
  category: {
    title: NotFoundText.NoProductsCategory,
    description: NotFoundText.NoProductsCategoryDesc,
  },
  default: {
    title: NotFoundText.NoProductsAvailable,
    description: NotFoundText.NoProductsAvailableDesc,
  },
};

const EmptyProductsState = ({
  variant = 'default',
  searchQuery,
  categoryName,
  className = '',
}: EmptyProductsStateProps) => {
  const content = contentMap[variant];
  const t = useTranslations();

  return (
    <div
      className={`flex w-full flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 py-14 text-center shadow-sm ${className}`}
    >
      <div className="bg-secondary mb-5 flex h-16 w-16 items-center justify-center rounded-full">
        <LiaSearchMinusSolid size={42} className="fill-gray-400" />
      </div>

      <h2 className="text-xl font-semibold text-gray-900">
        {t(content.title)}
      </h2>

      <p className="mt-3 max-w-xl text-sm leading-6 text-gray-600">
        {t(content.description)}
      </p>

      {variant === 'search' && searchQuery && (
        <p className="mt-2 text-sm text-gray-500">
          {t(NotFoundText.SearchQuery)}:{' '}
          <span className="font-medium text-gray-700">“{searchQuery}”</span>
        </p>
      )}

      {variant === 'category' && categoryName && (
        <p className="mt-2 text-sm text-gray-500">
          {t(NotFoundText.Category)}:{' '}
          <span className="font-medium text-gray-700">{categoryName}</span>
        </p>
      )}
    </div>
  );
};

export default EmptyProductsState;
