import {
  AiAssistantResponse,
  AiCategory,
  AiSubcategoriesResponse,
  AskAssistantRequest,
  Language,
} from '../types/aiAssistant.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export async function askAssistant(
  data: AskAssistantRequest
): Promise<AiAssistantResponse> {
  const url = `${API_URL}/ai-assistant/ask`;

  console.log('AI REQUEST URL:', url);

  console.log('AI REQUEST:', data);

  const response = await fetch(url, {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();

    console.error('AI REQUEST FAILED:', {
      status: response.status,

      statusText: response.statusText,

      body: errorText,

      url,
    });

    throw new Error(
      `AI request failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

export async function analyzePhoto(
  file: File,
  options?: {
    sessionId?: string;
    language?: Language;
    message?: string;
  }
): Promise<AiAssistantResponse> {
  const formData = new FormData();

  formData.append('image', file);

  if (options?.sessionId) {
    formData.append('sessionId', options.sessionId);
  }

  if (options?.language) {
    formData.append('language', options.language);
  }

  if (options?.message) {
    formData.append('message', options.message);
  }

  const response = await fetch(`${API_URL}/ai-assistant/photo-analyze`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to analyze photo');
  }

  return response.json();
}

export async function getAiCategories(
  language: Language = 'en'
): Promise<AiCategory[]> {
  const response = await fetch(
    `${API_URL}/ai-assistant/categories?language=${language}`
  );

  if (!response.ok) {
    throw new Error('Failed to load categories');
  }

  return response.json();
}

export async function getAiSubcategories(
  categorySlug: string,
  language: Language = 'en'
): Promise<AiSubcategoriesResponse> {
  const response = await fetch(
    `${API_URL}/ai-assistant/categories/${encodeURIComponent(
      categorySlug
    )}/subcategories?language=${language}`
  );

  if (!response.ok) {
    throw new Error('Failed to load subcategories');
  }

  return response.json();
}

export async function getAiCategoryProducts(
  categorySlug: string,
  subcategorySlug?: string
): Promise<AiAssistantResponse> {
  const params = new URLSearchParams();

  if (subcategorySlug) {
    params.set('subcategorySlug', subcategorySlug);
  }

  const query = params.toString();

  const response = await fetch(
    `${API_URL}/ai-assistant/categories/${encodeURIComponent(
      categorySlug
    )}/products${query ? `?${query}` : ''}`
  );

  if (!response.ok) {
    throw new Error('Failed to load category products');
  }

  return response.json();
}
