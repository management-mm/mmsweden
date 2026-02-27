'use client';

import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';

import type { IProduct } from '@interfaces/IProduct';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';

import useUpdateRequestedProducts from '@hooks/useUpdateRequestedProducts';

import { Button } from '@enums/i18nConstants';

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
    router.push(`/all-products/${product._id}`);
  };

  return (
    <div className="mt-auto flex w-full gap-[8px] md:gap-[16px] lg:gap-[8px]">
      {!isLoading ? (
        <>
          <button
            className="border-primary font-inter text-primary hover:bg-primary hover:text-secondary h-[40px] w-[100%] rounded-[32px] border bg-transparent py-0 text-center text-[12px] leading-tight font-semibold transition-colors duration-500 md:w-[calc((100%-16px)/2)] lg:w-full"
            onClick={goToDetails}
            type="button"
          >
            {t(Button.ViewDetails)}
          </button>

          {!product.deletionDate && (
            <button
              className={clsx(
                'text-primary h-[40px] shrink-0 rounded-[32px] px-[15px] text-[12px] font-semibold md:w-[calc((100%-16px)/2)] lg:w-auto',
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
