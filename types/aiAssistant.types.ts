import type { IProduct } from '@interfaces/IProduct';

export type Language = 'en' | 'sv' | 'de' | 'fr' | 'es' | 'ru' | 'uk' | 'pl';

export interface MultiLanguageString {
  en?: string;
  sv?: string;
  de?: string;
  fr?: string;
  es?: string;
  ru?: string;
  uk?: string;
  pl?: string;
}

// =========================================================
// PRODUCT
// =========================================================

export type AiProduct = IProduct;

// =========================================================
// RESPONSE TYPES
// =========================================================

export type AiResponseType =
  | 'PRODUCTS'
  | 'PRODUCT_DETAILS'
  | 'PRODUCT_NOT_FOUND'
  | 'COMPANY_ANSWER'
  | 'GENERAL'
  | 'WEB_RESEARCH'
  | 'WEB_RESEARCH_FAILED'
  | 'PHOTO_SEARCH'
  | 'CATEGORY_PRODUCTS';

// =========================================================
// ACTIONS
// =========================================================

export type AiAssistantAction =
  | {
      type: 'PRODUCT_DETAILS';
      label: string;
    }
  | {
      type: 'CONTACT_SALES';
      label: string;

      contact: {
        name: string;
        phone: string;
        email: string;
      };
    }
  | {
      type: 'WEB_RESEARCH';
      label: string;
    }
  | {
      type: 'REQUEST_PRICE';
      label: string;
      productId: string;
    };

// =========================================================
// WEB SOURCES
// =========================================================

export interface WebSource {
  title?: string;
  url: string;
}

// =========================================================
// ASSISTANT RESPONSE
// =========================================================

export interface AiAssistantResponse {
  sessionId: string;

  type: AiResponseType;

  language?: Language;

  message: string;

  product?: AiProduct;

  products?: AiProduct[];

  total?: number;

  actions?: AiAssistantAction[];

  sources?: WebSource[];

  matchType?:
    | 'EXACT'
    | 'IMAGE_MATCH'
    | 'VISION_IDENTIFIED'
    | 'VISION'
    | 'VISION_CANDIDATES';

  confidence?: 'HIGH' | 'MEDIUM' | 'LOW';

  imageMatch?: {
    distance: number;
    matchedPhotoUrl: string;
  };

  analysis?: unknown;
}

// =========================================================
// CATEGORIES
// =========================================================

export interface AiCategory {
  id: string;
  slug: string;
  name: string;
}

export interface AiSubcategoriesResponse {
  category: AiCategory;

  subcategories: AiCategory[];
}

// =========================================================
// REQUEST
// =========================================================

export interface AskAssistantRequest {
  message: string;

  language?: Language;

  sessionId?: string;

  productId?: string;
}

// =========================================================
// CHAT MESSAGE
// =========================================================

export interface AiChatMessage {
  id: string;

  role: 'user' | 'assistant';

  text: string;

  response?: AiAssistantResponse;

  imagePreview?: string;

  createdAt: Date;
}
