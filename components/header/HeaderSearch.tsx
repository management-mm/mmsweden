'use client';

import { useEffect, useRef, useState } from 'react';

import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

import SvgIcon from '@components/common/SvgIcon';

import useOutsideAlerter from '@hooks/useOutsideAlerter';

import { Placeholder } from '@enums/i18nConstants';
import { IconId } from '@enums/iconsSpriteId';

const ProductsListMenu = dynamic(() => import('./ProductsListMenu'), {
  ssr: false,
});

type HeaderSearchProps = {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
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
  onBlur,
  onSearchClick,
  wrapperClassName = '',
  inputClassName = '',
  buttonClassName = '',
  productsMenuClassName = '',
}: HeaderSearchProps) {
  const t = useTranslations();
  const pathname = usePathname();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const menuRef = useOutsideAlerter(() => setIsMenuOpen(false), isMenuOpen, [
    inputRef,
    buttonRef,
  ]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleFocus = () => {
    if (value.trim()) {
      setIsMenuOpen(true);
    }
    onFocus?.();
  };

  const handleBlur = () => {
    onBlur?.();
  };

  const handleChange = (newValue: string) => {
    onChange(newValue);
    setIsMenuOpen(Boolean(newValue.trim()));
  };

  const handleSearchClick = () => {
    onSearchClick?.();
    setIsMenuOpen(Boolean(value.trim()));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearchClick?.();
      setIsMenuOpen(Boolean(value.trim()));
      return;
    }

    if (event.key === 'Escape') {
      setIsMenuOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className={wrapperClassName}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={e => handleChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={t(Placeholder.Search)}
        className={inputClassName}
      />

      <button
        ref={buttonRef}
        type="button"
        aria-label="Search"
        onClick={handleSearchClick}
        className={buttonClassName}
      >
        <SvgIcon
          iconId={IconId.Search}
          size={{ width: 16, height: 16 }}
          className="fill-secondary"
        />
      </button>

      {isMenuOpen && value.trim().length > 0 && (
        <div ref={menuRef}>
          <ProductsListMenu className={productsMenuClassName} />
        </div>
      )}
    </div>
  );
}
