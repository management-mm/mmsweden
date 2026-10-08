'use client';

import { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';

import { AiAssistantText } from '@enums/i18nConstants';

interface Props {
  isOpen: boolean;

  productId?: string | null;

  onOpen: () => void;
}

export const AiAssistantNudge = ({ isOpen, productId, onOpen }: Props) => {
  const t = useTranslations();

  const [isVisible, setIsVisible] = useState(false);

  const isProductPage = Boolean(productId);

  // =========================================================
  // SHOW NUDGE
  // =========================================================

  useEffect(() => {
    setIsVisible(false);

    if (isOpen) {
      return;
    }

    // =====================================================
    // PRODUCT PAGE
    // =====================================================

    if (productId) {
      const storageKey = `ai-assistant-product-nudge:${productId}`;

      const alreadyShown = sessionStorage.getItem(storageKey);

      if (alreadyShown) {
        return;
      }

      const timer = window.setTimeout(() => {
        setIsVisible(true);

        sessionStorage.setItem(storageKey, '1');
      }, 9000);

      return () => {
        window.clearTimeout(timer);
      };
    }

    // =====================================================
    // NORMAL PAGE
    // =====================================================

    const interacted = sessionStorage.getItem('ai-assistant-interacted');

    if (interacted) {
      return;
    }

    const welcomeSeen = localStorage.getItem('ai-assistant-welcome-seen');

    if (welcomeSeen) {
      return;
    }

    const timer = window.setTimeout(() => {
      setIsVisible(true);

      localStorage.setItem('ai-assistant-welcome-seen', '1');
    }, 7000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isOpen, productId]);

  // =========================================================
  // AUTO HIDE
  // =========================================================

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const timer = window.setTimeout(() => {
      setIsVisible(false);
    }, 15000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isVisible]);

  // =========================================================
  // OPEN AI
  // =========================================================

  const handleOpen = () => {
    sessionStorage.setItem('ai-assistant-interacted', '1');

    setIsVisible(false);

    onOpen();
  };

  // =========================================================
  // CLOSE NUDGE
  // =========================================================

  const handleClose = () => {
    setIsVisible(false);
  };

  // =========================================================
  // HIDDEN
  // =========================================================

  if (!isVisible || isOpen) {
    return null;
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="fixed right-4 bottom-[118px] z-[9998] w-[calc(100vw-32px)] max-w-[320px] sm:right-6">
      <div className="relative rounded-2xl border border-black/[0.07] bg-white p-4 pr-9 shadow-[0_12px_40px_rgba(0,0,0,0.16)]">
        {/* CLOSE */}

        <button
          type="button"
          aria-label={t(AiAssistantText.Close)}
          onClick={handleClose}
          className="absolute top-2.5 right-3 flex h-6 w-6 items-center justify-center rounded-full text-lg leading-none text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
        >
          ×
        </button>

        {/* LABEL */}

        <div className="text-secondary-accent mb-1 text-[10px] font-semibold tracking-[0.08em] uppercase">
          {t(AiAssistantText.AssistantLabel)}
        </div>

        {/* TITLE */}

        <div className="text-[14px] leading-5 font-semibold text-neutral-900">
          {isProductPage
            ? t(AiAssistantText.NudgeProductTitle)
            : t(AiAssistantText.NudgeWelcomeTitle)}
        </div>

        {/* DESCRIPTION */}

        <div className="mt-1.5 text-[12px] leading-[1.55] text-neutral-600">
          {isProductPage
            ? t(AiAssistantText.NudgeProductText)
            : t(AiAssistantText.NudgeWelcomeText)}
        </div>

        {/* CTA */}

        <button
          type="button"
          onClick={handleOpen}
          className="bg-secondary-accent mt-3 rounded-full px-4 py-2 text-[11px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          {t(AiAssistantText.NudgeButton)}
        </button>

        {/* ARROW */}

        <div className="absolute right-7 -bottom-2 h-4 w-4 rotate-45 border-r border-b border-black/[0.07] bg-white" />
      </div>
    </div>
  );
};
