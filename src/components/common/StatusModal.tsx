import { type FC, type ReactNode } from 'react';
import ReactDOM from 'react-dom';

import SvgIcon from './SvgIcon';

import { IconId } from '@enums/iconsSpriteId';

interface IStatusModalProps {
  children: ReactNode;
  title: string;
  handleToggleMenu?: () => void;
}

const StatusModal: FC<IStatusModalProps> = ({
  children,
  title,
  handleToggleMenu,
}) => {
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  const modalContent = (
    <div className="overlay fixed left-0 top-0 z-30 flex h-full w-full items-center justify-center bg-[rgba(27,27,27,0.7)]">
      <div className="fixed z-20 flex h-[200px] flex-col items-start rounded-[16px] bg-white px-[40px] py-[40px]">
        <p className="mb-auto font-semibold">{title}</p>
        {children}{' '}
        <button
          type="button"
          onClick={() => {
            if (handleToggleMenu) handleToggleMenu();
          }}
          className="absolute right-[16px] top-[16px]"
        >
          <SvgIcon iconId={IconId.Close} size={{ width: 28, height: 28 }} />
        </button>
      </div>
    </div>
  );
  return ReactDOM.createPortal(modalContent, modalRoot);
};

export default StatusModal;
