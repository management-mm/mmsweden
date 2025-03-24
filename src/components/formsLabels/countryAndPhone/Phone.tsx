import { type ChangeEvent, type FC, useContext, useState } from 'react';
import InputMask from 'react-input-mask';

import type { ICountryOption } from '@interfaces/ICountryOption';
import clsx from 'clsx';
import { Field, type FieldProps, useFormikContext } from 'formik';
import * as _ from 'lodash';

import PhoneCodeOption from './PhoneCodeOption';
import Selector from './Selector';

import { LanguageContext } from '@components/SharedLayout';
import LabelTitle from '@components/common/LabelTitle';
import MobileMenu from '@components/common/MobileMenu';

import useWindowWidth from '@hooks/useWindowWidth';

import { cn } from '@utils/cn';

import { Label } from '@enums/i18nConstants';

import countriesList from '@constants/countriesList';
import Menu from './Menu';

interface IPhoneProps {
  className?: string;
}

const Phone: FC<IPhoneProps> = ({ className }) => {
  const { language } = useContext(LanguageContext);

  const options = countriesList.flatMap(country => {
    const { phoneFormat, callingCode, translations, flag } = country;

    if (Array.isArray(phoneFormat)) {
      return phoneFormat.map((_, index) => ({
        value: translations[language],
        label: (
          <PhoneCodeOption
            name={translations[language]}
            callingCode={callingCode}
            flag={flag}
            phoneFormat={phoneFormat}
            formatIndex={index}
          />
        ),
      }));
    }

    return {
      value: translations[language],
      label: (
        <PhoneCodeOption
          name={translations[language]}
          callingCode={callingCode}
          flag={flag}
          phoneFormat={phoneFormat}
        />
      ),
    };
  });

  const [filteredOptions, setFilteredOptions] = useState(options);

  const [isOpenMobileMenu, setIsOpenMobileMenu] = useState(false);
  const [hasClickedOutside, setHasClickedOutside] = useState<boolean>(false);
  const windowWidth = useWindowWidth();

  const [isOpen, setIsOpen] = useState(false);
  const { setFieldValue } = useFormikContext();
  const [selectedOption, setSelectedOption] = useState<ICountryOption | null>(
    null
  );

  const [callingCode, setCallingCode] = useState<string>('');
  const [phoneFormat, setPhoneFormat] = useState<string>('');
  const [placeholder, setPlaceholder] = useState<string>('+000 (00) 000 0000');
  const callingCodeSize = callingCode.split('').slice(1);
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
  const handleOptionClick = (option: ICountryOption) => {
    setSelectedOption(option);
    const { phoneFormat, formatIndex } = option.label.props;
    setFieldValue('callingCode', option?.label?.props.callingCode, false);
    setFieldValue('countryPhone', option.value, false);

    setCallingCode(option?.label?.props.callingCode);
    setPhoneFormat(
      Array.isArray(phoneFormat) ? phoneFormat[formatIndex] : phoneFormat
    );
    setPlaceholder(
      Array.isArray(phoneFormat)
        ? phoneFormat[formatIndex].replace(/#/g, '0')
        : phoneFormat.replace(/#/g, '0')
    );
    // setIsOpen(false);
    if (windowWidth < 1178) {
      toggleMobileMenu();
    }
  };

  return (
    <>
      <label className={cn('flex flex-col gap-[2px]', className)}>
        <LabelTitle title={Label.Phone} />
        <div className="z-2 relative w-full">
          <Selector
            hasClickedOutside={hasClickedOutside}
            setHasClickedOutside={setHasClickedOutside}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            handleOptionSelected={handleOptionClick}
            selectedOption={selectedOption}
            labelName="phone"
            handleInputText={handleInputText}
            filteredOptions={filteredOptions}
            toggleMobileMenu={toggleMobileMenu}
          />
          <Field type="hidden" name="callingCode" value={callingCode} />
          <Field name="phone">
            {({ field }: FieldProps) => (
              <InputMask
                {...field}
                mask={phoneFormat}
                placeholder={placeholder}
                maskChar={'0'}
                formatChars={{
                  '#': '[0-9]',
                }}
                className={clsx(
                  'w-full shrink-0 rounded-[32px] border border-neutral py-[14px] font-openSans text-[14px] text-desc outline-none transition-border duration-primary focus:border focus:border-secondaryAccent',
                  callingCodeSize.length === 0 && 'pl-[65px]',
                  callingCodeSize.length === 1 && 'pl-[77px]',
                  callingCodeSize.length === 2 && 'pl-[85px]',
                  callingCodeSize.length === 3 && 'pl-[93px]',
                  callingCodeSize.length === 4 && 'pl-[101px]'
                )}
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
          labelName='phone'
          handleInputText={handleInputText}
          options={filteredOptions}
          handleOptionClick={handleOptionClick}
          intent={'mobile'}
        />
      </MobileMenu>
    </>
  );
};

export default Phone;
