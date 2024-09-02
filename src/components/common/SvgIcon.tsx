import type { FC } from 'react';

import type { IconId } from 'enums/iconsSpriteId';

import sprite from '@assets/images/icons.svg';

interface ISvgIconProps {
  id?: string;
  className?: string;
  size: { width: number; height: number };
  iconId: IconId;
}

const SvgIcon: FC<ISvgIconProps> = ({ id, className, iconId, size }) => {
  return (
    <svg id={id} className={className} width={size.width} height={size.height}>
      <use href={sprite + iconId}></use>
    </svg>
  );
};

export default SvgIcon;
