'use client';

import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';

import type { IProduct } from '@interfaces/IProduct';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import slugify from 'slugify';

import useUpdateRequestedProducts from '@hooks/useUpdateRequestedProducts';

import { generateProductSlug } from '@utils/generateProductSlug';
import getProductName from '@utils/getProductName';

import { Button } from '@enums/i18nConstants';
import { LanguageKeys } from '@enums/languageKeys';

interface IActionsButtonsProps {
  isLoading: boolean;
  product: IProduct;
}

const ActionsButtons: FC<IActionsButtonsProps> = ({ isLoading, product }) => {
  const { t } = useTranslation();
  const router = useRouter();

  const { isRequested, handleToggleFavorites } =
    useUpdateRequestedProducts(product);

  const goToDetails = () => {
    const slug = generateProductSlug(product);

    router.push(`all-products/${slug}`);
  };

  return (
    <div className="mt-auto flex w-full gap-[8px] md:gap-[16px] lg:gap-[8px]">
      {!isLoading ? (
        <>
          <button
            className="border-primary font-inter text-primary hover:bg-primary hover:text-secondary h-[40px] w-full rounded-[32px] border bg-transparent text-[12px] font-semibold transition-colors duration-500"
            onClick={goToDetails}
            type="button"
          >
            {t(Button.ViewDetails)}
          </button>

          {!product.deletionDate && (
            <button
              className={clsx(
                'text-primary h-[40px] shrink-0 rounded-[32px] px-[15px] text-[12px] font-semibold',
                isRequested ? 'bg-secondary-accent text-secondary' : 'bg-accent'
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
          <Skeleton width={100} height={30} />
          <Skeleton width={100} height={30} />
        </>
      )}
    </div>
  );
};

export default ActionsButtons;
