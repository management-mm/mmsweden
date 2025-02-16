import { type FC, useState } from 'react';
import Select from 'react-select';

import clsx from 'clsx';

import DropdownIndicator from '@components/header/DropdownIndicator';

import { LanguageKeys } from '@enums/languageKeys';

interface IDescSelectorProps {
  setLanguage: (value: LanguageKeys) => void;
}

const DescSelector: FC<IDescSelectorProps> = ({ setLanguage }) => {
  const optionStyles = {
    base: 'hover:cursor-pointer w-[95px] py-[7px]',
    focus: 'lg:bg-gray-100 lg:active:bg-gray-200',
    selected: '',
  };
  const menuStyles = 'bg-main rounded-[4px] pb-[7px]';
  const singleValueStyles = 'mr-[6px]';
  const [isMenuOpen, SetIsMenuOpen] = useState(false);
  const options = Object.values(LanguageKeys).map(option => {
    return {
      value: option,
      label: <p>{option.toUpperCase()}</p>,
    };
  });
  return (
    <div className="absolute right-[20px] top-[8px] z-50">
      <Select
        menuPortalTarget={document.body}
        defaultValue={options[0]}
        onMenuOpen={() => SetIsMenuOpen(true)}
        onMenuClose={() => SetIsMenuOpen(false)}
        options={options}
        isSearchable={false}
        components={{
          DropdownIndicator: props => (
            <DropdownIndicator {...props} isMenuOpen={isMenuOpen} />
          ),
        }}
        closeMenuOnSelect={true}
        onChange={selectedOption => {
          setLanguage(selectedOption?.value as LanguageKeys);
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
