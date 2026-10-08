'use client';

import { useEffect, useRef, useState } from 'react';

import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import type { Language } from 'types/aiAssistant.types';

import { AiAssistantHeader } from './AiAssistantHeader';
import { AiAssistantNudge } from './AiAssistantNudge';
import { AiCategoryBrowser } from './AiCategoryBrowser';
import { AiInput, AiInputHandle } from './AiInput';
import { AiMessages } from './AiMessages';
import { AiWelcomeActions } from './AiWelcomeActions';

import SvgIcon from '@components/common/SvgIcon';

import { useAiAssistant } from '@hooks/useAiAssistant';

import { IconId } from '@enums/iconsSpriteId';

export const AiAssistant = () => {
  // =========================================================
  // CURRENT SITE LANGUAGE
  // =========================================================

  const locale = useLocale() as Language;

  // =========================================================
  // STATE
  // =========================================================

  const [isOpen, setIsOpen] = useState(false);

  type AssistantView = 'welcome' | 'categories' | 'chat';

  const [activeView, setActiveView] = useState<AssistantView>('welcome');

  const previousViewRef = useRef<'welcome' | 'chat'>('welcome');

  // =========================================================
  // CURRENT PRODUCT PAGE
  // =========================================================

  const pathname = usePathname();

  const [currentProductId, setCurrentProductId] = useState<string | null>(null);

  useEffect(() => {
    const readCurrentProduct = () => {
      const element = document.querySelector<HTMLElement>(
        '[data-ai-current-product-id]'
      );

      const productId =
        element?.getAttribute('data-ai-current-product-id')?.trim() || null;

      console.log('AI PRODUCT MARKER:', element);

      console.log('AI CURRENT PRODUCT:', productId);

      setCurrentProductId(productId);
    };

    readCurrentProduct();

    const timer1 = window.setTimeout(readCurrentProduct, 100);

    const timer2 = window.setTimeout(readCurrentProduct, 500);

    const observer = new MutationObserver(() => {
      readCurrentProduct();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      window.clearTimeout(timer1);

      window.clearTimeout(timer2);

      observer.disconnect();
    };
  }, [pathname]);

  const contextualProductRef = useRef<string | null>(null);

  // =========================================================
  // INPUT REF
  // =========================================================

  const aiInputRef = useRef<AiInputHandle>(null);

  // =========================================================
  // AI HOOK
  // =========================================================

  const {
    messages,
    isLoading,
    error,
    currentLanguage,
    sendMessage,
    sendPhoto,
  } = useAiAssistant({
    language: locale,
  });

  // =========================================================
  // SEND MESSAGE
  // =========================================================

  const openWelcome = () => {
    setActiveView('welcome');
  };

  const openChat = () => {
    setActiveView('chat');
  };

  const openCategories = () => {
    previousViewRef.current = activeView === 'chat' ? 'chat' : 'welcome';

    setActiveView('categories');
  };

  const closeCategories = () => {
    setActiveView(previousViewRef.current);
  };

  const handleSendMessage = (message: string, productId?: string) => {
    setActiveView('chat');

    return sendMessage(message, productId);
  };

  // =========================================================
  // PRODUCT DETAILS PROMPT
  // =========================================================

  const getProductDetailsPrompt = () => {
    const prompts: Record<Language, string> = {
      en: 'Tell me about this machine',

      sv: 'Berätta om den här maskinen',

      de: 'Erzähle mir mehr über diese Maschine',

      fr: 'Parlez-moi de cette machine',

      es: 'Cuéntame sobre esta máquina',

      ru: 'Расскажи об этой машине',

      uk: 'Розкажи про цю машину',

      pl: 'Opowiedz mi o tej maszynie',
    };

    return prompts[currentLanguage] ?? prompts.en;
  };

  // =========================================================
  // MARK USER INTERACTION
  // =========================================================

  const markAssistantInteracted = () => {
    if (typeof window === 'undefined') {
      return;
    }

    sessionStorage.setItem('ai-assistant-interacted', '1');
  };

  // =========================================================
  // ACTIVATE PRODUCT FROM CURRENT PAGE
  // =========================================================

  const activateCurrentPageProduct = () => {
    if (!currentProductId) {
      return;
    }

    if (contextualProductRef.current === currentProductId) {
      return;
    }

    contextualProductRef.current = currentProductId;

    void handleSendMessage(getProductDetailsPrompt(), currentProductId);
  };

  // =========================================================
  // OPEN ASSISTANT
  // =========================================================

  const handleOpenAssistant = () => {
    markAssistantInteracted();

    setIsOpen(true);

    activateCurrentPageProduct();
  };

  // =========================================================
  // TOGGLE ASSISTANT
  // =========================================================

  const handleToggleAssistant = () => {
    if (isOpen) {
      setIsOpen(false);

      return;
    }

    handleOpenAssistant();
  };

  // =========================================================
  // CLOSED
  // =========================================================

  if (!isOpen) {
    return (
      <>
        <AiAssistantNudge
          isOpen={isOpen}
          language={currentLanguage}
          productId={currentProductId}
          onOpen={handleOpenAssistant}
        />

        <button
          type="button"
          aria-label="Open AI Assistant"
          onClick={handleToggleAssistant}
          className="bg-secondary-accent fixed right-8 bottom-8 z-[9999] flex h-20 w-20 items-center justify-center rounded-full border-2 border-white shadow-[0_14px_45px_rgba(0,0,0,0.20)] transition-all duration-200 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_18px_55px_rgba(0,0,0,0.25)] active:scale-95"
        >
          {/* MAIN BOT */}

          <SvgIcon
            iconId={IconId.MainBot}
            size={{
              width: 50,
              height: 50,
            }}
          />

          {/* ONLINE STATUS */}

          <span className="absolute right-0 bottom-0 h-6 w-6 rounded-full border-[4px] border-white bg-green-500" />
        </button>
      </>
    );
  }

  // =========================================================
  // OPEN
  // =========================================================

  return (
    <div className="fixed right-6 bottom-6 isolate z-[9999] flex h-[680px] max-h-[calc(100vh-32px)] w-[420px] max-w-[calc(100vw-24px)] flex-col overflow-hidden rounded-[28px] border border-black/5 bg-white shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
      {/* ===================================================
          HEADER
      =================================================== */}

      <AiAssistantHeader onClose={() => setIsOpen(false)} />

      <div className="flex items-center gap-1.5 border-b border-black/[0.05] bg-white px-3 py-2">
        <button
          type="button"
          onClick={openWelcome}
          className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors ${
            activeView === 'welcome'
              ? 'bg-secondary-accent text-white'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          } `}
        >
          Home
        </button>

        <button
          type="button"
          onClick={openCategories}
          className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors ${
            activeView === 'categories'
              ? 'bg-secondary-accent text-white'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          } `}
        >
          Categories
        </button>

        {messages.length > 0 && (
          <button
            type="button"
            onClick={openChat}
            className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors ${
              activeView === 'chat'
                ? 'bg-secondary-accent text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            } `}
          >
            Chat
          </button>
        )}
      </div>

      {/* ===================================================
          CONTENT
      =================================================== */}

      <div className="flex min-h-0 flex-1 flex-col">
        {activeView === 'categories' ? (
          <AiCategoryBrowser
            language={currentLanguage}
            onClose={closeCategories}
            onSelectProduct={product => {
              void handleSendMessage(getProductDetailsPrompt(), product._id);
            }}
          />
        ) : activeView === 'welcome' ? (
          <AiWelcomeActions
            onFindEquipment={() => handleSendMessage('Help me find equipment')}
            onBrowseCategories={openCategories}
            onCompanyQuestion={() =>
              handleSendMessage('Tell me about Meat Machines Sweden')
            }
          />
        ) : (
          <AiMessages
            messages={messages}
            isLoading={isLoading}
            onSelectProduct={product =>
              handleSendMessage(getProductDetailsPrompt(), product._id)
            }
          />
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="border-t border-red-100 bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </div>
        )}
      </div>

      {/* ===================================================
          INPUT
      =================================================== */}

      <AiInput
        ref={aiInputRef}
        disabled={isLoading}
        onSend={handleSendMessage}
        onPhoto={sendPhoto}
      />
    </div>
  );
};
