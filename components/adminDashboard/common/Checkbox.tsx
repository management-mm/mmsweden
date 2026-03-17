import clsx from 'clsx';

import SvgIcon from '@components/common/SvgIcon';

import { IconId } from '@enums/iconsSpriteId';

type Props = {
  isClick: boolean;
  onClicked: () => void;
  className: string;
};

export default function Checkbox({ isClick, onClicked, className }: Props) {
  return (
    <button
      className={clsx(
        'flex h-[20px] w-[20px] cursor-pointer items-center justify-center',
        isClick ? 'bg-secondary-accent' : 'bg-desc',
        className
      )}
      type="button"
      onClick={onClicked}
    >
      <SvgIcon
        iconId={IconId.Check}
        size={{ width: 10, height: 10 }}
        className="fill-secondary"
      />
    </button>
  );
}
