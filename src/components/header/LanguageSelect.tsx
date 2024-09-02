import Select, { components } from 'react-select';
import type { DropdownIndicatorProps } from 'react-select';

import clsx from 'clsx';
import i18next from 'i18next';

import type { IOption } from './LanguageOption';
import LanguageOption from './LanguageOption';

import SvgIcon from '@components/common/SvgIcon';

import { IconId } from '@enums/iconsSpriteId';

const DropdownIndicator = (props: DropdownIndicatorProps<IOption, false>) => {
  return (
    <components.DropdownIndicator {...props}>
      <SvgIcon iconId={IconId.ArrowDown} size={{ width: 8, height: 8 }} />
    </components.DropdownIndicator>
  );
};

const optionStyles = {
  base: 'hover:cursor-pointer w-[95px] py-[7px]',
  focus: 'lg:bg-gray-100 lg:active:bg-gray-200',
  selected: 'text-gray-500',
};
const menuStyles = 'bg-main rounded-[4px] pb-[7px]';
const LanguageSelect = () => {
  const options = [
    {
      value: 'en',
      label: <LanguageOption iconId={IconId.English} language="en" />,
    },
    {
      value: 'sv',
      label: <LanguageOption iconId={IconId.Sweden} language="sv" />,
    },
    {
      value: 'de',
      label: <LanguageOption iconId={IconId.Germany} language="de" />,
    },
    {
      value: 'es',
      label: <LanguageOption iconId={IconId.Spain} language="es" />,
    },
    {
      value: 'fr',
      label: <LanguageOption iconId={IconId.France} language="fr" />,
    },
    {
      value: 'ru',
      label: <LanguageOption iconId={IconId.Russia} language="ru" />,
    },
    {
      value: 'uk',
      label: <LanguageOption iconId={IconId.Ukraine} language="uk" />,
    },
  ];

  return (
    <Select
      defaultValue={options.find(
        option => option.value === i18next.language.split('-')[0]
      )}
      options={options}
      // defaultMenuIsOpen={true}
      isSearchable={false}
      components={{ DropdownIndicator }}
      closeMenuOnSelect={true}
      onChange={selectedOption => i18next.changeLanguage(selectedOption?.value)}
      unstyled
      styles={{
        menu: base => ({
          ...base,
          width: '95px',
          right: '50%',
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
      }}
    />
  );
};

export default LanguageSelect;
