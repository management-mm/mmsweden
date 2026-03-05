'use client';

import { type FC } from 'react';

import StatusModal from '@components/common/StatusModal';

interface IMessageDeleteOrSoldProps {
  title: string;
  isOpen: boolean;
  onYes: () => void;
  onNo: () => void;
}

const MessageDeleteOrSold: FC<IMessageDeleteOrSoldProps> = ({
  title,
  isOpen,
  onYes,
  onNo,
}) => {
  if (!isOpen) return null;

  return (
    <StatusModal title={title} handleToggleMenu={onNo}>
      <div className="flex w-full gap-[10px]">
        <button
          type="button"
          onClick={onYes}
          className="w-[calc((100%-10px)/2)] rounded-[32px] border border-red-900 py-[10px] text-center font-semibold text-red-900"
        >
          Yes
        </button>
        <button
          type="button"
          onClick={onNo}
          className="text-secondary w-[calc((100%-10px)/2)] rounded-[32px] bg-red-900 py-[10px] text-center font-semibold"
        >
          No
        </button>
      </div>
    </StatusModal>
  );
};

export default MessageDeleteOrSold;
