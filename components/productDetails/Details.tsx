import type { FC } from 'react';
import Skeleton from 'react-loading-skeleton';

import type { IProduct } from '@interfaces/IProduct';

import DecorativeLine from '@components/common/DecorativeLine';
import RequestPricingButton from './RequestPricingButton';

import { Filter, Product } from '@enums/i18nConstants';
import { AppLocale } from '@i18n/config';
import { useTranslations } from 'next-intl';

interface IDetailsProps {
  product: IProduct;
  language: AppLocale;
  isLoading: boolean;
}

const Details: FC<IDetailsProps> = ({
  product,
  language,
  isLoading,
}) => {
  const t = useTranslations();

  const {
    idNumber,
    description,
    category,
    manufacturer,
    industries,
    condition,
    dimensions,
    deletionDate,
  } = product;

  return (
    <div className="bg-secondary flex min-h-[450px] w-full min-w-0 shrink-0 flex-col overflow-hidden rounded-[4px] px-[14px] pt-[14px] pb-[32px] md:w-[300px] lg:w-[390px]">
      <h3 className="text-primary mb-[14px] text-[18px] font-semibold uppercase md:mb-[22px]">
        {isLoading ? (
          <Skeleton className="!block max-w-[120px]" />
        ) : (
          <>
            Id nr # <span>{idNumber}</span>
          </>
        )}
      </h3>

      <DecorativeLine intent="product" />

      <div className="font-openSans mb-[12px] flex min-w-0 gap-[8px] text-[14px]">
        <h4 className="text-desc shrink-0">{t(Product.Dimensions)}:</h4>
        <p className="text-title min-w-0 flex-1">
          {isLoading ? (
            <Skeleton className="!block w-full max-w-[120px]" />
          ) : (
            dimensions
          )}
        </p>
      </div>

      <div className="font-openSans mb-[12px] flex min-w-0 gap-[8px] text-[14px]">
        <h4 className="text-desc shrink-0">{t(Filter.Category)}:</h4>
        <p className="text-title min-w-0 flex-1">
          {isLoading ? (
            <Skeleton className="!block w-full max-w-[100px]" />
          ) : (
            category?.[language] || category?.en
          )}
        </p>
      </div>

      {manufacturer && (
        <div className="font-openSans mb-[12px] flex min-w-0 gap-[8px] text-[14px]">
          <h4 className="text-desc shrink-0">{t(Filter.Manufacturer)}:</h4>
          <p className="text-title min-w-0 flex-1">
            {isLoading ? (
              <Skeleton className="!block w-full max-w-[100px]" />
            ) : (
              manufacturer
            )}
          </p>
        </div>
      )}

      <div className="font-openSans mb-[12px] flex min-w-0 gap-[8px] text-[14px]">
        <h4 className="text-desc shrink-0">{t(Filter.Industry)}:</h4>

        <div className="text-title min-w-0 flex-1">
          {isLoading ? (
            <Skeleton className="!block w-full max-w-[180px]" />
          ) : (
            industries.map((industry, index) => (
              <span key={industry.en}>
                {industry?.[language] || industry?.en}
                {index !== industries.length - 1 && ' | '}
              </span>
            ))
          )}
        </div>
      </div>

      <div className="font-openSans mb-[14px] flex min-w-0 gap-[8px] text-[14px]">
        <h4 className="text-desc shrink-0">{t(Filter.Condition)}:</h4>
        <p className="text-title min-w-0 flex-1">
          {isLoading ? (
            <Skeleton className="!block w-full max-w-[80px]" />
          ) : condition === 'new' ? (
            t(Filter.New)
          ) : (
            t(Filter.Used)
          )}
        </p>
      </div>

      <DecorativeLine intent="product" />

      <h4 className="font-openSans text-desc mb-[8px] text-[14px]">
        {t(Product.Description)}:
      </h4>

      <div className="font-openSans text-title mb-auto min-w-0 pb-[32px] text-[14px]">
        {isLoading ? (
          <div className="min-w-0">
            <Skeleton className="!mb-[6px] !block w-full" />
            <Skeleton className="!mb-[6px] !block w-full" />
            <Skeleton className="!block w-[70%]" />
          </div>
        ) : (
          <p>{description?.[language] || description?.en}</p>
        )}
      </div>

      {isLoading ? (
        <Skeleton className="!block w-full" height={40} borderRadius={32} />
      ) : deletionDate ? (
        <span className="text-secondary flex w-full items-center justify-center rounded-[32px] bg-red-900 py-[14px] text-[12px] font-semibold">
          Sold
        </span>
      ) : (
        <RequestPricingButton product={product} />
      )}
    </div>
  );
};

export default Details;