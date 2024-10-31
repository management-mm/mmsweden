import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';

import clsx from 'clsx';

import useUpdateRequestedProducts from '@hooks/useUpdateRequestedProducts';

import { Button } from '@enums/i18nConstants';
import type { IProduct } from '@interfaces/IProduct';

interface IActionsButtonsProps {
  isLoading: boolean;
  product: IProduct
}

const ActionsButtons:FC<IActionsButtonsProps> = ({ isLoading, product }) => {
  const { t } = useTranslation();
  const { isRequested, handleToggleFavorites } =
    useUpdateRequestedProducts(product);

  const navigate = useNavigate();

  const goToDetails = () => {
    navigate(`/all-products/${product._id}`);
  };

  return (
    <div className="mt-auto flex w-full gap-[8px] md:gap-[16px] lg:gap-[8px]">
      {!isLoading ? (
        <>
          <button
            className="h-[40px] w-[100%] rounded-[32px] border border-primary bg-transparent py-0 text-center font-inter text-[12px] font-semibold leading-tight text-primary transition-colors duration-500 hover:bg-primary hover:text-secondary md:w-[calc((100%-16px)/2)] lg:w-full"
            onClick={goToDetails}
          >
            {t(Button.ViewDetails)}
          </button>
          <button
            className={clsx(
              'h-[40px] shrink-0 rounded-[32px] px-[15px] text-[12px] font-semibold text-primary md:w-[calc((100%-16px)/2)] lg:w-auto',
              isRequested ? 'bg-secondaryAccent text-secondary' : 'bg-accent'
            )}
            onClick={() => handleToggleFavorites(product)}
          >
            {isRequested ? t(Button.AddedToQuote) : t(Button.RequestPricing)}
          </button>
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
