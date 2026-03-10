'use client';

import { type FC, useState } from 'react';
import Select from 'react-select';

import clsx from 'clsx';

import DropdownIndicator from '@components/header/DropdownIndicator';

import { type AppLocale, SUPPORTED_LOCALES } from '@i18n/config';

interface IDescSelectorProps {
  setLanguage: (value: AppLocale) => void;
}

type LanguageOption = {
  value: AppLocale;
  label: JSX.Element;
};

const DescSelector: FC<IDescSelectorProps> = ({ setLanguage }) => {
  const optionStyles = {
    base: 'hover:cursor-pointer w-[95px] py-[7px]',
    focus: 'lg:bg-gray-100 lg:active:bg-gray-200',
    selected: '',
  };

  const menuStyles = 'bg-main rounded-[4px] pb-[7px]';
  const singleValueStyles = 'mr-[6px]';

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const options: LanguageOption[] = SUPPORTED_LOCALES.map(option => ({
    value: option,
    label: <p>{option.toUpperCase()}</p>,
  }));

  return (
    <div className="absolute top-[8px] right-[20px] z-50">
      <Select<LanguageOption, false>
        menuPortalTarget={document.body}
        defaultValue={options[0]}
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
        onChange={selectedOption => {
          if (!selectedOption) return;
          setLanguage(selectedOption.value);
        }}
        unstyled
        styles={{
          menuPortal: base => ({
            ...base,
            zIndex: 9999,
          }),
          menu: base => ({
            ...base,
            zIndex: 20,
            width: '95px',
            right: '50%',
            transform: 'translate(50%, 0)',
          }),
        }}
        className="cursor-pointer"
        classNames={{
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
    </div>
  );
};

export default DescSelector;
