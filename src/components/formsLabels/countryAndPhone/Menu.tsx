import { type ChangeEvent, type FC, useEffect, useState } from 'react';

import type { ICountryOption } from '@interfaces/ICountryOption';
import { nanoid } from 'nanoid';

import useOutsideAlerter from '@hooks/useOutsideAlerter';

interface IMenuProps {
  labelName: 'country' | 'phone';
  handleInputText: (e: ChangeEvent<HTMLInputElement>) => void;
  options: ICountryOption[] | null;
  handleOptionClick: (option: ICountryOption) => void;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  setHasClickedOutside: (value: boolean) => void;
}

const Menu: FC<IMenuProps> = ({
  labelName,
  handleInputText,
  options,
  handleOptionClick,
  isOpen,
  setIsOpen,
  setHasClickedOutside,
}) => {
  const outsideAlerterRef = useOutsideAlerter(() => {
    setHasClickedOutside(true);
    setIsOpen(false);
  }, isOpen);

  const [visibleCountries, setVisibleCountries] = useState<ICountryOption[]>(
    []
  );
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 10;

  useEffect(() => {
    if (options) {
      setVisibleCountries(options.slice(0, pageSize));
    }
  }, [options]);

  const loadMore = () => {
    if (!hasMore || !options) return;

    const nextItems = visibleCountries.length + pageSize;
    if (nextItems >= options.length) {
      setHasMore(false);
      setVisibleCountries(options);
    } else {
      setVisibleCountries(options.slice(0, nextItems));
    }
  };

  useEffect(() => {
    const selector = document.querySelector(`#${labelName}`) as HTMLElement;
    if (!selector) return;

    const handleScroll = () => {
      if (
        selector.scrollTop + selector.clientHeight >=
        selector.scrollHeight - 100
      ) {
        loadMore();
      }
    };

    selector.addEventListener('scroll', handleScroll);
    return () => selector.removeEventListener('scroll', handleScroll);
  }, [labelName, visibleCountries, options]);

  return (
    <div
      ref={outsideAlerterRef}
      className="absolute z-10 mt-1 w-[600px] rounded-[4px] border bg-white px-[14px] pt-[14px] shadow-lg"
    >
      <input
        type="text"
        className="w-full rounded-[32px] border border-[rgba(102,102,102,0.22)] bg-white py-[10px] pl-[16px] pr-[18px] font-openSans text-[12px] outline-none transition-border duration-primary focus:border focus:border-secondaryAccent"
        placeholder="Search by Name or Code"
        onInput={handleInputText}
      />
      <ul
        id={labelName}
        className="mb-[22px] mt-[14px] max-h-60 overflow-auto bg-white"
      >
        {options && options.length > 0 ? (
          visibleCountries.map(option => (
            <li
              key={nanoid()}
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
