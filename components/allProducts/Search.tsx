'use client';

import { type FC, useEffect, useRef, useState } from 'react';

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

  const titleFromUrl = searchParams.get('title') ?? '';
  const isAdmin = pathname.includes('/admin/email-newsletter');

  const [inputValue, setInputValue] = useState(titleFromUrl);

  const lastSubmittedValueRef = useRef(titleFromUrl);

  useEffect(() => {
    if (titleFromUrl !== lastSubmittedValueRef.current) {
      setInputValue(titleFromUrl);
    }
  }, [titleFromUrl]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const trimmedValue = inputValue.trim();

      if (trimmedValue === titleFromUrl) return;

      const params = new URLSearchParams(searchParams.toString());
      params.delete('page');

      if (trimmedValue) {
        params.set('title', trimmedValue);
      } else {
        params.delete('title');
      }

      lastSubmittedValueRef.current = trimmedValue;

      const qs = params.toString();
      const nextUrl = qs ? `${pathname}?${qs}` : pathname;

      router.replace(nextUrl, { scroll: false });
    }, 300);

    return () => clearTimeout(timeout);
  }, [inputValue, pathname, router, searchParams, titleFromUrl]);

  const isEmptyValue = inputValue.trim().length === 0;

  const handleReset = () => {
    lastSubmittedValueRef.current = '';
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

        {isEmptyValue ? (
          <SvgIcon
            className={clsx(
              'fill-desc absolute right-[18px]',
              isAdmin ? 'bottom-[16px]' : 'bottom-[14px]'
            )}
            iconId={IconId.Search}
            size={{ width: isAdmin ? 16 : 14, height: isAdmin ? 16 : 14 }}
          />
        ) : (
          <button
            type="button"
            onClick={handleReset}
            className={clsx(
              'absolute right-[18px]',
              isAdmin ? 'bottom-[16px]' : 'bottom-[14px]'
            )}
            aria-label="Reset search"
          >
            <SvgIcon
              className="fill-desc"
              iconId={IconId.Reset}
              size={{ width: 12, height: 12 }}
            />
          </button>
        )}
      </div>
    </label>
  );
};

export default Search;
