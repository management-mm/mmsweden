'use client';

import { useEffect, useRef } from 'react';

import { AiChatMessage, AiProduct } from 'types/aiAssistant.types';

import { AiProductDetailsCard } from './AiProductDetailsCard';
import { AiProductList } from './AiProductList';

import SvgIcon from '@components/common/SvgIcon';

import { IconId } from '@enums/iconsSpriteId';

interface Props {
  messages: AiChatMessage[];
  isLoading: boolean;

  onSelectProduct?: (product: AiProduct) => void;
}

// =========================================================
// CLEAN MARKDOWN
// =========================================================

const cleanMessageText = (text: string): string => {
  return (
    text

      .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/gi, '$1')

      // Markdown bold
      .replace(/\*\*(.*?)\*\*/g, '$1')

      // Markdown bold
      .replace(/__(.*?)__/g, '$1')

      // Markdown code
      .replace(/`([^`]+)`/g, '$1')

      // Raw URLs
      .replace(/https?:\/\/[^\s)]+/gi, '')

      .replace(/\(\s*\)/g, '')

      // Markdown headings
      .replace(/^#{1,6}\s+/gm, '')

      // Lists
      .replace(/^\s*[-*]\s+/gm, '• ')

      .replace(/\s+([,.!?;:])/g, '$1')

      .replace(/\n{3,}/g, '\n\n')

      .trim()
  );
};

// =========================================================
// NORMAL ASSISTANT TEXT
// =========================================================

const AssistantText = ({ text }: { text: string }) => {
  const cleaned = cleanMessageText(text);

  const lines = cleaned.split('\n');

  return (
    <div className="space-y-2 break-words">
      {lines.map((line, index) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={`space-${index}`} className="h-1" />;
        }

        if (trimmed.startsWith('• ')) {
          return (
            <div key={`bullet-${index}`} className="flex items-start gap-2">
              <span className="shrink-0 text-neutral-400">•</span>

              <span>{trimmed.slice(2)}</span>
            </div>
          );
        }

        return (
          <p key={`text-${index}`} className="m-0">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
};

// =========================================================
// AI HEADER
// =========================================================

const AiMessageHeader = () => {
  return (
    <div className="mb-2 flex items-center gap-2">
      <div className="bg-secondary mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-black/[0.05]">
        <SvgIcon
          iconId={IconId.ChatBot}
          size={{
            width: 20,
            height: 20,
          }}
        />
      </div>

      <span className="text-[11px] font-medium text-neutral-400">
        AI Assistant
      </span>
    </div>
  );
};

// =========================================================
// MAIN COMPONENT
// =========================================================

export const AiMessages = ({ messages, isLoading, onSelectProduct }: Props) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto px-3 py-5">
      <div className="flex w-full flex-col gap-5">
        {messages.map(message => {
          const isUser = message.role === 'user';

          // =================================================
          // USER MESSAGE
          // =================================================

          if (isUser) {
            return (
              <div
                key={message.id}
                className="flex w-full items-end justify-end gap-2"
              >
                <div className="max-w-[80%]">
                  {message.imagePreview && (
                    <div className="mb-2 overflow-hidden rounded-2xl rounded-br-md border border-black/[0.05] bg-neutral-100">
                      <img
                        src={message.imagePreview}
                        alt="Uploaded machine"
                        className="max-h-64 w-full object-cover"
                      />
                    </div>
                  )}

                  {message.text && (
                    <div className="bg-secondary-accent rounded-[18px] rounded-br-[5px] px-4 py-3 text-[14px] leading-[1.5] text-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                      {message.text}
                    </div>
                  )}
                </div>

                <div className="bg-secondary mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-black/[0.05]">
                  <SvgIcon
                    iconId={IconId.User}
                    size={{
                      width: 16,
                      height: 16,
                    }}
                    className="fill-secondary-accent"
                  />
                </div>
              </div>
            );
          }

          // =================================================
          // AI RESPONSE DATA
          // =================================================

          const response = message.response;

          const products = response?.products ?? [];

          const isPhotoCandidates =
            response?.type === 'PHOTO_SEARCH' &&
            response?.matchType === 'VISION_CANDIDATES';

          const hasProducts =
            (response?.type === 'PRODUCTS' ||
              response?.type === 'CATEGORY_PRODUCTS' ||
              isPhotoCandidates) &&
            products.length > 0;

          const hasProductDetails =
            (response?.type === 'PRODUCT_DETAILS' ||
              response?.type === 'PHOTO_SEARCH') &&
            !!response.product;

          // =================================================
          // PRODUCT DETAILS / PRODUCT LIST
          //

          // =================================================

          if (hasProducts || hasProductDetails) {
            return (
              <div key={message.id} className="w-full">
                <AiMessageHeader />

                {/* PRODUCT DETAILS */}

                {hasProductDetails && (
                  <div className="w-full px-0">
                    <AiProductDetailsCard
                      product={response!.product!}
                      message={message.text}
                      language={response?.language ?? 'en'}
                    />
                  </div>
                )}

                {/* PRODUCT LIST */}

                {hasProducts && (
                  <div className="w-full px-0">
                    <div className="mb-2 px-1 text-[14px] leading-[1.55] text-neutral-700">
                      {isPhotoCandidates ? (
                        <>
                          I found{' '}
                          <span className="font-medium text-neutral-900">
                            {products.length}
                          </span>{' '}
                          possible matches:
                        </>
                      ) : (
                        <>
                          I found{' '}
                          <span className="font-medium text-neutral-900">
                            {response?.total ?? products.length}
                          </span>{' '}
                          matching machines.
                        </>
                      )}
                    </div>

                    <AiProductList
                      products={products}
                      total={response?.total}
                      language={response?.language ?? 'en'}
                      onSelectProduct={onSelectProduct}
                    />
                  </div>
                )}
              </div>
            );
          }

          // =================================================
          // NORMAL AI MESSAGE
          // =================================================

          return (
            <div key={message.id} className="flex w-full items-start gap-2">
              <div className="bg-secondary mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-black/[0.05]">
                <SvgIcon
                  iconId={IconId.ChatBot}
                  size={{
                    width: 20,
                    height: 20,
                  }}
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-1.5 text-[11px] font-medium text-neutral-400">
                  AI Assistant
                </div>

                <div className="max-w-[92%] min-w-0 overflow-hidden rounded-2xl rounded-tl-md border border-black/[0.04] bg-neutral-50 px-4 py-3 text-[14px] leading-[1.6] [overflow-wrap:anywhere] break-words text-neutral-800">
                  <AssistantText text={message.text} />
                </div>
              </div>
            </div>
          );
        })}

        {/* =================================================
            LOADING
        ================================================= */}

        {isLoading && (
          <div className="flex w-full items-start gap-2">
            <div className="bg-secondary mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-black/[0.05]">
              <SvgIcon
                iconId={IconId.ChatBot}
                size={{
                  width: 20,
                  height: 20,
                }}
              />
            </div>

            <div>
              <div className="mb-1.5 text-[11px] font-medium text-neutral-400">
                AI Assistant
              </div>

              <div className="flex h-11 items-center gap-1.5 rounded-2xl rounded-tl-md bg-neutral-50 px-4">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400" />

                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:120ms]" />

                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:240ms]" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
};
