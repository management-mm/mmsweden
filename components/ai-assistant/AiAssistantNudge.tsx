'use client';

import { useEffect, useState } from 'react';

import type { Language } from 'types/aiAssistant.types';

interface Props {
  isOpen: boolean;

  language: Language;

  productId?: string | null;

  onOpen: () => void;
}

interface NudgeCopy {
  welcomeTitle: string;

  welcomeText: string;

  productTitle: string;

  productText: string;

  button: string;
}

const COPY: Record<Language, NudgeCopy> = {
  en: {
    welcomeTitle: 'Looking for equipment?',

    welcomeText:
      'I can help you search our catalogue, identify a machine from a photo or answer your questions.',

    productTitle: 'Questions about this machine?',

    productText:
      'I can explain this model, find similar equipment or research it online.',

    button: 'Ask AI',
  },

  sv: {
    welcomeTitle: 'Letar du efter utrustning?',

    welcomeText:
      'Jag kan hjälpa dig att söka i vår katalog, identifiera en maskin från ett foto eller svara på frågor.',

    productTitle: 'Frågor om den här maskinen?',

    productText:
      'Jag kan berätta mer om modellen, hitta liknande maskiner eller söka information online.',

    button: 'Fråga AI',
  },

  de: {
    welcomeTitle: 'Suchen Sie eine Maschine?',

    welcomeText:
      'Ich kann unseren Katalog durchsuchen, Maschinen anhand eines Fotos erkennen oder Ihre Fragen beantworten.',

    productTitle: 'Fragen zu dieser Maschine?',

    productText:
      'Ich kann dieses Modell erklären, ähnliche Maschinen finden oder online recherchieren.',

    button: 'KI fragen',
  },

  fr: {
    welcomeTitle: 'Vous recherchez une machine ?',

    welcomeText:
      'Je peux rechercher dans notre catalogue, identifier une machine à partir d’une photo ou répondre à vos questions.',

    productTitle: 'Des questions sur cette machine ?',

    productText:
      'Je peux vous expliquer ce modèle, trouver des machines similaires ou effectuer une recherche en ligne.',

    button: 'Demander à l’IA',
  },

  es: {
    welcomeTitle: '¿Busca una máquina?',

    welcomeText:
      'Puedo buscar en nuestro catálogo, identificar una máquina a partir de una foto o responder sus preguntas.',

    productTitle: '¿Preguntas sobre esta máquina?',

    productText:
      'Puedo explicar este modelo, encontrar máquinas similares o investigarlo en Internet.',

    button: 'Preguntar a la IA',
  },

  ru: {
    welcomeTitle: 'Ищете оборудование?',

    welcomeText:
      'Я могу найти машину в каталоге, определить оборудование по фото или ответить на ваши вопросы.',

    productTitle: 'Есть вопросы об этой машине?',

    productText:
      'Могу рассказать об этой модели, найти похожие машины или поискать информацию в интернете.',

    button: 'Спросить AI',
  },

  uk: {
    welcomeTitle: 'Шукаєте обладнання?',

    welcomeText:
      'Я можу знайти машину в каталозі, визначити обладнання за фото або відповісти на ваші запитання.',

    productTitle: 'Є питання про цю машину?',

    productText:
      'Можу розповісти про цю модель, знайти схоже обладнання або пошукати інформацію в інтернеті.',

    button: 'Запитати AI',
  },

  pl: {
    welcomeTitle: 'Szukasz maszyny?',

    welcomeText:
      'Mogę przeszukać nasz katalog, rozpoznać maszynę na zdjęciu lub odpowiedzieć na pytania.',

    productTitle: 'Masz pytania o tę maszynę?',

    productText:
      'Mogę opisać ten model, znaleźć podobne maszyny lub wyszukać informacje w internecie.',

    button: 'Zapytaj AI',
  },
};

export const AiAssistantNudge = ({
  isOpen,
  language,
  productId,
  onOpen,
}: Props) => {
  const [isVisible, setIsVisible] = useState(false);

  const isProductPage = Boolean(productId);

  const copy = COPY[language] ?? COPY.en;

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
        {/* =================================================
            CLOSE
        ================================================= */}

        <button
          type="button"
          aria-label="Close"
          onClick={handleClose}
          className="absolute top-2.5 right-3 flex h-6 w-6 items-center justify-center rounded-full text-lg leading-none text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
        >
          ×
        </button>

        {/* =================================================
            LABEL
        ================================================= */}

        <div className="text-secondary-accent mb-1 text-[10px] font-semibold tracking-[0.08em] uppercase">
          AI Assistant
        </div>

        {/* =================================================
            TITLE
        ================================================= */}

        <div className="text-[14px] leading-5 font-semibold text-neutral-900">
          {isProductPage ? copy.productTitle : copy.welcomeTitle}
        </div>

        {/* =================================================
            DESCRIPTION
        ================================================= */}

        <div className="mt-1.5 text-[12px] leading-[1.55] text-neutral-600">
          {isProductPage ? copy.productText : copy.welcomeText}
        </div>

        {/* =================================================
            CTA
        ================================================= */}

        <button
          type="button"
          onClick={handleOpen}
          className="bg-secondary-accent mt-3 rounded-full px-4 py-2 text-[11px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          {copy.button}
        </button>

        {/* =================================================
            ARROW
        ================================================= */}

        <div className="absolute right-7 -bottom-2 h-4 w-4 rotate-45 border-r border-b border-black/[0.07] bg-white" />
      </div>
    </div>
  );
};
