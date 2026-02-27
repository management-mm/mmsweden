'use client';

import { type ChangeEvent, type FC, useContext, useState } from 'react';
import { useMemo } from 'react';

import type { ICountryOption } from '@interfaces/ICountryOption';
import { LanguageContext } from 'app/providers';
import { ErrorMessage, Field, useFormikContext } from 'formik';
import * as _ from 'lodash';

import Menu from './Menu';
import PhoneCodeOption from './PhoneCodeOption';
import PhoneMaskedField from './PhoneMaskedField';
import Selector from './Selector';

import LabelTitle from '@components/common/LabelTitle';
import MobileMenu from '@components/common/MobileMenu';

import useWindowWidth from '@hooks/useWindowWidth';

import { cn } from '@utils/cn';

import { Label } from '@enums/i18nConstants';

import countriesList from '@constants/countriesList';

type CallingCodeEntry = {
  callingCode: string;
  countryValue: string;
  flag: string;
  phoneFormat: string | string[];
};

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

  const stripCountryPrefix = (format: string, callingCode: string) => {
    const escaped = callingCode.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return format.replace(new RegExp(`^\\s*${escaped}\\s*`), '').trim();
  };

  const callingCodeIndex = useMemo(() => {
    const map = new Map<string, CallingCodeEntry[]>();

    for (const country of countriesList) {
      const { callingCode, translations, flag, phoneFormat } = country;

      const entry: CallingCodeEntry = {
        callingCode,
        countryValue: translations[language],
        flag,
        phoneFormat,
      };

      const arr = map.get(callingCode) ?? [];
      arr.push(entry);
      map.set(callingCode, arr);
    }

    return map;
  }, [language]);
  const detectByCallingCode = (rawValue: string) => {
    const digits = rawValue.slice(1).replace(/\D/g, '');
    if (digits.length === 0) return null;

    const maxLen = Math.min(4, digits.length);

    for (let len = maxLen; len >= 1; len--) {
      const code = `+${digits.slice(0, len)}`;
      if (callingCodeIndex.has(code)) {
        return { callingCode: code };
      }
    }

    return null;
  };

  const applyDetectedCallingCode = (code: string) => {
    const candidates = callingCodeIndex.get(code);
    if (!candidates?.length) return;

    const chosen = candidates[0];

    const rawFormat = Array.isArray(chosen.phoneFormat)
      ? chosen.phoneFormat[0]
      : chosen.phoneFormat;

    const localFormat = stripCountryPrefix(rawFormat, code);

    setCallingCode(code);
    setPhoneFormat(localFormat);

    setFieldValue('callingCode', code, false);
    setFieldValue('countryPhone', chosen.countryValue, false);

    const opt = options.find(
      o =>
        o?.label?.props?.callingCode === code && o.value === chosen.countryValue
    );
    if (opt) setSelectedOption(opt);
  };

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
    const code = option.label.props.callingCode as string;

    const rawFormat = Array.isArray(phoneFormat)
      ? phoneFormat[formatIndex]
      : phoneFormat;

    const localFormat = stripCountryPrefix(rawFormat, code);

    setFieldValue('callingCode', code, false);
    setFieldValue('countryPhone', option.value, false);

    setCallingCode(code);
    setPhoneFormat(localFormat);

    if (windowWidth < 1178) toggleMobileMenu();
  };

  return (
    <>
      <label className={cn('flex flex-col gap-[2px]', className)}>
        <div className="flex items-center gap-[2px]">
          <LabelTitle title={Label.Phone} />
          <span className="text-red-700">*</span>
        </div>
        <div className="relative z-2 w-full">
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
          <Field
            type="hidden"
            required={false}
            name="callingCode"
            value={callingCode}
          />
          <PhoneMaskedField
            phoneFormat={phoneFormat}
            callingCodeSize={callingCodeSize.length}
            detectByCallingCode={detectByCallingCode}
            onDetectCountry={({ callingCode }) =>
              applyDetectedCallingCode(callingCode)
            }
            onDetectedAndNormalize={normalized =>
              setFieldValue('phone', normalized, false)
            }
          />
        </div>
        <ErrorMessage name="Phone">
          {msg => <div className="mt-1 text-sm text-red-500">{msg}</div>}
        </ErrorMessage>
      </label>
      <MobileMenu
        isOpen={isOpenMobileMenu}
        direction="bottom"
        handleToggleMenu={toggleMobileMenu}
      >
        <Menu
          labelName="phone"
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
