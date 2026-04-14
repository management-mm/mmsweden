import { type FC, type ReactNode } from 'react';
import ReactDOM from 'react-dom';

import SvgIcon from './SvgIcon';

import { cn } from '@utils/cn';

import { IconId } from '@enums/iconsSpriteId';

interface IStatusModalProps {
  children: ReactNode;
  title: string;
  handleToggleMenu?: () => void;
  className?: string;
}

const StatusModal: FC<IStatusModalProps> = ({
  children,
  title,
  handleToggleMenu,
  className,
}) => {
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  const modalContent = (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-[rgba(27,27,27,0.7)]">
      <div
        className={cn(
          'relative flex min-h-[200px] flex-col items-start rounded-[16px] bg-white px-[40px] py-[40px]',
          className
        )}
      >
        <p className="mb-auto font-semibold">{title}</p>

        {children}

        <button
          type="button"
          onClick={() => {
            handleToggleMenu?.();
          }}
          className="absolute top-[16px] right-[16px]"
        >
          <SvgIcon iconId={IconId.Close} size={{ width: 28, height: 28 }} />
        </button>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, modalRoot);
};

export default StatusModal;
