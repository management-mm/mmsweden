import { type FC, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import type { IProduct } from 'interfaces/IProduct';

import { LanguageContext } from '@components/SharedLayout';
import SvgIcon from '@components/common/SvgIcon';

import useUpdateRequestedProducts from '@hooks/useUpdateRequestedProducts';

import getProductName from '@utils/getProductName';

import { IconId } from '@enums/iconsSpriteId';

interface IItemsForQuoteProps {
  product: IProduct;
}

const ItemForQuote: FC<IItemsForQuoteProps> = ({
  product,
  product: { _id, photos, name, idNumber },
}) => {
  const { language } = useContext(LanguageContext);
  const { handleToggleFavorites } = useUpdateRequestedProducts(product);
  const navigate = useNavigate();

  const goToDetails = () => {
    navigate(`/all-products/${_id}`);
  };
  return (
    <li className="relative flex px-[14px] py-[24px]">
      <button type="button" className="mr-[14px]" onClick={goToDetails}>
        <img
          className="rounded-[4px]"
          src={photos[0]}
          alt={getProductName(name, language)}
          width={97}
        />
      </button>
      <div>
        <h3 className="text-[16px] font-semibold">
          {getProductName(name, language)}
        </h3>
        <p className="text-[14px] font-medium text-primary">
          ID NR #<span>{idNumber}</span>
        </p>
      </div>
      <button
        className="absolute bottom-[14px] right-[14px]"
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
