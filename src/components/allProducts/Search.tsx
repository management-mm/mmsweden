import { type ChangeEvent, type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import clsx from 'clsx';
import * as _ from 'lodash';

import SvgIcon from '@components/common/SvgIcon';

import { cn } from '@utils/cn';

import { Placeholder } from '@enums/i18nConstants';
import { IconId } from '@enums/iconsSpriteId';

interface ISearchProps {
  className?: string;
}

const Search: FC<ISearchProps> = ({ className }) => {
  const { t } = useTranslation();
  const isAdmin = window.location.pathname.includes('admin/email-newsletter');
  const [searchParams, setSearchParams] = useSearchParams();
  const [inputValue, setInputValue] = useState(searchParams.get('title') ?? '');
  const [isEmptyValue, setIsEmptyValue] = useState<boolean>(
    searchParams.get('title') ? false : true
  );

  const handleInputText = _.debounce((e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchParams(searchParams => {
      if (e.target.value === '') {
        searchParams.delete('title');
      } else {
        searchParams.set('title', e.target.value.trim());
      }
      return searchParams;
    });

    if (e.target.value) {
      setIsEmptyValue(false);
      return;
    }
    setIsEmptyValue(true);
  });

  return (
    <label className={cn('mb-[22px] block w-full md:w-[264px]', className)}>
      <div className="relative">
        <input
          type="text"
          placeholder={t(Placeholder.SearchProduct)}
          value={inputValue}
          className={clsx(
            'w-full rounded-[32px] border border-[rgba(102,102,102,0.22)] bg-transparent pl-[16px] pr-[18px] font-openSans outline-none transition-border duration-primary focus:border focus:border-secondaryAccent',
            isAdmin ? 'py-[12px] text-[14x]' : 'py-[10px] text-[12px]'
          )}
          // defaultValue={searchParams.get('title') ?? ''}
          onChange={e => setInputValue(e.target.value)}
          onInput={handleInputText}
        />
        {isEmptyValue ? (
          <SvgIcon
            className={clsx(
              'absolute right-[18px] fill-desc',
              isAdmin ? 'bottom-[16px]' : 'bottom-[14px]'
            )}
            iconId={IconId.Search}
            size={{ width: isAdmin ? 16 : 14, height: isAdmin ? 16 : 14 }}
          />
        ) : (
          <button
            type="reset"
            onClick={() => {
              setIsEmptyValue(true);
              setInputValue('');
              setSearchParams(searchParams => {
                searchParams.delete('title');
                return searchParams;
              });
            }}
          >
            <SvgIcon
              className="absolute bottom-[14px] right-[18px] fill-desc"
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
