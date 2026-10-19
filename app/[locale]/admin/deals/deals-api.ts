export type DealDirection = 'SALE' | 'PURCHASE';

export type DealStage =
  'NEW' | 'QUALIFIED' | 'PROPOSAL' | 'NEGOTIATION' | 'WON' | 'LOST';

export type DealCurrency = 'EUR' | 'SEK' | 'USD';

export interface DealItem {
  name: string;
  idNumber: string;
  quantity: number;
  unitPrice: number;
}

export interface DealStageEvent {
  from: DealStage;
  to: DealStage;
  byId: string;
  at: string;
}

export interface Deal {
  _id: string;
  title: string;
  direction: DealDirection;
  stage: DealStage;

  customerName: string;
  customerEmail: string;
  companyName: string;
  country: string;

  sourceLeadId: string | null;
  currency: DealCurrency;

  items: DealItem[];
  shippingCost: number;
  total: number;

  description: string;
  expectedCloseAt: string | null;

  createdById: string;
  updatedById: string;
  stageHistory: DealStageEvent[];

  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface DealInput {
  title: string;
  direction: DealDirection;
  customerName: string;
  customerEmail: string;
  companyName: string;
  country: string;
  sourceLeadId: string | null;
  currency: DealCurrency;
  items: DealItem[];
  shippingCost: number;
  description: string;
  expectedCloseAt: string | null;
}

export interface DealsFilters {
  page: number;
  limit: number;
  direction: DealDirection | 'ALL';
  stage: DealStage | 'ALL';
  search: string;
}

export interface DealsResponse {
  items: Deal[];
  total: number;
  page: number;
  limit: number;
}

export interface DealStats {
  totalDeals: number;
  openDeals: number;
  wonDeals: number;
  openSaleValue: Record<string, number>;
  wonSaleValue: Record<string, number>;
  openPurchaseValue: Record<string, number>;
}

export const DEAL_STAGES: DealStage[] = [
  'NEW',
  'QUALIFIED',
  'PROPOSAL',
  'NEGOTIATION',
  'WON',
  'LOST',
];

export const DEAL_STAGE_LABELS: Record<DealStage, string> = {
  NEW: 'New',
  QUALIFIED: 'Qualified',
  PROPOSAL: 'Proposal',
  NEGOTIATION: 'Negotiation',
  WON: 'Won',
  LOST: 'Lost',
};

function getApiBase() {
  const base = process.env.NEXT_PUBLIC_API_URL;

  if (!base) {
    throw new Error('NEXT_PUBLIC_API_URL is not configured');
  }

  return base.replace(/\/+$/, '');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${getApiBase()}${path}`, {
    ...options,
    credentials: 'include',
    cache: 'no-store',
    headers: {
      ...(options.body
        ? {
            'Content-Type': 'application/json',
          }
        : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      message?: string | string[];
    } | null;

    const message = Array.isArray(body?.message)
      ? body.message.join(', ')
      : body?.message;

    const fallback =
      response.status === 401
        ? 'Please sign in again.'
        : response.status === 403
          ? 'You do not have CRM access.'
          : response.status === 409
            ? 'This deal was changed by another manager. Refresh and try again.'
            : `Request failed (${response.status})`;

    throw new Error(message || fallback);
  }

  return (await response.json()) as T;
}

export function getDeals(filters: DealsFilters, signal?: AbortSignal) {
  const query = new URLSearchParams({
    page: String(filters.page),
    limit: String(filters.limit),
  });

  if (filters.direction !== 'ALL') {
    query.set('direction', filters.direction);
  }

  if (filters.stage !== 'ALL') {
    query.set('stage', filters.stage);
  }

  if (filters.search.trim()) {
    query.set('search', filters.search.trim());
  }

  return request<DealsResponse>(`/crm/deals?${query.toString()}`, { signal });
}

export function getDealStats(signal?: AbortSignal) {
  return request<DealStats>('/crm/deals/stats', { signal });
}

export function getDeal(id: string, signal?: AbortSignal) {
  return request<Deal>(`/crm/deals/${encodeURIComponent(id)}`, { signal });
}

export function createDeal(input: DealInput) {
  return request<Deal>('/crm/deals', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function saveDeal(id: string, input: DealInput, version: number) {
  return request<Deal>(`/crm/deals/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify({
      ...input,
      version,
    }),
  });
}

export function updateDealStage(id: string, stage: DealStage, version: number) {
  return request<Deal>(`/crm/deals/${encodeURIComponent(id)}/stage`, {
    method: 'PATCH',
    body: JSON.stringify({
      stage,
      version,
    }),
  });
}
