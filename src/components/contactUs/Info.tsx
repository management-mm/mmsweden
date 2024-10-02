import type { FC, ReactNode } from 'react';

import SvgIcon from '@components/common/SvgIcon';

import { IconId } from '@enums/iconsSpriteId';

interface IInfoProps {
  children: ReactNode;
}

const Info: FC<IInfoProps> = ({ children }) => {
  return (
    <div className="mb-[12px] flex gap-[14px] rounded-[4px] bg-secondary px-[16px] py-[10px] lg:py-[22px]">
      <SvgIcon
        className="flex-shrink-0 fill-secondaryAccent"
        iconId={IconId.Info}
        size={{ width: 18, height: 18 }}
      />
      <em className="font-openSans text-[14px] not-italic">{children}</em>
    </div>
  );
};

export default Info;
