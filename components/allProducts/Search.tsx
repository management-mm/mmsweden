'use client';

import { type FC, useEffect, useMemo, useRef, useState } from 'react';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import SvgIcon from '@components/common/SvgIcon';

import { cn } from '@utils/cn';

import { Placeholder } from '@enums/i18nConstants';
import { IconId } from '@enums/iconsSpriteId';

interface ISearchProps {
  className?: string;
}

const Search: FC<ISearchProps> = ({ className }) => {
  const t = useTranslations();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const searchParamsString = useMemo(
    () => searchParams.toString(),
    [searchParams]
  );

  const titleFromUrl = searchParams.get('title') ?? '';
  const isAdmin = pathname.includes('/admin/email-newsletter');

  const [inputValue, setInputValue] = useState(titleFromUrl);
  const isUpdatingFromInputRef = useRef(false);

  useEffect(() => {
    if (!isUpdatingFromInputRef.current) {
      setInputValue(titleFromUrl);
    }

    isUpdatingFromInputRef.current = false;
  }, [titleFromUrl]);

  useEffect(() => {
    const trimmedValue = inputValue.trim();

    const timeout = setTimeout(() => {
      if (trimmedValue === titleFromUrl) return;

      const params = new URLSearchParams(searchParamsString);
      params.delete('page');

      if (trimmedValue) {
        params.set('title', trimmedValue);
      } else {
        params.delete('title');
      }

      isUpdatingFromInputRef.current = true;

      const qs = params.toString();
      const nextUrl = qs ? `${pathname}?${qs}` : pathname;

      router.replace(nextUrl, { scroll: false });
    }, 300);

    return () => clearTimeout(timeout);
  }, [inputValue, pathname, router, searchParamsString, titleFromUrl]);

  const isEmptyValue = inputValue.trim().length === 0;

  const handleReset = () => {
    setInputValue('');
  };

  return (
    <label className={cn('mb-[22px] block w-full md:w-[264px]', className)}>
      <div className="relative">
        <input
          type="text"
          placeholder={t(Placeholder.Search)}
          value={inputValue}
          className={clsx(
            'font-openSans transition-border duration-primary focus:border-secondary-accent w-full rounded-[32px] border border-[rgba(102,102,102,0.22)] bg-transparent pr-[18px] pl-[16px] outline-none focus:border',
            isAdmin ? 'py-[12px] text-[14px]' : 'py-[10px] text-[12px]'
          )}
          onChange={e => setInputValue(e.target.value)}
        />

        <button
          type="button"
          onClick={handleReset}
          disabled={isEmptyValue}
          aria-label={isEmptyValue ? 'Search icon' : 'Reset search'}
          className={clsx(
            'absolute right-[18px] flex items-center justify-center',
            isAdmin ? 'bottom-[16px]' : 'bottom-[14px]',
            isEmptyValue ? 'pointer-events-none' : ''
          )}
        >
          <SvgIcon
            className="fill-desc"
            iconId={isEmptyValue ? IconId.Search : IconId.Reset}
            size={{
              width: isEmptyValue ? (isAdmin ? 16 : 14) : 12,
              height: isEmptyValue ? (isAdmin ? 16 : 14) : 12,
            }}
          />
        </button>
      </div>
    </label>
  );
};

export default Search;
