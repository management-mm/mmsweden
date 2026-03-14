'use client';

import type { IProduct } from '@interfaces/IProduct';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

import SvgIcon from '@components/common/SvgIcon';

import useUpdateRequestedProducts from '@hooks/useUpdateRequestedProducts';

import { Button } from '@enums/i18nConstants';
import { IconId } from '@enums/iconsSpriteId';

interface Props {
  product: IProduct;
}

export default function RequestPricingButton({ product }: Props) {
  const t = useTranslations();
  const { isRequested, handleToggleFavorites } =
    useUpdateRequestedProducts(product);

  return (
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
  );
}
