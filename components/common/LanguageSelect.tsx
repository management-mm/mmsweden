'use client';

import { useMemo, useState } from 'react';
import Select from 'react-select';

import clsx from 'clsx';
import { usePathname, useRouter } from 'next/navigation';

import DropdownIndicator from '@components/header/DropdownIndicator';
import LanguageOption from '@components/header/LanguageOption';

import languageOptions from '@constants/languageOptions';

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

const menuStyles = 'bg-main rounded-[4px] pb-[7px]';
const singleValueStyles = 'mr-[6px]';

const LanguageSelect = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const currentLocale = useMemo<AppLocale>(() => {
    const firstSegment = pathname.split('/')[1];
    return isAppLocale(firstSegment) ? firstSegment : DEFAULT_LOCALE;
  }, [pathname]);

  const options = languageOptions
    .filter(option => SUPPORTED_LOCALES.includes(option.language as AppLocale))
    .map(option => ({
      value: option.language as AppLocale,
      label: (
        <LanguageOption iconId={option.iconId} language={option.language} />
      ),
    }));

  const currentValue =
    options.find(option => option.value === currentLocale) ?? options[0];

  const handleChange = (selectedOption: { value: AppLocale } | null) => {
    if (!selectedOption) return;

    const newLocale = selectedOption.value;

    if (newLocale === currentLocale) return;

    const segments = pathname.split('/');

    segments[1] = newLocale;

    const newPath = segments.join('/') || `/${newLocale}`;

    router.push(newPath);
  };

  return (
    <Select
      value={currentValue}
      onMenuOpen={() => setIsMenuOpen(true)}
      onMenuClose={() => setIsMenuOpen(false)}
      options={options}
      isSearchable={false}
      components={{
        DropdownIndicator: props => (
          <DropdownIndicator {...props} isMenuOpen={isMenuOpen} />
        ),
      }}
      closeMenuOnSelect
      onChange={handleChange}
      unstyled
      styles={{
        menu: base => ({
          ...base,
          zIndex: '20',
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
          width: 'calc((100%-2px)/2)',
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
            isFocused && optionStyles.focus,
            isSelected && optionStyles.selected,
            optionStyles.base
          ),
        dropdownIndicator: () => 'absolute cursor-pointer',
        singleValue: () => singleValueStyles,
      }}
    />
  );
};

export default LanguageSelect;
