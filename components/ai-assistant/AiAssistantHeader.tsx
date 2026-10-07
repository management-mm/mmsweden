import SvgIcon from '@components/common/SvgIcon';

import { IconId } from '@enums/iconsSpriteId';

interface Props {
  onClose: () => void;
}

export const AiAssistantHeader = ({ onClose }: Props) => {
  return (
    <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="bg-secondary-accent flex h-11 w-11 items-center justify-center rounded-full">
          <SvgIcon
            iconId={IconId.MainBot}
            size={{
              width: 30,
              height: 30,
            }}
          />
        </div>

        <div>
          <div className="text-sm font-semibold text-neutral-900">
            AI Assistant
          </div>

          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-neutral-500">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Online
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-900"
      >
        ×
      </button>
    </div>
  );
};
