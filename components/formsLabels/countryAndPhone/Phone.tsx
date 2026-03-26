'use client';

import { type FC, useEffect, useMemo, useState } from 'react';

import type { ICountryOption } from '@interfaces/ICountryOption';
import { ErrorMessage, Field, useFormikContext } from 'formik';
import debounce from 'lodash/debounce';
import { useTranslations } from 'next-intl';

import Menu from './Menu';
import PhoneCodeOption from './PhoneCodeOption';
import PhoneMaskedField from './PhoneMaskedField';
import Selector from './Selector';

import LabelTitle from '@components/common/LabelTitle';
import MobileMenu from '@components/common/MobileMenu';

import { useCurrentLocale } from '@hooks/useCurrentLocale';
import useWindowWidth from '@hooks/useWindowWidth';

import { cn } from '@utils/cn';

import { Label } from '@enums/i18nConstants';

import countriesList from '@constants/countriesList';

import { DEFAULT_LOCALE } from '@i18n/config';

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
  const language = useCurrentLocale();
  const t = useTranslations();
  const { setFieldValue } = useFormikContext<any>();

  const [isOpenMobileMenu, setIsOpenMobileMenu] = useState(false);
  const [hasClickedOutside, setHasClickedOutside] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<ICountryOption | null>(
    null
  );
  const [callingCode, setCallingCode] = useState('');
  const [phoneFormat, setPhoneFormat] = useState('');

  const windowWidth = useWindowWidth();
  const callingCodeSize = callingCode.replace('+', '').length;

  const stripCountryPrefix = (format: string, code: string) => {
    const escaped = code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return format.replace(new RegExp(`^\\s*${escaped}\\s*`), '').trim();
  };

  const options = useMemo<ICountryOption[]>(() => {
    return countriesList.flatMap(country => {
      const { phoneFormat, callingCode, translations, flag } = country;

      if (Array.isArray(phoneFormat)) {
        return phoneFormat.map((_, index) => ({
          value: translations[DEFAULT_LOCALE],
          label: (
            <PhoneCodeOption
              name={translations[language] ?? translations[DEFAULT_LOCALE]}
              callingCode={callingCode}
              flag={flag}
              phoneFormat={phoneFormat}
              formatIndex={index}
            />
          ),
        }));
      }

      return {
        value: translations[DEFAULT_LOCALE],
        label: (
          <PhoneCodeOption
            name={translations[language] ?? translations[DEFAULT_LOCALE]}
            callingCode={callingCode}
            flag={flag}
            phoneFormat={phoneFormat}
          />
        ),
      };
    });
  }, [language]);

  const [filteredOptions, setFilteredOptions] =
    useState<ICountryOption[]>(options);

  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  const callingCodeIndex = useMemo(() => {
    const map = new Map<string, CallingCodeEntry[]>();

    for (const country of countriesList) {
      const { callingCode, translations, flag, phoneFormat } = country;

      const entry: CallingCodeEntry = {
        callingCode,
        countryValue: translations[DEFAULT_LOCALE],
        flag,
        phoneFormat,
      };

      const arr = map.get(callingCode) ?? [];
      arr.push(entry);
      map.set(callingCode, arr);
    }

    return map;
  }, []);

  const detectByCallingCode = (rawValue: string) => {
    const normalized = rawValue.trim();
    const sanitized = normalized.replace(/[^\d+]/g, '');

    if (!sanitized.startsWith('+')) return null;

    const digits = sanitized.slice(1);
    if (!digits.length) return null;

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
      option =>
        option?.label?.props?.callingCode === code &&
        option.value === chosen.countryValue
    );

    if (opt) {
      setSelectedOption(opt);
    }
  };

  const toggleMobileMenu = () => {
    setIsOpenMobileMenu(prev => !prev);
  };

  const debouncedHandleInputText = useMemo(
    () =>
      debounce((value: string) => {
        const query = value.trim().toLowerCase();

        if (!query) {
          setFilteredOptions(options);
          return;
        }

        const nextOptions = options.filter(option => {
          const name = String(option.label.props.name ?? '').toLowerCase();
          const code = String(
            option.label.props.callingCode ?? ''
          ).toLowerCase();

          return name.includes(query) || code.includes(query);
        });

        setFilteredOptions(nextOptions);
      }, 300),
    [options]
  );

  useEffect(() => {
    return () => {
      debouncedHandleInputText.cancel();
    };
  }, [debouncedHandleInputText]);

  const handleInputText = (value: string) => {
    debouncedHandleInputText(value);
  };

  const handleOptionClick = (option: ICountryOption) => {
    setSelectedOption(option);

    const { phoneFormat, formatIndex } = option.label.props;
    const code = option.label.props.callingCode as string;

    const rawFormat = Array.isArray(phoneFormat)
      ? phoneFormat[formatIndex ?? 0]
      : phoneFormat;

    const localFormat = stripCountryPrefix(rawFormat, code);

    setFieldValue('callingCode', code, false);
    setFieldValue('countryPhone', option.value, false);

    setCallingCode(code);
    setPhoneFormat(localFormat);

    if (windowWidth < 1178) {
      toggleMobileMenu();
    }
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
            callingCodeSize={callingCodeSize}
            detectByCallingCode={detectByCallingCode}
            onDetectCountry={({ callingCode }) =>
              applyDetectedCallingCode(callingCode)
            }
            onDetectedAndNormalize={normalized =>
              setFieldValue('phone', normalized, false)
            }
          />
        </div>

        <ErrorMessage name="phone">
          {msg => (
            <div className="mt-1 text-sm text-red-500">
              {t(msg, { field: t(Label.Phone) })}
            </div>
          )}
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
          intent="mobile"
        />
      </MobileMenu>
    </>
  );
};

export default Phone;
