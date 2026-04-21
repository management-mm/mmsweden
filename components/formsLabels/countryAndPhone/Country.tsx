'use client';

import { useEffect, useMemo, useState } from 'react';

import type { ICountryOption } from '@interfaces/ICountryOption';
import { Field, useFormikContext } from 'formik';
import debounce from 'lodash/debounce';

import CountryOption from './CountryOption';
import Menu from './Menu';
import Selector from './Selector';

import LabelTitle from '@components/common/LabelTitle';
import MobileMenu from '@components/common/MobileMenu';

import { useCurrentLocale } from '@hooks/useCurrentLocale';
import useWindowWidth from '@hooks/useWindowWidth';

import { Label } from '@enums/i18nConstants';

import countriesList from '@constants/countriesList';

import { DEFAULT_LOCALE } from '@i18n/config';

const Country = () => {
  const locale = useCurrentLocale();
  const windowWidth = useWindowWidth();
  const { values, setFieldValue } = useFormikContext<{ country: string }>();

  const options: ICountryOption[] = useMemo(
    () =>
      countriesList.map(country => ({
        value: country.translations[DEFAULT_LOCALE],
        label: (
          <CountryOption
            flag={country.flag}
            name={
              country.translations[locale] ??
              country.translations[DEFAULT_LOCALE]
            }
          />
        ),
      })),
    [locale]
  );

  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] =
    useState<ICountryOption[]>(options);
  const [isOpenMobileMenu, setIsOpenMobileMenu] = useState(false);
  const [hasClickedOutside, setHasClickedOutside] = useState(false);

  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  const selectedOption =
    options.find(option => option.value === values.country) ?? null;

  const handleOptionClick = (option: ICountryOption) => {
    setFieldValue('country', option.value, false);
    setIsOpen(false);

    if (windowWidth < 1178) {
      toggleMobileMenu();
    }
  };

  const toggleMobileMenu = () => {
    setIsOpenMobileMenu(prev => !prev);
  };

  const handleInputText = useMemo(
    () =>
      debounce((searchValue: string) => {
        const searchTerm = searchValue.trim().toLowerCase();

        setFilteredOptions(
          options.filter(option => {
            const labelElement = option.label as React.ReactElement;
            const name = labelElement.props.name?.toLowerCase() ?? '';
            const callingCode = labelElement.props.callingCode ?? '';

            return (
              name.includes(searchTerm) || callingCode.includes(searchTerm)
            );
          })
        );
      }, 300),
    [options]
  );

  useEffect(() => {
    return () => {
      handleInputText.cancel();
    };
  }, [handleInputText]);

  return (
    <>
      <label className="flex flex-col gap-[2px]">
        <div className="flex items-center gap-[2px]">
          <LabelTitle title={Label.Country} />
          <span className="text-red-700">*</span>
        </div>

        <div className="w-full">
          <Field name="country">
            {({
              field,
            }: {
              field: {
                name: string;
                value: string;
                onChange: () => void;
                onBlur: () => void;
              };
            }) => (
              <Selector
                {...field}
                hasClickedOutside={hasClickedOutside}
                setHasClickedOutside={setHasClickedOutside}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
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
        <Menu
          labelName="country"
          handleInputText={handleInputText}
          options={filteredOptions}
          handleOptionClick={handleOptionClick}
          intent="mobile"
        />
      </MobileMenu>
    </>
  );
};

export default Country;
