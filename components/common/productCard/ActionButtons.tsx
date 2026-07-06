'use client';

import { type FC } from 'react';
import Skeleton from 'react-loading-skeleton';

import type { IProduct } from '@interfaces/IProduct';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import useUpdateRequestedProducts from '@hooks/useUpdateRequestedProducts';

import { Button } from '@enums/i18nConstants';

import { AppLocale } from '@i18n/config';

interface IActionsButtonsProps {
  isLoading: boolean;
  product: IProduct;
  locale: AppLocale;
  categorySlug?: string;
  subcategorySlug?: string;
}

function isMongoObjectId(value: string) {
  return /^[0-9a-fA-F]{24}$/.test(value);
}

function normalizeSlug(value?: string | null) {
  if (typeof value !== 'string') {
    return undefined;
  }

  const slug = value.trim();

  if (!slug || isMongoObjectId(slug)) {
    return undefined;
  }

  return slug;
}

function buildProductHref({
  locale,
  categorySlug,
  subcategorySlug,
  productSlug,
}: {
  locale: AppLocale;
  categorySlug: string;
  subcategorySlug: string;
  productSlug: string;
}) {
  return `/${locale}/all-products/${encodeURIComponent(
    categorySlug
  )}/${encodeURIComponent(subcategorySlug)}/${encodeURIComponent(productSlug)}`;
}

const ActionsButtons: FC<IActionsButtonsProps> = ({
  isLoading,
  product,
  locale,
}) => {
  const t = useTranslations();

  const { isRequested, handleToggleFavorites } =
    useUpdateRequestedProducts(product);

  const productSlug = normalizeSlug(product.slug);
  const productCategorySlug = normalizeSlug(product.seoCategorySlug);
  const productSubcategorySlug = normalizeSlug(product.seoSubcategorySlug);

  const canOpenProduct =
    Boolean(productSlug) &&
    Boolean(productCategorySlug) &&
    Boolean(productSubcategorySlug);

  const productHref =
    canOpenProduct &&
    productSlug &&
    productCategorySlug &&
    productSubcategorySlug
      ? buildProductHref({
          locale,
          categorySlug: productCategorySlug,
          subcategorySlug: productSubcategorySlug,
          productSlug,
        })
      : undefined;

  return (
    <div className="mt-auto flex w-full gap-[8px] md:gap-[16px] lg:gap-[8px]">
      {!isLoading ? (
        <>
          {productHref ? (
            <Link
              href={productHref}
              className="border-primary font-inter text-primary hover:bg-primary hover:text-secondary flex h-[40px] w-full items-center justify-center rounded-[32px] border bg-transparent text-[12px] font-semibold transition-colors duration-500"
            >
              {t(Button.ViewDetails)}
            </Link>
          ) : (
            <button
              className="border-primary font-inter text-primary flex h-[40px] w-full cursor-not-allowed items-center justify-center rounded-[32px] border bg-transparent text-[12px] font-semibold opacity-50"
              type="button"
              disabled
            >
              {t(Button.ViewDetails)}
            </button>
          )}

          {!product.deletionDate && (
            <button
              className={clsx(
                'h-[40px] shrink-0 cursor-pointer rounded-[32px] px-[15px] text-[12px] font-semibold',
                isRequested
                  ? 'bg-secondary-accent text-secondary'
                  : 'bg-accent hover:shadow-accent transition-boxShadow shadow-none duration-250'
              )}
              onClick={() => handleToggleFavorites(product)}
              type="button"
            >
              {isRequested ? t(Button.AddedToQuote) : t(Button.RequestPricing)}
            </button>
          )}
        </>
      ) : (
        <>
          <Skeleton width={100} height={40} borderRadius={9999} />
          <Skeleton width={100} height={40} borderRadius={9999} />
        </>
      )}
    </div>
  );
};

export default ActionsButtons;
