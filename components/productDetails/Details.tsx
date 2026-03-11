'use client';

import { type FC } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import clsx from 'clsx';
import type { IProduct } from 'interfaces/IProduct';
import { useTranslations } from 'next-intl';

import DecorativeLine from '@components/common/DecorativeLine';
import SvgIcon from '@components/common/SvgIcon';

import { selectIsLoading } from '@store/selectors';

import { useAppSelector } from '@hooks/useAppSelector';
import { useCurrentLocale } from '@hooks/useCurrentLocale';
import useUpdateRequestedProducts from '@hooks/useUpdateRequestedProducts';

import { Button, Filter, Product } from '@enums/i18nConstants';
import { IconId } from '@enums/iconsSpriteId';

interface IDetailsProps {
  product: IProduct;
}

const Details: FC<IDetailsProps> = ({
  product,
  product: {
    idNumber,
    description,
    category,
    manufacturer,
    industries,
    condition,
    dimensions,
  },
}) => {
  const t = useTranslations();
  const language = useCurrentLocale();
  const isLoading = useAppSelector(selectIsLoading);
  const { isRequested, handleToggleFavorites } =
    useUpdateRequestedProducts(product);

  return (
    <SkeletonTheme baseColor="#E1E1E1" highlightColor="#F2F2F2">
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
              category[language]
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
                  {industry[language]}
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
            <p>{description[language]}</p>
          )}
        </div>

        {isLoading ? (
          <Skeleton className="!block w-full" height={40} borderRadius={32} />
        ) : product.deletionDate ? (
          <span className="text-secondary flex w-full items-center justify-center rounded-[32px] bg-red-900 py-[14px] text-[12px] font-semibold">
            Sold
          </span>
        ) : (
          <button
            className={clsx(
              'text-primary flex w-full items-center justify-center rounded-[32px] py-[14px] text-[12px] font-semibold',
              isRequested
                ? 'bg-secondary-accent text-secondary'
                : 'bg-accent shadow-accent'
            )}
            type="button"
            onClick={() => handleToggleFavorites(product)}
          >
            <SvgIcon
              className={clsx(
                'mr-[12px]',
                isRequested ? 'fill-secondary' : 'fill-primary'
              )}
              iconId={IconId.Cart}
              size={{ width: 16, height: 16 }}
            />
            {isRequested ? t(Button.AddedToQuote) : t(Button.RequestPricing)}
          </button>
        )}
      </div>
    </SkeletonTheme>
  );
};

export default Details;
