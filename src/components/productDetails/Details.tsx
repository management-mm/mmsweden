import { type FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import clsx from 'clsx';
import type { IProduct } from 'interfaces/IProduct';

import { LanguageContext } from '@components/SharedLayout';
import DecorativeLine from '@components/common/DecorativeLine';
import SvgIcon from '@components/common/SvgIcon';

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
  const { t } = useTranslation();
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('LanguageContext must be used within a LanguageProvider');
  }

  const { language } = context;

  const { isRequested, handleToggleFavorites } =
    useUpdateRequestedProducts(product);

  return (
    <div className="flex min-h-[450px] w-full shrink-0 flex-col rounded-[4px] bg-secondary px-[14px] pb-[32px] pt-[14px] md:w-[300px] lg:w-[390px]">
      <h3 className="mb-[14px] text-[18px] font-semibold uppercase text-primary md:mb-[22px]">
        Id nr # <span>{idNumber}</span>
      </h3>
      <DecorativeLine intent="product" />
      <div className="mb-[12px] flex gap-[8px] font-openSans text-[14px]">
        <h4 className="text-desc">{t(Product.Dimensions)}:</h4>
        <p className="text-title">{dimensions}</p>
      </div>
      <div className="mb-[12px] flex gap-[8px] font-openSans text-[14px]">
        <h4 className="text-desc">{t(Filter.Category)}:</h4>
        <p className="text-title">{category[language]}</p>
      </div>
      {manufacturer && (
        <div className="mb-[12px] flex gap-[8px] font-openSans text-[14px]">
        <h4 className="text-desc">{t(Filter.Manufacturer)}:</h4>
        <p className="text-title">{manufacturer}</p>
      </div>
      )}
      
      <div className="mb-[12px] gap-[8px] font-openSans text-[14px]">
        <h4 className="inline text-desc">{t(Filter.Industry)}:</h4>

        {industries.map((industry, index) => (
          <span className="text-title" key={industry.en}>
            &nbsp;{industry[language]}
            {index !== industries.length - 1 && ' |'}
          </span>
        ))}
      </div>

      <div className="mb-[14px] flex gap-[8px] font-openSans text-[14px]">
        <h4 className="text-desc">{t(Filter.Condition)}:</h4>
        <p className="text-title">
          {condition === 'new' ? t(Filter.New) : t(Filter.Used)}
        </p>
      </div>

      <DecorativeLine intent="product" />

      <h4 className="mb-[8px] font-openSans text-[14px] text-desc">
        {t(Product.Description)}:
      </h4>
      <p className="mb-auto pb-[32px] font-openSans text-[14px] text-title">
        {description[language]}
      </p>
      {product.deletionDate ? (
        <span className="flex w-full items-center justify-center rounded-[32px] bg-red-900 py-[14px] text-[12px] font-semibold text-secondary">
          Sold
        </span>
      ) : (
        <button
          className={clsx(
            'flex w-full items-center justify-center rounded-[32px] py-[14px] text-[12px] font-semibold text-primary',
            isRequested
              ? 'bg-secondaryAccent text-secondary'
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
          {isRequested ? t(Button.AddedToQuote) : t(Button.RequestQuote)}
        </button>
      )}
    </div>
  );
};

export default Details;
