import { type ChangeEvent, type ReactNode, useContext, useState } from 'react';
import { Field, useFormikContext } from 'formik';
import * as _ from 'lodash';

import CountryOption from './CountryOption';
import MobileMenuSelect from './MobileMenuSelect';
import Selector from './Selector';
import LabelTitle from '@components/common/LabelTitle';
import MobileMenu from '@components/common/MobileMenu';
import countriesList from '@constants/countriesList';
import { LanguageContext } from '@components/SharedLayout';
import useWindowWidth from '@hooks/useWindowWidth';

interface CountryOptionType {
  value: string;
  label: ReactNode;
}

const Country = () => {
  const { language } = useContext(LanguageContext);
  const options: CountryOptionType[] = countriesList.map(country => ({
    value: country.translations[language],
    label: <CountryOption flag={country.flag} name={country.translations[language]} />,
  }));

  const { setFieldValue } = useFormikContext<{ country: string }>();
  const windowWidth = useWindowWidth();
  const [selectedOption, setSelectedOption] = useState<CountryOptionType | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [filteredOptions, setFilteredOptions] = useState<CountryOptionType[]>(options);
  const [isOpenMobileMenu, setIsOpenMobileMenu] = useState<boolean>(false);
  const [hasClickedOutside, setHasClickedOutside] = useState<boolean>(false);

  const handleOptionClick = (option: CountryOptionType) => {
    setSelectedOption(option);
    setFieldValue('country', option.value, false);

    setIsOpen(false);
    if (windowWidth < 1178) {
      toggleMobileMenu();
    }
  };

  const toggleMobileMenu = () => {
    setIsOpenMobileMenu(prev => !prev);
  };

  const handleInputText = _.debounce((e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const searchTerm = e.target.value.trim().toLowerCase();
    setFilteredOptions(
      options.filter((option: CountryOptionType) => {
        const name = option.label as React.ReactElement;
        return (
          name.props.name.toLowerCase().includes(searchTerm) ||
          (name.props.callingCode && name.props.callingCode.includes(searchTerm))
        );
      })
    );
  }, 300);

  return (
    <>
      <label className="flex flex-col gap-[2px]">
        <LabelTitle title="Country*" />
        <div className="w-full">
          <Field name="country">
            {({ field }: { field: { name: string; value: string; onChange: () => void; onBlur: () => void } }) => (
              <Selector
                {...field}
                hasClickedOutside={hasClickedOutside}
                setHasClickedOutside={setHasClickedOutside}
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