import type { FC } from 'react';

import SvgIcon from '@components/common/SvgIcon';

import type { ILanguageOption } from '@constants/languageOptions';

const LanguageOption: FC<ILanguageOption> = ({ iconId, language }) => {
  return (
    <div className="flex items-center justify-center gap-[4px]">
      <SvgIcon iconId={iconId} size={{ width: 20, height: 20 }} />
      <span className="text-primary text-[12px] font-medium uppercase">
        {language}
      </span>
    </div>
  );
};

export default LanguageOption;
