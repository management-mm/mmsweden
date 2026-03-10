'use client';

import { type FC, useEffect, useMemo, useState } from 'react';

import debounce from 'lodash/debounce';
import { useTranslations } from 'next-intl';

import SvgIcon from '@components/common/SvgIcon';

import { Placeholder } from '@enums/i18nConstants';
import { IconId } from '@enums/iconsSpriteId';

interface ISearchFilterProps {
  keyword: string;
  setKeyword: (value: string) => void;
}

const SearchFilter: FC<ISearchFilterProps> = ({ keyword, setKeyword }) => {
  const t = useTranslations();
  const [isEmptyValue, setIsEmptyValue] = useState(true);

  const [inputValue, setInputValue] = useState(keyword);

  useEffect(() => {
    setInputValue(keyword);
    setIsEmptyValue(keyword.trim().length === 0);
  }, [keyword]);

  const debouncedSetKeyword = useMemo(
    () =>
      debounce((value: string) => {
        setKeyword(value);
      }, 300),
    [setKeyword]
  );

  useEffect(() => {
    return () => {
      debouncedSetKeyword.cancel();
    };
  }, [debouncedSetKeyword]);

  return (
    <div className="relative mb-[12px]">
      <input
        type="text"
        placeholder={t(Placeholder.Search)}
        className="border-neutral transition-border duration-primary focus:border-secondary-accent w-full rounded-[32px] border px-[22px] py-[8px] pl-[14px] text-[12px] outline-none focus:border"
        value={inputValue}
        onChange={e => {
          const value = e.target.value;
          setInputValue(value);
          setIsEmptyValue(value.trim().length === 0);
          debouncedSetKeyword(value);
        }}
      />

      {isEmptyValue ? (
        <SvgIcon
          className="fill-desc absolute right-[18px] bottom-[12px]"
          iconId={IconId.Search}
          size={{ width: 14, height: 14 }}
        />
      ) : (
        <button
          type="button"
          onClick={() => {
            setInputValue('');
            setIsEmptyValue(true);
            debouncedSetKeyword.cancel();
            setKeyword('');
          }}
        >
          <SvgIcon
            className="fill-desc absolute right-[18px] bottom-[12px]"
            iconId={IconId.Reset}
            size={{ width: 12, height: 12 }}
          />
        </button>
      )}
    </div>
  );
};

export default SearchFilter;
