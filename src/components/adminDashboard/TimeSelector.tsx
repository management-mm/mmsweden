import { type Dispatch, type FC, type SetStateAction } from 'react';
import Select from 'react-select';

import clsx from 'clsx';

interface ITimeSelectorProps {
  defaultValue: { value: string | number; label: string | number };
  options: { value: string | number; label: string | number }[];
  setValue: Dispatch<SetStateAction<string | number | undefined>>;
}

const TimeSelector: FC<ITimeSelectorProps> = ({
  defaultValue,
  options,
  setValue,
}) => {
  const optionStyles = {
    base: 'hover:cursor-pointer w-[95px] py-[7px]',
    focus: 'lg:bg-gray-100 lg:active:bg-gray-200',
    selected: '',
  };
  const menuStyles = 'bg-main rounded-[4px] pb-[7px] text-center shadow-xl';
  const singleValueStyles = 'mr-[6px]';
  // const [isMenuOpen, SetIsMenuOpen] = useState(false);
  return (
    <div className="">
      <Select<{ value: string | number; label: string | number }>
        menuPortalTarget={document.body}
        defaultValue={defaultValue}
        // onMenuOpen={() => SetIsMenuOpen(true)}
        // onMenuClose={() => SetIsMenuOpen(false)}
        options={options}
        isSearchable={false}
        // components={{
        //   DropdownIndicator: props => (
        //     <DropdownIndicator {...props} isMenuOpen={isMenuOpen} />
        //   ),
        // }}
        closeMenuOnSelect={true}
        // defaultMenuIsOpen={true}
        onChange={selectedOption => setValue(selectedOption?.value)}
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
          control: () =>
            'w-full shrink-0 border border-primary rounded-[32px] py-[10px] px-[14px] text-center',
          container: () => 'cursor-pointer',
          menu: () => menuStyles,
          option: ({ isFocused, isSelected }) =>
            clsx(
              isFocused && optionStyles.focus,
              isSelected && optionStyles.selected,
              optionStyles.base
            ),
          dropdownIndicator: () => 'cursor-pointer',
          singleValue: () => singleValueStyles,
        }}
      />
    </div>
  );
};

export default TimeSelector;
