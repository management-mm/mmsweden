import { useContext, useState } from 'react';
import Select from 'react-select';

import clsx from 'clsx';
import i18next from 'i18next';

import DropdownIndicator from './DropdownIndicator';
import LanguageOption from './LanguageOption';

import { LanguageContext } from '@components/SharedLayout';

import type { LanguageKeys } from '@enums/languageKeys';

import languageOptions from '@constants/languageOptions';

const optionStyles = {
  base: 'hover:cursor-pointer w-[95px] py-[7px]',
  focus: 'lg:bg-gray-100 lg:active:bg-gray-200',
  selected: '',
};
const menuStyles = 'bg-main rounded-[4px] pb-[7px]';
const singleValueStyles = 'mr-[6px]';

const LanguageSelect = () => {
  const [isMenuOpen, SetIsMenuOpen] = useState(false);
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('LanguageContext must be used within a LanguageProvider');
  }

  const { setLanguage } = context;

  const options = languageOptions.map(option => {
    return {
      value: option.language,
      label: (
        <LanguageOption iconId={option.iconId} language={option.language} />
      ),
    };
  });

  return (
    <Select
      defaultValue={options.find(
        option => option.value === i18next.language.split('-')[0]
      )}
      onMenuOpen={() => SetIsMenuOpen(true)}
      onMenuClose={() => SetIsMenuOpen(false)}
      options={options}
      // defaultMenuIsOpen={true}
      isSearchable={false}
      components={{
        DropdownIndicator: props => (
          <DropdownIndicator {...props} isMenuOpen={isMenuOpen} />
        ),
      }}
      closeMenuOnSelect={true}
      onChange={selectedOption => {
        setLanguage(selectedOption?.value as LanguageKeys);
        return i18next.changeLanguage(selectedOption?.value);
      }}
      unstyled
      styles={{
        menu: base => ({
          ...base,
          width: '95px',
          right: 'calc(50% + 4px)',
          transform: 'translate(50%, 0)',
        }),
        menuList: base => ({
          ...base,
          maxHeight: '400px',
          overflow: 'hidden',
        }),
        input: base => ({
          ...base,
          'input:focus': {
            boxShadow: 'none',
          },
        }),
      }}
      classNames={{
        menu: () => menuStyles,
        option: ({ isFocused, isSelected }) =>
          clsx(
            isFocused && optionStyles.focus,
            isSelected && optionStyles.selected,
            optionStyles.base
          ),
        dropdownIndicator: () => 'absolute',
        singleValue: () => singleValueStyles,
      }}
    />
  );
};

export default LanguageSelect;
