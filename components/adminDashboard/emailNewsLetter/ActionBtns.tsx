import type { FC } from 'react';

import DownloadTxtButton from './DownloadTxtButton';
import ResetButton from './ResetButton';

interface IActionBtnsProps {
  dateRangeText: string;
}

const ActionBtns: FC<IActionBtnsProps> = ({ dateRangeText }) => {
  return (
    <div className="flex items-center justify-end gap-[12px] lg:ml-auto">
      <ResetButton />
      <DownloadTxtButton dateRangeText={dateRangeText} />
    </div>
  );
};

export default ActionBtns;
