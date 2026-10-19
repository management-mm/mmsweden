export type QuotationStatus =
  'DRAFT' | 'ISSUED' | 'ACCEPTED' | 'DECLINED' | 'VOID';

export type QuotationCurrency = 'EUR' | 'SEK' | 'USD';

export interface QuotationItem {
  name: string;
  idNumber: string;
  quantity: number;
  unitPrice: number;
}

export interface QuotationStatusEvent {
  from: QuotationStatus;
  to: QuotationStatus;
  actorId: string;
  at: string;
}

export interface QuotationInput {
  dealId: string | null;
  title: string;
  customerName: string;
  customerEmail: string;
  companyName: string;
  country: string;
  currency: QuotationCurrency;
  items: QuotationItem[];
  discountPercent: number;
  shippingCost: number;
  vatPercent: number;
  validUntil: string | null;
  paymentTerms: string;
  deliveryTerms: string;
  notes: string;
}

export interface Quotation extends QuotationInput {
  _id: string;
  number: string;
  status: QuotationStatus;

  subtotal: number;
  discountAmount: number;
  vatAmount: number;
  total: number;

  issuedAt: string | null;
  createdAt: string;
  updatedAt: string;
  createdById: string;
  updatedById: string;
  statusHistory: QuotationStatusEvent[];
  version: number;
}

export interface QuotationsResponse {
  items: Quotation[];
  total: number;
  page: number;
  limit: number;
}

export interface QuotationStats {
  total: number;
  draft: number;
  issued: number;
  accepted: number;
  declined: number;
  voided: number;
  acceptedValue: Record<string, number>;
}

export const QUOTATION_STATUSES: QuotationStatus[] = [
  'DRAFT',
  'ISSUED',
  'ACCEPTED',
  'DECLINED',
  'VOID',
];

export const STATUS_LABELS: Record<QuotationStatus, string> = {
  DRAFT: 'Draft',
  ISSUED: 'Issued',
  ACCEPTED: 'Accepted',
  DECLINED: 'Declined',
  VOID: 'Void',
};

export const ALLOWED_NEXT: Record<QuotationStatus, QuotationStatus[]> = {
  DRAFT: ['ISSUED', 'VOID'],
  ISSUED: ['ACCEPTED', 'DECLINED', 'VOID'],
  ACCEPTED: [],
  DECLINED: [],
  VOID: [],
};

export function formatMoney(amount: number, currency: QuotationCurrency) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
  }).format(amount);
}

function apiBase() {
  const url = process.env.NEXT_PUBLIC_API_URL;

  if (!url) {
    throw new Error('NEXT_PUBLIC_API_URL is not configured');
  }

  return url.replace(/\/+$/, '');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${apiBase()}${path}`, {
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

    const serverMessage = Array.isArray(body?.message)
      ? body.message.join(', ')
      : body?.message;

    const fallback =
      response.status === 401
        ? 'Please sign in again.'
        : response.status === 403
          ? 'You do not have CRM access.'
          : response.status === 409
            ? 'Document changed. Refresh before editing.'
            : `Request failed (${response.status})`;

    throw new Error(serverMessage || fallback);
  }

  return (await response.json()) as T;
}

export function getQuotations(
  filters: {
    page: number;
    limit: number;
    search: string;
    status: QuotationStatus | 'ALL';
  },
  signal?: AbortSignal
) {
  const query = new URLSearchParams({
    page: String(filters.page),
    limit: String(filters.limit),
  });

  if (filters.search.trim()) {
    query.set('search', filters.search.trim());
  }

  if (filters.status !== 'ALL') {
    query.set('status', filters.status);
  }

  return request<QuotationsResponse>(`/crm/quotations?${query.toString()}`, {
    signal,
  });
}

export function getQuotationStats(signal?: AbortSignal) {
  return request<QuotationStats>('/crm/quotations/stats', { signal });
}

export function getQuotation(id: string, signal?: AbortSignal) {
  return request<Quotation>(`/crm/quotations/${encodeURIComponent(id)}`, {
    signal,
  });
}

export function createQuotation(input: QuotationInput) {
  return request<Quotation>('/crm/quotations', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateQuotation(
  id: string,
  input: QuotationInput,
  version: number
) {
  return request<Quotation>(`/crm/quotations/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify({
      ...input,
      version,
    }),
  });
}

export function changeQuotationStatus(
  id: string,
  status: QuotationStatus,
  version: number
) {
  return request<Quotation>(
    `/crm/quotations/${encodeURIComponent(id)}/status`,
    {
      method: 'PATCH',
      body: JSON.stringify({
        status,
        version,
      }),
    }
  );
}
