import type { FC } from 'react';

import SvgIcon from '@components/common/SvgIcon';

import type { ILanguageOption } from '@constants/languageOptions';

const LanguageOption: FC<ILanguageOption & { isSingleValue?: boolean }> = ({
  iconId,
  language,
  isSingleValue,
}) => {
  return (
    <div className="flex items-center gap-[4px]">
      <SvgIcon iconId={iconId} size={{ width: 20, height: 20 }} />
      <span
        className={`text-[12px] font-medium uppercase ${
          isSingleValue ? 'text-secondary' : 'text-primary'
        }`}
      >
        {language}
      </span>
    </div>
  );
};

export default LanguageOption;
