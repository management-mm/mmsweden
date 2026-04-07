import { type OptionProps, components } from 'react-select';

import LanguageOptionView from './LanguageOptionView';

import type { ILanguageOption } from '@constants/languageOptions';

const CustomOption = (props: OptionProps<ILanguageOption, false>) => {
  return (
    <components.Option {...props}>
      <LanguageOptionView {...props.data} variant="option" />
    </components.Option>
  );
};

export default CustomOption;
