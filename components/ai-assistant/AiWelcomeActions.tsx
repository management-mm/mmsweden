'use client';

import { useTranslations } from 'next-intl';

import SvgIcon from '@components/common/SvgIcon';

import { AiAssistantText } from '@enums/i18nConstants';
import { IconId } from '@enums/iconsSpriteId';

interface Props {
  onFindEquipment: () => void;
  onBrowseCategories: () => void;
  onCompanyQuestion: () => void;
}

interface WelcomeActionProps {
  iconId: IconId;
  title: string;
  description: string;
  onClick: () => void;
}

const WelcomeAction = ({
  iconId,
  title,
  description,
  onClick,
}: WelcomeActionProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-2xl border border-black/[0.08] bg-white px-3 py-2.5 text-left transition-all duration-200 hover:border-black/[0.14] hover:bg-neutral-50 active:scale-[0.99]"
    >
      <div className="bg-secondary-accent flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
        <SvgIcon
          iconId={iconId}
          size={{
            width: 20,
            height: 20,
          }}
          className="fill-white text-white"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-[13px] leading-5 font-semibold text-neutral-900">
          {title}
        </div>

        <div className="mt-0.5 text-[10px] leading-[1.35] text-neutral-500">
          {description}
        </div>
      </div>

      <span
        aria-hidden="true"
        className="text-secondary-accent shrink-0 text-[23px] leading-none transition-transform group-hover:translate-x-0.5"
      >
        ›
      </span>
    </button>
  );
};

export const AiWelcomeActions = ({
  onFindEquipment,
  onBrowseCategories,
  onCompanyQuestion,
}: Props) => {
  const t = useTranslations();

  return (
    <div className="flex w-full flex-col items-center px-4 py-4 text-center">
      {/* BOT */}

      <div className="bg-secondary-accent mb-3 flex h-14 w-14 items-center justify-center rounded-full">
        <SvgIcon
          iconId={IconId.MainBot}
          size={{
            width: 38,
            height: 38,
          }}
        />
      </div>

      {/* TITLE */}

      <h2 className="text-[17px] font-semibold text-neutral-900">
        {t(AiAssistantText.WelcomeTitle)}
      </h2>

      {/* DESCRIPTION */}

      <p className="mt-1.5 max-w-[300px] text-[12px] leading-[1.45] text-neutral-500">
        {t(AiAssistantText.WelcomeDescription)}
      </p>

      {/* ACTIONS */}

      <div className="mt-4 flex w-full flex-col gap-2.5">
        <WelcomeAction
          iconId={IconId.Search}
          title={t(AiAssistantText.FindEquipment)}
          description={t(AiAssistantText.FindEquipmentDescription)}
          onClick={onFindEquipment}
        />

        <WelcomeAction
          iconId={IconId.Categories}
          title={t(AiAssistantText.BrowseCategories)}
          description={t(AiAssistantText.BrowseCategoriesDescription)}
          onClick={onBrowseCategories}
        />

        <WelcomeAction
          iconId={IconId.Building}
          title={t(AiAssistantText.AboutCompany)}
          description={t(AiAssistantText.AboutCompanyDescription)}
          onClick={onCompanyQuestion}
        />
      </div>
    </div>
  );
};
