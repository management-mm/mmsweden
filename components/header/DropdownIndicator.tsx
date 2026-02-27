import { components } from 'react-select';
import type { DropdownIndicatorProps } from 'react-select';

import type { ILanguageOption } from 'interfaces/ILanguageOption';

import SvgIcon from '@components/common/SvgIcon';

import { IconId } from '@enums/iconsSpriteId';

const DropdownIndicator = (
  props: DropdownIndicatorProps<ILanguageOption, false> & {
    isMenuOpen: boolean;
  }
) => {
  return (
    <components.DropdownIndicator {...props}>
      <SvgIcon
        iconId={props.isMenuOpen ? IconId.ArrowTop : IconId.ArrowDown}
        size={{ width: 8, height: 8 }}
      />
    </components.DropdownIndicator>
  );
};

export default DropdownIndicator;
