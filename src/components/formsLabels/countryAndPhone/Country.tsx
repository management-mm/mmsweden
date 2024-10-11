import { type ChangeEvent, useState } from 'react';

import { Field, useFormikContext } from 'formik';
import * as _ from 'lodash';

import CountryOption from './CountryOption';
import MobileMenuSelect from './MobileMenuSelect';
import Selector from './Selector';

import LabelTitle from '@components/common/LabelTitle';
import MobileMenu from '@components/common/MobileMenu';

import countriesList from '@constants/countriesList';

const Country = () => {
  const options = countriesList.map(country => ({
    value: country.translations.en,
    label: <CountryOption flag={country.flag} name={country.translations.en} />,
  }));
  const { setFieldValue } = useFormikContext();
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [isOpenMobileMenu, setIsOpenMobileMenu] = useState(false);

  const handleOptionClick = option => {
    setSelectedOption(option);
    setFieldValue('country', option.label.props.name, false);

    setIsOpen(false);
  };
  const toggleMobileMenu = () => {
    setIsOpenMobileMenu(!isOpenMobileMenu);
  };

  const handleInputText = _.debounce((e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setFilteredOptions(
      options.filter(option => {
        return (
          option.label.props.name
            .toLowerCase()
            .includes(e.target.value.trim().toLowerCase()) ||
          option.label.props.callingCode.includes(e.target.value.trim())
        );
      })
    );
  });

  return (
    <>
      <label className="flex flex-col gap-[2px]">
        <LabelTitle title="Country*" />
        <div className="w-full">
          <Field name="country">
            {({ field }) => (
              <Selector
                {...field}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                options={options}
                handleOptionSelected={handleOptionClick}
                selectedOption={selectedOption}
                labelName="country"
                handleInputText={handleInputText}
                filteredOptions={filteredOptions}
                toggleMobileMenu={toggleMobileMenu}
              />
            )}
          </Field>
        </div>
      </label>
      <MobileMenu
        isOpen={isOpenMobileMenu}
        direction="bottom"
        handleToggleMenu={toggleMobileMenu}
      >
        <MobileMenuSelect
          handleInputText={handleInputText}
          options={filteredOptions}
          handleOptionClick={handleOptionClick}
        />
      </MobileMenu>
    </>
  );
};

export default Country;
