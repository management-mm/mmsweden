'use client';

import { type FC } from 'react';

import type { IProduct } from 'interfaces/IProduct';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import SvgIcon from '@components/common/SvgIcon';

import { useCurrentLocale } from '@hooks/useCurrentLocale';
import useUpdateRequestedProducts from '@hooks/useUpdateRequestedProducts';

import getProductName from '@utils/getProductName';

import { IconId } from '@enums/iconsSpriteId';

interface IItemsForQuoteProps {
  product: IProduct;
}

const ItemForQuote: FC<IItemsForQuoteProps> = ({
  product,
  product: { slug, photos, name, idNumber },
}) => {
  const router = useRouter();
  const language = useCurrentLocale();
  const { handleToggleFavorites } = useUpdateRequestedProducts(product);

  const goToDetails = () => {
    router.push(`/all-products/${slug}`);
  };

  return (
    <li className="relative flex px-[14px] py-[24px]">
      <button type="button" className="mr-[14px]" onClick={goToDetails}>
        <Image
          src={photos[0]}
          alt={getProductName(name, language)}
          width={97}
          height={73}
          className="rounded-[4px] object-cover"
          sizes="97px"
        />
      </button>

      <div>
        <h3 className="text-[16px] font-semibold">
          {getProductName(name, language)}
        </h3>
        <p className="text-primary text-[14px] font-medium">
          ID NR #<span>{idNumber}</span>
        </p>
      </div>

      <button
        className="absolute right-[14px] bottom-[14px]"
        type="button"
        onClick={() => handleToggleFavorites(product)}
      >
        <SvgIcon
          className="fill-primary"
          iconId={IconId.Trash}
          size={{ width: 22, height: 22 }}
        />
      </button>
    </li>
  );
};

export default ItemForQuote;
