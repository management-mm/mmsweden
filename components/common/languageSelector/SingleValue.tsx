import { type SingleValueProps, components } from 'react-select';

import LanguageOptionView from './LanguageOptionView';

import type { ILanguageOption } from '@constants/languageOptions';

const CustomSingleValue = (props: SingleValueProps<ILanguageOption, false>) => {
  return (
    <components.SingleValue {...props}>
      <LanguageOptionView {...props.data} variant="singleValue" />
    </components.SingleValue>
  );
};

export default CustomSingleValue;
