import { type FC, useRef, useState } from 'react';

import clsx from 'clsx';
import { useFormikContext } from 'formik';

import PhoneCodeOption from './PhoneCodeOption';
import SelectedPhoneCode from './SelectedPhoneCode';

import SvgIcon from '@components/common/SvgIcon';

import { IconId } from '@enums/iconsSpriteId';

import countriesList from '@constants/countriesList';

interface ISelectPhoneCodeProps {
  setCallingCode: (arg: string) => void;
  setPlaceholder: (arg: string) => void;
}

const SelectPhoneCode: FC<ISelectPhoneCodeProps> = ({
  setCallingCode,
  setPlaceholder,
}) => {
  const { setFieldValue } = useFormikContext();

  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);

  const countriesOptions = countriesList.map(country => {
    return {
      value: country.translations.en,
      label: (
        <PhoneCodeOption
          name={country.translations.en}
          callingCode={country.callingCode}
          flag={country.flag}
        />
      ),
    };
  });
  const selectRef = useRef(null);
  const [filteredOptions, setFilteredOptions] = useState(countriesOptions);
  // useEffect(() => {
  //   setFilteredOptions(
  //     countriesOptions.filter(option =>
  //       option.value.toLowerCase().includes(searchText.toLowerCase())
  //     )
  //   );
  // }, [searchText, countriesOptions]);

  // useEffect(() => {
  //   const handleClickOutside = event => {
  //     if (selectRef.current && !selectRef.current.contains(event.target)) {
  //       setIsOpen(false);
  //     }
  //   };
  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, []);

  const handleOptionClick = option => {
    setSelectedOption(option);
    setFieldValue('callingCode', option.label.props.callingCode, false);
    setFieldValue('countryPhone', option.value, false);

    setCallingCode(option.label.props.callingCode);
    setPlaceholder(option.label.props.phoneFormat);
    setIsOpen(false);
    setSearchText('');
  };

  return (
    <div
      ref={selectRef}
      className="absolute left-[22px] top-1/2 w-64 -translate-y-1/2 transform"
    >
      <div
        className={clsx(
          'cursor-pointer bg-transparent',
          isOpen && 'border-blue-500'
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption ? (
          <SelectedPhoneCode isOpen={isOpen} selectedOption={selectedOption} />
        ) : (
          <div className="flex items-center gap-[8px]">
            <SvgIcon
              iconId={IconId.CallingCode}
              size={{ width: 18, height: 18 }}
              className="fill-primary"
            />
            <SvgIcon
              iconId={isOpen ? IconId.ArrowTop : IconId.ArrowDown}
              size={{ width: 8, height: 8 }}
            />
          </div>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full border bg-white shadow-lg">
          <input
            type="text"
            className="w-full border-b p-2"
            placeholder="Search by Name or Code"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
          <ul className="max-h-60 overflow-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(option => (
                <li
                  key={option.value}
                  className="cursor-pointer p-2 hover:bg-gray-200"
                  onClick={() => handleOptionClick(option)}
                >
                  {option.label}
                </li>
              ))
            ) : (
              <li className="p-2 text-gray-500">No options found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SelectPhoneCode;
