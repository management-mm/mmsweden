import useOutsideAlerter from '@hooks/useOutsideAlerter';
import type { ICountryOption } from '@interfaces/ICountryOption';
import type { ChangeEvent, FC } from 'react';

interface IMenuProps {
  handleInputText: (e: ChangeEvent<HTMLInputElement>) => void;
  options: ICountryOption[] | null
  handleOptionClick: (option: ICountryOption) => void;
  isOpen: boolean
  setIsOpen: (value: boolean) => void;
  setHasClickedOutside: (value: boolean) => void
}

const Menu:FC<IMenuProps> = ({
  handleInputText,
  options,
  handleOptionClick,
  isOpen,
  setIsOpen,
  setHasClickedOutside
}) => {
  const outsideAlerterRef = useOutsideAlerter(() => {
    setHasClickedOutside(true)
    setIsOpen(false);
  }, isOpen);
  return (
    <div
      ref={outsideAlerterRef}
      className="absolute z-10 mt-1 w-[400px] rounded-[4px] border bg-white px-[14px] pt-[14px] shadow-lg"
    >
      <input
        type="text"
        className="w-full rounded-[32px] border border-[rgba(102,102,102,0.22)] bg-white py-[10px] pl-[16px] pr-[18px] font-openSans text-[12px] outline-none transition-border duration-primary focus:border focus:border-secondaryAccent"
        placeholder="Search by Name or Code"
        onInput={handleInputText}
      />
      <ul className="mb-[22px] mt-[14px] max-h-60 overflow-auto bg-white">
        {options && options.length > 0 ? (
          options.map(option => (
            <li
              key={option.value}
              className="duration-250 cursor-pointer py-[8px] transition-colors hover:bg-secondary"
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
  );
};

export default Menu;
