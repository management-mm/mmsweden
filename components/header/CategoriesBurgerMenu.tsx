import clsx from 'clsx';

import SvgIcon from '@components/common/SvgIcon';

import { IconId } from '@enums/iconsSpriteId';

type CategoriesBurgerMenuProps = {
  isOpen: boolean;
};

export default function CategoriesBurgerMenu({
  isOpen,
}: CategoriesBurgerMenuProps) {
  return (
    <span className="relative flex h-[14px] w-[14px] items-center justify-center">
      <span
        className={clsx(
          'absolute transition-all duration-300 ease-in-out',
          isOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'
        )}
      >
        <SvgIcon
          iconId={IconId.Categories}
          size={{ width: 14, height: 14 }}
          className="fill-primary"
        />
      </span>

      <span
        className={clsx(
          'absolute transition-all duration-300 ease-in-out',
          isOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'
        )}
      >
        <SvgIcon
          iconId={IconId.Close}
          size={{ width: 18, height: 18 }}
          className="fill-primary"
        />
      </span>
    </span>
  );
}
