import type { FC } from 'react';

import clsx from 'clsx';

import SvgIcon from '@components/common/SvgIcon';

import type { ILanguageOption } from '@constants/languageOptions';

type Props = ILanguageOption & {
  variant?: 'option' | 'singleValue';
};

const LanguageOptionView: FC<Props> = ({
  iconId,
  language,
  variant = 'option',
}) => {
  return (
    <div className="flex items-center gap-[4px]">
      <SvgIcon iconId={iconId} size={{ width: 20, height: 20 }} />
      <span
        className={clsx(
          'text-[12px] font-medium uppercase',
          variant === 'singleValue'
            ? 'text-primary lg:text-secondary'
            : 'text-primary'
        )}
      >
        {language}
      </span>
    </div>
  );
};

export default LanguageOptionView;
