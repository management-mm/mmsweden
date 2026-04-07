'use client';

import { useTranslations } from 'next-intl';

import ProductsListMenu from './ProductsListMenu';

import SvgIcon from '@components/common/SvgIcon';

import { Placeholder } from '@enums/i18nConstants';
import { IconId } from '@enums/iconsSpriteId';

type HeaderSearchProps = {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onSearchClick?: () => void;
  wrapperClassName?: string;
  inputClassName?: string;
  buttonClassName?: string;
  productsMenuClassName?: string;
};

export default function HeaderSearch({
  value,
  onChange,
  onFocus,
  onSearchClick,
  wrapperClassName = '',
  inputClassName = '',
  buttonClassName = '',
  productsMenuClassName = '',
}: HeaderSearchProps) {
  const t = useTranslations();

  return (
    <div className={wrapperClassName}>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={onFocus}
        placeholder={t(Placeholder.Search)}
        className={inputClassName}
      />

      <button
        type="button"
        aria-label="Search"
        onClick={onSearchClick}
        className={buttonClassName}
      >
        <SvgIcon
          iconId={IconId.Search}
          size={{ width: 16, height: 16 }}
          className="fill-secondary"
        />
      </button>

      <div>
        <ProductsListMenu className={productsMenuClassName} />
      </div>
    </div>
  );
}
