'use client';

import { type FC, useEffect, useMemo, useState } from 'react';

import type { ICountryOption } from '@interfaces/ICountryOption';
import { type VariantProps, cva } from 'class-variance-authority';
import { useTranslations } from 'next-intl';

import useOutsideAlerter from '@hooks/useOutsideAlerter';

import { cn } from '@utils/cn';

import { Placeholder } from '@enums/i18nConstants';

const divVariants = cva('mt-1', {
  variants: {
    intent: {
      desktop:
        'absolute z-10 w-[600px] rounded-[4px] border border-[#e5e7eb] bg-white px-[14px] pt-[14px] shadow-lg',
      mobile: 'z-10 w-full',
    },
  },
});

const inputVariants = cva(
  'rounded-[32px] border border-[rgba(102,102,102,0.22)] py-[10px] pl-[16px] pr-[18px] font-openSans text-[12px] outline-none transition-border duration-primary focus:border focus:border-secondary-accent',
  {
    variants: {
      intent: {
        desktop: 'w-full',
        mobile: 'w-[calc(100%-50px)]',
      },
    },
  }
);

const listVariants = cva('', {
  variants: {
    intent: {
      desktop: 'mb-[22px] mt-[14px] max-h-60 overflow-auto bg-white',
      mobile:
        'my-[14px] max-h-[calc(70vh)] overflow-auto overscroll-contain scrollbar-none',
    },
  },
});

const itemVariants = cva('', {
  variants: {
    intent: {
      desktop:
        'duration-250 cursor-pointer py-[8px] transition-colors hover:bg-secondary',
      mobile: 'border-t border-[#e5e7eb] p-2',
    },
  },
});

interface IMenuProps
  extends
    VariantProps<typeof divVariants>,
    VariantProps<typeof inputVariants>,
    VariantProps<typeof listVariants>,
    VariantProps<typeof itemVariants> {
  labelName: 'country' | 'phone';
  handleInputText: (value: string) => void;
  options: ICountryOption[] | null;
  handleOptionClick: (option: ICountryOption) => void;
  isOpen?: boolean;
  setIsOpen?: (value: boolean) => void;
  setHasClickedOutside?: (value: boolean) => void;
}

const Menu: FC<IMenuProps> = ({
  labelName,
  handleInputText,
  options,
  handleOptionClick,
  isOpen,
  setIsOpen,
  setHasClickedOutside,
  intent,
}) => {
  const t = useTranslations();

  const outsideAlerterRef = useOutsideAlerter(() => {
    setHasClickedOutside?.(true);
    setIsOpen?.(false);
  }, isOpen ?? false);

  const pageSize = intent === 'mobile' ? 20 : 10;

  const [visibleCountries, setVisibleCountries] = useState<ICountryOption[]>(
    []
  );
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    if (!options || options.length === 0) {
      setVisibleCountries([]);
      setHasMore(false);
      return;
    }

    const firstPage = options.slice(0, pageSize);
    setVisibleCountries(firstPage);
    setHasMore(firstPage.length < options.length);
  }, [options, pageSize]);

  const loadMore = () => {
    if (!hasMore || !options) return;

    const nextCount = visibleCountries.length + pageSize;
    const next = options.slice(0, nextCount);

    setVisibleCountries(next);
    setHasMore(next.length < options.length);
  };

  const getKey = useMemo(() => {
    return (option: ICountryOption, index: number) => {
      const callingCode = option?.label?.props?.callingCode ?? '';
      const name = option?.label?.props?.name ?? option.value ?? '';
      return `${labelName}-${callingCode}-${name}-${index}`;
    };
  }, [labelName]);

  return (
    <div ref={outsideAlerterRef} className={cn(divVariants({ intent }))}>
      <input
        type="text"
        className={cn(inputVariants({ intent }))}
        placeholder={t(Placeholder.Search)}
        onChange={e => handleInputText(e.target.value)}
      />

      <ul
        id={labelName}
        className={cn(listVariants({ intent }))}
        onScroll={e => {
          const el = e.currentTarget;
          if (el.scrollTop + el.clientHeight >= el.scrollHeight - 100) {
            loadMore();
          }
        }}
      >
        {visibleCountries.length > 0 ? (
          visibleCountries.map((option, index) => (
            <li
              key={getKey(option, index)}
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
