import type { FC } from 'react';

import type { IconId } from 'enums/iconsSpriteId';

interface ISvgIconProps {
  id?: string;
  className?: string;
  size: { width: number; height: number };
  iconId: IconId;
}

const SvgIcon: FC<ISvgIconProps> = ({ id, className, iconId, size }) => {
  return (
    <svg
      id={id}
      className={className}
      width={size.width}
      height={size.height}
      aria-hidden="true"
    >
      <use href={iconId} />
    </svg>
  );
};

export default SvgIcon;
