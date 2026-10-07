import SvgIcon from '@components/common/SvgIcon';

import { IconId } from '@enums/iconsSpriteId';

interface Props {
  onFindEquipment: () => void;
  onBrowseCategories: () => void;
  onCompanyQuestion: () => void;
}

export const AiWelcomeActions = ({
  onFindEquipment,
  onBrowseCategories,
  onCompanyQuestion,
}: Props) => {
  return (
    <div className="flex flex-col items-center px-5 py-7 text-center">
      {/* BOT */}

      <div className="bg-secondary-accent mb-4 flex h-16 w-16 items-center justify-center rounded-full">
        <SvgIcon
          iconId={IconId.MainBot}
          size={{
            width: 44,
            height: 44,
          }}
        />
      </div>

      {/* TITLE */}

      <h2 className="text-lg font-semibold text-gray-900">How can I help?</h2>

      {/* DESCRIPTION */}

      <p className="mt-2 max-w-[300px] text-sm leading-5 text-gray-500">
        I can help you find equipment, browse our catalogue or answer questions
        about Meat Machines Sweden.
      </p>

      {/* ACTIONS */}

      <div className="mt-6 grid w-full gap-2">
        <button
          type="button"
          onClick={onFindEquipment}
          className="rounded-xl border border-gray-200 px-4 py-3 text-left text-sm font-medium transition hover:border-gray-300 hover:bg-gray-50"
        >
          Find equipment
        </button>

        <button
          type="button"
          onClick={onBrowseCategories}
          className="rounded-xl border border-gray-200 px-4 py-3 text-left text-sm font-medium transition hover:border-gray-300 hover:bg-gray-50"
        >
          Browse categories
        </button>

        <button
          type="button"
          onClick={onCompanyQuestion}
          className="rounded-xl border border-gray-200 px-4 py-3 text-left text-sm font-medium transition hover:border-gray-300 hover:bg-gray-50"
        >
          About Meat Machines Sweden
        </button>
      </div>
    </div>
  );
};
