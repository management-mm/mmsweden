'use client';

import { useState } from 'react';

import { analyzePhoto, askAssistant } from '@api/aiAssistantService';

import { AiChatMessage, Language } from '../types/aiAssistant.types';

import { getAiSessionId, saveAiSessionId } from '@utils/aiAssistantSession';

interface UseAiAssistantOptions {
  language?: Language;
}

export const useAiAssistant = ({
  language = 'en',
}: UseAiAssistantOptions = {}) => {
  const [messages, setMessages] = useState<AiChatMessage[]>([]);

  const [currentLanguage, setCurrentLanguage] = useState<Language>(language);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // =========================================================
  // SEND TEXT MESSAGE
  // =========================================================

  const sendMessage = async (text: string, productId?: string) => {
    const cleanText = text.trim();

    if (!cleanText || isLoading) {
      return;
    }

    const userMessage: AiChatMessage = {
      id: crypto.randomUUID(),

      role: 'user',

      text: cleanText,

      createdAt: new Date(),
    };

    setMessages(current => [...current, userMessage]);

    setIsLoading(true);
    setError(null);

    try {
      const response = await askAssistant({
        message: cleanText,

        language: currentLanguage,

        sessionId: getAiSessionId(),

        productId,
      });

      // -----------------------------------------
      // UPDATE CURRENT LANGUAGE
      // -----------------------------------------

      if (response.language) {
        setCurrentLanguage(response.language);
      }

      // -----------------------------------------
      // SAVE SESSION
      // -----------------------------------------

      saveAiSessionId(response.sessionId);

      // -----------------------------------------
      // ADD AI MESSAGE
      // -----------------------------------------

      const assistantMessage: AiChatMessage = {
        id: crypto.randomUUID(),

        role: 'assistant',

        text: response.message ?? '',

        response,

        createdAt: new Date(),
      };

      setMessages(current => [...current, assistantMessage]);

      return response;
    } catch (error) {
      console.error('AI assistant error:', error);

      setError('Could not send message.');
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================
  // SEND PHOTO
  // =========================================================

  const sendPhoto = async (file: File, question?: string) => {
    if (isLoading) {
      return;
    }

    const questionText = question?.trim() ?? '';

    const imagePreview = URL.createObjectURL(file);

    const userMessage: AiChatMessage = {
      id: crypto.randomUUID(),

      role: 'user',

      text: questionText,

      imagePreview,

      createdAt: new Date(),
    };

    setMessages(current => [...current, userMessage]);

    setIsLoading(true);
    setError(null);

    try {
      const response = await analyzePhoto(file, {
        sessionId: getAiSessionId(),

        language: currentLanguage,

        message: questionText || undefined,
      });

      // -----------------------------------------
      // UPDATE LANGUAGE
      // -----------------------------------------

      if (response.language) {
        setCurrentLanguage(response.language);
      }

      // -----------------------------------------
      // SAVE SESSION
      // -----------------------------------------

      saveAiSessionId(response.sessionId);

      // -----------------------------------------
      // ADD AI RESPONSE
      // -----------------------------------------

      const assistantMessage: AiChatMessage = {
        id: crypto.randomUUID(),

        role: 'assistant',

        text: response.message ?? '',

        response,

        createdAt: new Date(),
      };

      setMessages(current => [...current, assistantMessage]);

      return response;
    } catch (error) {
      console.error('AI photo error:', error);

      setError('Could not analyze image.');
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================
  // RETURN
  // =========================================================

  return {
    messages,
    isLoading,
    error,

    currentLanguage,

    sendMessage,
    sendPhoto,
  };
};
