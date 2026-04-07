import { type DropdownIndicatorProps, components } from 'react-select';

import SvgIcon from '@components/common/SvgIcon';

import { IconId } from '@enums/iconsSpriteId';

type Props<Option> = DropdownIndicatorProps<Option, false> & {
  isMenuOpen: boolean;
};

const DropdownIndicator = <Option,>({
  isMenuOpen,
  ...props
}: Props<Option>) => {
  return (
    <components.DropdownIndicator {...props}>
      <SvgIcon
        iconId={isMenuOpen ? IconId.ArrowTop : IconId.ArrowDown}
        size={{ width: 8, height: 8 }}
      />
    </components.DropdownIndicator>
  );
};

export default DropdownIndicator;
