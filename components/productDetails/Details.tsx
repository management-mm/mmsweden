'use client';

import { type FC } from 'react';

import clsx from 'clsx';
import type { IProduct } from 'interfaces/IProduct';
import { useTranslations } from 'next-intl';

import DecorativeLine from '@components/common/DecorativeLine';
import SvgIcon from '@components/common/SvgIcon';

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

  const { isRequested, handleToggleFavorites } =
    useUpdateRequestedProducts(product);

  return (
    <div className="bg-secondary flex min-h-[450px] w-full shrink-0 flex-col rounded-[4px] px-[14px] pt-[14px] pb-[32px] md:w-[300px] lg:w-[390px]">
      <h3 className="text-primary mb-[14px] text-[18px] font-semibold uppercase md:mb-[22px]">
        Id nr # <span>{idNumber}</span>
      </h3>

      <DecorativeLine intent="product" />

      <div className="font-openSans mb-[12px] flex gap-[8px] text-[14px]">
        <h4 className="text-desc">{t(Product.Dimensions)}:</h4>
        <p className="text-title">{dimensions}</p>
      </div>

      <div className="font-openSans mb-[12px] flex gap-[8px] text-[14px]">
        <h4 className="text-desc">{t(Filter.Category)}:</h4>
        <p className="text-title">{category[language]}</p>
      </div>

      {manufacturer && (
        <div className="font-openSans mb-[12px] flex gap-[8px] text-[14px]">
          <h4 className="text-desc">{t(Filter.Manufacturer)}:</h4>
          <p className="text-title">{manufacturer}</p>
        </div>
      )}

      <div className="font-openSans mb-[12px] gap-[8px] text-[14px]">
        <h4 className="text-desc inline">{t(Filter.Industry)}:</h4>

        {industries.map((industry, index) => (
          <span className="text-title" key={industry.en}>
            &nbsp;{industry[language]}
            {index !== industries.length - 1 && ' |'}
          </span>
        ))}
      </div>

      <div className="font-openSans mb-[14px] flex gap-[8px] text-[14px]">
        <h4 className="text-desc">{t(Filter.Condition)}:</h4>
        <p className="text-title">
          {condition === 'new' ? t(Filter.New) : t(Filter.Used)}
        </p>
      </div>

      <DecorativeLine intent="product" />

      <h4 className="font-openSans text-desc mb-[8px] text-[14px]">
        {t(Product.Description)}:
      </h4>

      <p className="font-openSans text-title mb-auto pb-[32px] text-[14px]">
        {description[language]}
      </p>

      {product.deletionDate ? (
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
  );
};

export default Details;
