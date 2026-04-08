'use client';

import { useEffect, useRef, useState } from 'react';

import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

import ProductsListMenu from './ProductsListMenu';

import SvgIcon from '@components/common/SvgIcon';

import useOutsideAlerter from '@hooks/useOutsideAlerter';

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

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const menuRef = useOutsideAlerter(() => setIsMenuOpen(false), isMenuOpen, [
    inputRef,
    buttonRef,
  ]);
  const pathname = usePathname();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleFocus = () => {
    setIsMenuOpen(true);
    onFocus?.();
  };

  const handleChange = (newValue: string) => {
    onChange(newValue);
    setIsMenuOpen(true);
  };

  return (
    <div className={wrapperClassName}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={e => handleChange(e.target.value)}
        onFocus={handleFocus}
        placeholder={t(Placeholder.Search)}
        className={inputClassName}
      />

      <button
        ref={buttonRef}
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

      {isMenuOpen && (
        <div ref={menuRef}>
          <ProductsListMenu className={productsMenuClassName} />
        </div>
      )}
    </div>
  );
}
