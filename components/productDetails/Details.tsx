import type { FC } from 'react';
import Skeleton from 'react-loading-skeleton';

import type { IProduct } from '@interfaces/IProduct';
import { useTranslations } from 'next-intl';

import RequestPricingButton from './RequestPricingButton';

import DecorativeLine from '@components/common/DecorativeLine';

import { Filter, Product, Title } from '@enums/i18nConstants';

import { AppLocale } from '@i18n/config';

interface IDetailsProps {
  product: IProduct;
  language: AppLocale;
  isLoading: boolean;
}

const Details: FC<IDetailsProps> = ({ product, language, isLoading }) => {
  const t = useTranslations();

  const {
    idNumber,
    description,
    productCategory,
    manufacturer,
    industries,
    condition,
    dimensions,
    deletionDate,
  } = product;

  return (
    <section className="bg-secondary flex min-h-[450px] w-full min-w-0 shrink-0 flex-col overflow-hidden rounded-[4px] px-[14px] pt-[14px] pb-[32px] md:w-[300px] lg:w-[390px]">
      <p className="text-primary mb-[14px] text-[18px] font-semibold uppercase md:mb-[22px]">
        {isLoading ? (
          <Skeleton className="!block max-w-[120px]" />
        ) : (
          <>
            Id nr # <span>{idNumber}</span>
          </>
        )}
      </p>

      <DecorativeLine intent="product" />
      <h2 className="font-openSans text-desc mb-[8px] text-[14px]">
        {t(Product.Description)}
      </h2>

      <div className="font-openSans text-title min-w-0 pb-[24px] text-[14px]">
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

      <DecorativeLine intent="product" />

      <dl className="mb-auto min-w-0 pb-[32px]">
        <div className="font-openSans mb-[12px] flex min-w-0 gap-[8px] text-[14px]">
          <dt className="text-desc shrink-0">{t(Product.Dimensions)}:</dt>
          <dd className="text-title min-w-0 flex-1">
            {isLoading ? (
              <Skeleton className="!block w-full max-w-[120px]" />
            ) : (
              dimensions
            )}
          </dd>
        </div>

        <div className="font-openSans mb-[12px] flex min-w-0 gap-[8px] text-[14px]">
          <dt className="text-desc shrink-0">{t(Filter.Category)}:</dt>
          <dd className="text-title min-w-0 flex-1">
            {isLoading ? (
              <Skeleton className="!block w-full max-w-[100px]" />
            ) : (
              productCategory?.[language] || productCategory?.en
            )}
          </dd>
        </div>

        {manufacturer && (
          <div className="font-openSans mb-[12px] flex min-w-0 gap-[8px] text-[14px]">
            <dt className="text-desc shrink-0">{t(Filter.Manufacturer)}:</dt>
            <dd className="text-title min-w-0 flex-1">
              {isLoading ? (
                <Skeleton className="!block w-full max-w-[100px]" />
              ) : (
                manufacturer
              )}
            </dd>
          </div>
        )}

        <div className="font-openSans mb-[12px] flex min-w-0 gap-[8px] text-[14px]">
          <dt className="text-desc shrink-0">{t(Filter.Industry)}:</dt>
          <dd className="text-title min-w-0 flex-1">
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
          </dd>
        </div>

        <div className="font-openSans mb-[14px] flex min-w-0 gap-[8px] text-[14px]">
          <dt className="text-desc shrink-0">{t(Filter.Condition)}:</dt>
          <dd className="text-title min-w-0 flex-1">
            {isLoading ? (
              <Skeleton className="!block w-full max-w-[80px]" />
            ) : condition === 'new' ? (
              t(Filter.New)
            ) : (
              t(Filter.Used)
            )}
          </dd>
        </div>
      </dl>

      {isLoading ? (
        <Skeleton className="!block w-full" height={40} borderRadius={32} />
      ) : deletionDate ? (
        <span className="text-secondary flex w-full items-center justify-center rounded-[32px] bg-red-900 py-[14px] text-[12px] font-semibold">
          Sold
        </span>
      ) : (
        <RequestPricingButton product={product} />
      )}
    </section>
  );
};

export default Details;
