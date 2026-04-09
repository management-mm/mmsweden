'use client';

import { useMemo, useState } from 'react';
import Select from 'react-select';

import clsx from 'clsx';
import { usePathname, useRouter } from 'next/navigation';

import DropdownIndicator from '@components/common/languageSelector/DropdownIndicator';
import CustomOption from '@components/common/languageSelector/Option';
import CustomSingleValue from '@components/common/languageSelector/SingleValue';

import languageOptions, {
  type ILanguageOption,
} from '@constants/languageOptions';

import {
  type AppLocale,
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  isAppLocale,
} from '@i18n/config';

const optionStyles = {
  base: 'hover:cursor-pointer w-[calc((100%-4px)/2)] py-[7px]',
  focus: 'lg:bg-gray-100 lg:active:bg-gray-200',
  selected: '',
};

const menuStyles = 'bg-main rounded-[4px] py-[8px] pl-[12px]';
const singleValueStyles = 'mr-[6px]';

const LanguageSelect = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const currentLocale = useMemo<AppLocale>(() => {
    const firstSegment = pathname.split('/')[1];
    return isAppLocale(firstSegment) ? firstSegment : DEFAULT_LOCALE;
  }, [pathname]);

  const options = useMemo<ILanguageOption[]>(() => {
    return languageOptions.filter(option =>
      SUPPORTED_LOCALES.includes(option.language as AppLocale)
    );
  }, []);

  const currentValue =
    options.find(option => option.language === currentLocale) ?? options[0];

  const handleChange = (selectedOption: ILanguageOption | null) => {
    if (!selectedOption) return;

    const newLocale = selectedOption.language;

    if (newLocale === currentLocale) return;

    const segments = pathname.split('/');
    segments[1] = newLocale;

    const newPath = segments.join('/') || `/${newLocale}`;
    router.push(newPath);
  };

  return (
    <Select<ILanguageOption, false>
      instanceId="language-select"
      inputId="language-select-input"
      value={currentValue}
      options={options}
      isSearchable={false}
      closeMenuOnSelect
      unstyled
      onChange={handleChange}
      onMenuOpen={() => setIsMenuOpen(true)}
      onMenuClose={() => setIsMenuOpen(false)}
      components={{
        DropdownIndicator: props => (
          <DropdownIndicator {...props} isMenuOpen={isMenuOpen} />
        ),
        Option: CustomOption,
        SingleValue: CustomSingleValue,
      }}
      styles={{
        menu: base => ({
          ...base,
          zIndex: 20,
          width: '150px',
          right: 'calc(50% + 4px)',
          transform: 'translate(50%, 0)',
        }),
        menuList: base => ({
          ...base,
          maxHeight: '400px',
          overflow: 'hidden',
        }),
        option: base => ({
          ...base,
          width: 'calc((100% - 2px) / 2)',
        }),
        input: base => ({
          ...base,
          'input:focus': {
            boxShadow: 'none',
          },
        }),
      }}
      className="cursor-pointer"
      classNames={{
        menuList: () => 'w-full flex gap-[2px] flex-wrap',
        container: () => 'cursor-pointer',
        menu: () => menuStyles,
        option: ({ isFocused, isSelected }) =>
          clsx(
            optionStyles.base,
            isFocused && optionStyles.focus,
            isSelected && optionStyles.selected
          ),
        dropdownIndicator: () => 'absolute cursor-pointer',
        singleValue: () => singleValueStyles,
      }}
    />
  );
};

export default LanguageSelect;
