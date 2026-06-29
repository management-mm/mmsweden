'use client';

import { useEffect, useRef, useState } from 'react';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

import SvgIcon from '@components/common/SvgIcon';

import { IconId } from '@enums/iconsSpriteId';

import languageOptions, {
  type ILanguageOption,
} from '@constants/languageOptions';

import {
  type AppLocale,
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  isAppLocale,
} from '@i18n/config';

const supportedLanguageOptions = languageOptions.filter(option =>
  SUPPORTED_LOCALES.includes(option.language as AppLocale)
);

const getOptionLabel = (option: ILanguageOption) => {
  if (
    'label' in option &&
    typeof option.label === 'string' &&
    option.label.trim()
  ) {
    return option.label;
  }

  return option.language.toUpperCase();
};

const getLocalizedPathname = (pathname: string, newLocale: AppLocale) => {
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) {
    return `/${newLocale}`;
  }

  if (isAppLocale(segments[0])) {
    return `/${[newLocale, ...segments.slice(1)].join('/')}`;
  }

  return `/${[newLocale, ...segments].join('/')}`;
};

const buildLocalizedHref = (
  pathname: string,
  searchParams: URLSearchParams,
  locale: AppLocale
) => {
  const nextPathname = getLocalizedPathname(pathname, locale);
  const queryString = searchParams.toString();

  return queryString ? `${nextPathname}?${queryString}` : nextPathname;
};

const LanguageSelect = () => {
  const [isOpen, setIsOpen] = useState(false);

  const rootRef = useRef<HTMLDivElement | null>(null);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const firstSegment = pathname.split('/')[1];

  const currentLocale = isAppLocale(firstSegment)
    ? firstSegment
    : DEFAULT_LOCALE;

  const segments = pathname.split('/').filter(Boolean);

  const isAdmin =
    segments.length > 0 &&
    (isAppLocale(segments[0])
      ? segments[1] === 'admin'
      : segments[0] === 'admin');

  const currentValue =
    supportedLanguageOptions.find(
      option => option.language === currentLocale
    ) ?? supportedLanguageOptions[0];

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current) return;

      if (!rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!currentValue) return null;

  const triggerTextColor = isAdmin
    ? 'text-primary'
    : 'text-primary lg:text-secondary';

  const triggerIconFill = isAdmin
    ? 'fill-primary'
    : 'fill-primary lg:fill-secondary';

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select language"
        onClick={() => setIsOpen(prev => !prev)}
        className={clsx(
          'relative flex min-w-[88px] items-center justify-center gap-2 rounded-[4px] px-2 py-1 text-[12px] font-medium uppercase transition hover:opacity-80',
          triggerTextColor
        )}
      >
        <SvgIcon
          iconId={currentValue.iconId}
          size={{ width: 20, height: 20 }}
          className={triggerIconFill}
        />

        <span>{getOptionLabel(currentValue)}</span>

        <span className={clsx('transition-transform', isOpen && 'rotate-180')}>
          <SvgIcon
            iconId={IconId.ArrowDown}
            size={{ width: 10, height: 10 }}
            className={triggerIconFill}
          />
        </span>
      </button>

      <div
        className={clsx(
          'bg-main absolute right-0 z-20 mt-2 min-w-[70px] rounded-[4px] p-[8px] shadow-lg transition',
          isOpen
            ? 'visible opacity-100'
            : 'pointer-events-none invisible opacity-0'
        )}
      >
        <ul className="flex flex-col gap-[2px]" role="listbox">
          {supportedLanguageOptions.map(option => {
            const optionLocale = option.language as AppLocale;
            const isSelected = optionLocale === currentLocale;

            const href = buildLocalizedHref(
              pathname,
              new URLSearchParams(searchParams.toString()),
              optionLocale
            );

            return (
              <li
                key={option.language}
                role="option"
                aria-selected={isSelected}
              >
                <Link
                  href={href}
                  hrefLang={optionLocale}
                  locale={false}
                  aria-current={isSelected ? 'page' : undefined}
                  onClick={() => setIsOpen(false)}
                  className={clsx(
                    'flex w-full items-center gap-2 rounded-[4px] px-3 py-[8px] text-left text-[12px] font-medium uppercase transition',
                    isSelected
                      ? 'bg-primary text-secondary'
                      : 'text-primary hover:bg-gray-100 active:bg-gray-200'
                  )}
                >
                  <SvgIcon
                    iconId={option.iconId}
                    size={{ width: 20, height: 20 }}
                    className="fill-primary"
                  />

                  <span>{getOptionLabel(option)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default LanguageSelect;
