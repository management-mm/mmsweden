import { type ChangeEvent, type FC, useEffect, useState } from 'react';

import type { ICountryOption } from '@interfaces/ICountryOption';

import useOutsideAlerter from '@hooks/useOutsideAlerter';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@utils/cn';

interface IMenuProps extends VariantProps<typeof divVariants>,
  VariantProps<typeof inputVariants>,
  VariantProps<typeof listVariants>,
  VariantProps<typeof itemVariants> {
  labelName: 'country' | 'phone';
  handleInputText: (e: ChangeEvent<HTMLInputElement>) => void;
  options: ICountryOption[] | null;
  handleOptionClick: (option: ICountryOption) => void;
  isOpen?: boolean;
  setIsOpen?: (value: boolean) => void;
  setHasClickedOutside?: (value: boolean) => void;
}

const divVariants = cva('mt-1', {
  variants: {
    intent: {
      desktop: 'absolute z-10 w-[600px] rounded-[4px] border bg-white px-[14px] pt-[14px] shadow-lg',
      mobile: 'z-10 w-full',
    },
  }
});

const inputVariants = cva(
  'rounded-[32px] border border-[rgba(102,102,102,0.22)] py-[10px] pl-[16px] pr-[18px] font-openSans text-[12px] outline-none transition-border duration-primary focus:border focus:border-secondaryAccent',
  {
    variants: {
    intent: {
      desktop: 'w-full',
      mobile: 'w-[calc(100%-50px)]',
    },
  }
  }
);

const listVariants = cva(
  'overflow-auto',
  {
    variants: {
    intent: {
      desktop: 'mb-[22px] mt-[14px] max-h-60 bg-white',
      mobile: 'my-[14px] max-h-[calc(70vh)] scrollbar-none',
    },
  }
  }
);

const itemVariants = cva(
  'overflow-auto',
  {
    variants: {
    intent: {
      desktop: 'duration-250 cursor-pointer py-[8px] transition-colors hover:bg-secondary',
      mobile: 'border-t p-2',
    },
  }
  }
);

const Menu: FC<IMenuProps> = ({
  labelName,
  handleInputText,
  options,
  handleOptionClick,
  isOpen,
  setIsOpen,
  setHasClickedOutside,
  intent
}) => {

  const outsideAlerterRef = useOutsideAlerter(() => {
    setHasClickedOutside?.(true);
    setIsOpen?.(false);
  }, isOpen ?? false);

  const [visibleCountries, setVisibleCountries] = useState<ICountryOption[]>(
    []
  );
  const [hasMore, setHasMore] = useState(true);
  const pageSize = intent === 'mobile' ? 20 : 10;

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
      className={cn(divVariants({ intent }))}
    >
      <input
        type="text"
        className={cn(inputVariants({ intent }))}
        placeholder="Search by Name or Code"
        onInput={handleInputText}
      />
      <ul
        id={labelName}
        className={cn(listVariants({ intent }))}
      >
        {options && options.length > 0 ? (
          visibleCountries.map((option, index) => (
            <li
              key={index}
              className={cn(itemVariants({ intent }))}
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
