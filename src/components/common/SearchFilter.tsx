import { type ChangeEvent, type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import * as _ from 'lodash';

import SvgIcon from '@components/common/SvgIcon';

import { Placeholder } from '@enums/i18nConstants';
import { IconId } from '@enums/iconsSpriteId';

interface ISearchFilterProps {
  keyword: string;
  setKeyword: (value: string) => void;
}

const SearchFilter: FC<ISearchFilterProps> = ({ keyword, setKeyword }) => {
  const { t } = useTranslation();

  const [isEmptyValue, setIsEmptyValue] = useState<boolean>(true);

  const handleInputText = _.debounce((e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (e.target.value) {
      setIsEmptyValue(false);
      return;
    }
    setIsEmptyValue(true);
  });

  return (
    <div className="relative mb-[12px]">
      <input
        type="text"
        placeholder={t(Placeholder.Search)}
        className="w-full rounded-[32px] border border-neutral px-[22px] py-[8px] pl-[14px] text-[12px] outline-none transition-border duration-primary focus:border focus:border-secondaryAccent"
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
        onInput={handleInputText}
      />
      {isEmptyValue ? (
        <SvgIcon
          className="absolute bottom-[12px] right-[18px] fill-desc"
          iconId={IconId.Search}
          size={{ width: 14, height: 14 }}
        />
      ) : (
        <button
          type="reset"
          onClick={() => {
            setIsEmptyValue(true);
            setKeyword('');
          }}
        >
          <SvgIcon
            className="absolute bottom-[12px] right-[18px] fill-desc"
            iconId={IconId.Reset}
            size={{ width: 12, height: 12 }}
          />
        </button>
      )}
    </div>
  );
};

export default SearchFilter;
