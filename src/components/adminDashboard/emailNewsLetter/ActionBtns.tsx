import DownloadTxtButton from './DownloadTxtButton';
import ResetButton from './ResetButton';

const ActionBtns = () => {
  return (
    <div className="flex items-center justify-end gap-[12px] lg:ml-auto">
      <ResetButton />
      <DownloadTxtButton />
    </div>
  );
};

export default ActionBtns;
