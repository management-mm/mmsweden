'use client';

import Link from 'next/link';

import SvgIcon from '../SvgIcon';

import { clearProduct } from '@store/products/productsSlice';
import { useAppDispatch } from '@hooks/useAppDispatch';

import { IconId } from '@enums/iconsSpriteId';
import { AppLocale } from '@i18n/config';

interface Props {
  language: AppLocale;
  slug: string;
}

const AdminEditProductButton = ({ language, slug }: Props) => {
  const dispatch = useAppDispatch();

  const handleClear = () => {
    dispatch(clearProduct());
  };

  return (
    <Link
      href={`/${language}/admin/all-products/edit-product/${slug}`}
      onClick={handleClear}
      className="border-primary text-primary flex w-full items-center justify-center gap-[8px] rounded-[32px] border py-[10px] text-[12px] font-semibold"
    >
      <SvgIcon
        className="fill-primary"
        iconId={IconId.EditProduct}
        size={{ width: 16, height: 16 }}
      />
      Edit Product
    </Link>
  );
};

export default AdminEditProductButton;