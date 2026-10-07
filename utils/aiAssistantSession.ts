const AI_SESSION_KEY = 'mms-ai-session-id';

export const getAiSessionId = () => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return localStorage.getItem(AI_SESSION_KEY) ?? undefined;
};

export const saveAiSessionId = (sessionId?: string) => {
  if (!sessionId || typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(AI_SESSION_KEY, sessionId);
};

export const clearAiSessionId = () => {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem(AI_SESSION_KEY);
};
