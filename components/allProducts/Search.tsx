'use client';

import { type ChangeEvent, type FC, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';
import debounce from 'lodash/debounce';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import SvgIcon from '@components/common/SvgIcon';

import { cn } from '@utils/cn';

import { Placeholder } from '@enums/i18nConstants';
import { IconId } from '@enums/iconsSpriteId';

interface ISearchProps {
  className?: string;
}

const Search: FC<ISearchProps> = ({ className }) => {
  const  t  = useTranslations();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchKey = searchParams.toString();

  const isAdmin = pathname.includes('/admin/email-newsletter');

  const [inputValue, setInputValue] = useState(searchParams.get('title') ?? '');
  const [isEmptyValue, setIsEmptyValue] = useState<boolean>(
    searchParams.get('title') ? false : true
  );

  useEffect(() => {
    const title = searchParams.get('title') ?? '';
    setInputValue(title);
    setIsEmptyValue(title.length === 0);
  }, [searchKey, searchParams]);

  const pushTitleToUrl = (raw: string) => {
    const params = new URLSearchParams(searchKey);

    if (!raw.trim()) {
      params.delete('title');
    } else {
      params.set('title', raw.trim());

      params.delete('page');
    }

    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const handleInputText = useMemo(
    () =>
      debounce((e: ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;

        pushTitleToUrl(val);

        if (val) {
          setIsEmptyValue(false);
        } else {
          setIsEmptyValue(true);
        }
      }, 300),

    [pathname, searchKey]
  );

  useEffect(() => {
    return () => {
      handleInputText.cancel();
    };
  }, [handleInputText]);

  return (
    <label className={cn('mb-[22px] block w-full md:w-[264px]', className)}>
      <div className="relative">
        <input
          type="text"
          placeholder={t(Placeholder.SearchProduct)}
          value={inputValue}
          className={clsx(
            'font-openSans transition-border duration-primary focus:border-secondary-accent w-full rounded-[32px] border border-[rgba(102,102,102,0.22)] bg-transparent pr-[18px] pl-[16px] outline-none focus:border',
            isAdmin ? 'py-[12px] text-[14x]' : 'py-[10px] text-[12px]'
          )}
          onChange={e => setInputValue(e.target.value)}
          onInput={handleInputText}
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
            onClick={() => {
              setIsEmptyValue(true);
              setInputValue('');
              pushTitleToUrl('');
            }}
          >
            <SvgIcon
              className="fill-desc absolute right-[18px] bottom-[14px]"
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
