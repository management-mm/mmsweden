import clsx from 'clsx';

import Menu from './Menu';
import SelectedOption from './SelectedOption';

import SvgIcon from '@components/common/SvgIcon';

import useWindowWidth from '@hooks/useWindowWidth';

import { IconId } from '@enums/iconsSpriteId';
import { useTranslation } from 'react-i18next';
import { Placeholder } from '@enums/i18nConstants';
import type { FC } from 'react';
import type { ICountryOption } from '@interfaces/ICountryOption';

interface ISelectorProps {
  hasClickedOutside: boolean;
  setHasClickedOutside: (value: boolean) => void;
  isOpen: boolean;
  handleInputText: () => void
  setIsOpen: (value: boolean) => void;
  handleOptionSelected: (option: ICountryOption) => void;
  selectedOption: ICountryOption
  labelName: 'country' | 'phone';
  filteredOptions: ICountryOption[]
  toggleMobileMenu: () => void
}

const Selector:FC<ISelectorProps> = ({
  hasClickedOutside,
  setHasClickedOutside,
  isOpen,
  handleInputText,
  setIsOpen,
  handleOptionSelected,
  selectedOption,
  labelName,
  filteredOptions,
  toggleMobileMenu,
}) => {
  console.log(isOpen);
  const {t} = useTranslation()

  const windowWidth = useWindowWidth();

  return (
    <>
      <div
        className={clsx(
          '',
          labelName === 'phone' &&
            'absolute left-[22px] top-1/2 w-auto -translate-y-1/2 transform',
          labelName === 'country' &&
            'static w-full shrink-0 rounded-[32px] border border-neutral px-[22px] py-[14px] font-openSans text-[14px] text-desc outline-none transition-border duration-primary focus:border focus:border-secondaryAccent'
        )}
        onClick={() => {
          if (windowWidth < 1178) {
            toggleMobileMenu();
            return;
          }
          if (hasClickedOutside && !isOpen) {
            setHasClickedOutside(false)
            return;
          }
          setIsOpen(true);
        }}
      >
        <div className={clsx('cursor-pointer bg-transparent')}>
          {selectedOption ? (
            <SelectedOption
              isOpen={isOpen}
              name={selectedOption.label.props.name}
              flag={selectedOption.label.props.flag}
              labelName={labelName}
              value={
                selectedOption.label.props[
                  `${labelName === 'country' ? 'name' : 'callingCode'}`
                ]
              }
            />
          ) : (
            <div
              className={clsx(
                'flex items-center',
                labelName === 'country' && 'w-full justify-between',
                labelName === 'phone' && 'w-[40px] gap-[8px]'
              )}
            >
              <div className="flex items-start gap-[8px]">
                <SvgIcon
                  iconId={
                    labelName === 'country' ? IconId.Planet : IconId.CallingCode
                  }
                  size={{ width: 18, height: 18 }}
                  className="fill-primary"
                />
                  {labelName === 'country' && <p>{t(Placeholder.SelectCountry)}</p>}
              </div>

              <SvgIcon
                iconId={isOpen ? IconId.ArrowTop : IconId.ArrowDown}
                size={{ width: 8, height: 8 }}
                className={clsx(
                  '',
                  labelName === 'country' && '',
                  labelName === 'phone' && ''
                )}
              />
            </div>
          )}
        </div>

        {isOpen && (
          <Menu
            setHasClickedOutside={setHasClickedOutside}
            handleInputText={handleInputText}
            options={filteredOptions}
            handleOptionClick={handleOptionSelected}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        )}
      </div>
    </>
  );
};

export default Selector;