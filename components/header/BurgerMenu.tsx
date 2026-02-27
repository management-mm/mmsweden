import type { FC } from 'react';

import SvgIcon from '@components/common/SvgIcon';

import { IconId } from '@enums/iconsSpriteId';

interface IBurgerMenuProps {
  handleToggleMobileMenu: () => void;
}

const BurgerMenu: FC<IBurgerMenuProps> = ({ handleToggleMobileMenu }) => {
  return (
    <button className="lg:hidden" onClick={handleToggleMobileMenu}>
      <SvgIcon iconId={IconId.Menu} size={{ width: 24, height: 24 }} />
    </button>
  );
};

export default BurgerMenu;
