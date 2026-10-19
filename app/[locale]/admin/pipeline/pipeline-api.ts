export type LeadType = 'REQUEST_QUOTE' | 'SELL_TO_US' | 'CONTACT_US';

export type LeadPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export const PIPELINE_STATUSES = [
  'NEW',
  'IN_PROGRESS',
  'WAITING_CUSTOMER',
  'OFFER_SENT',
  'WON',
  'LOST',
] as const;

export type PipelineStatus = (typeof PIPELINE_STATUSES)[number];

export type LeadStatus = PipelineStatus | 'SPAM';

export interface PipelineLead {
  _id: string;
  customerName: string;
  companyName: string | null;
  email: string;
  type: LeadType;
  status: LeadStatus;
  priority: LeadPriority;
  summary: string;
  productCount: number;
  assignedToId: string | null;
  createdAt: string;
  version: number | null;
}

export interface PipelineColumn {
  status: PipelineStatus;
  total: number;
  items: PipelineLead[];
  hasMore: boolean;
}

export interface PipelineBoardResponse {
  columns: PipelineColumn[];
  total: number;
  generatedAt: string;
}

export interface PipelineFilters {
  search: string;
  type: LeadType | 'ALL';
  limit: number;
}

function getApiUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;

  if (!url) {
    throw new Error('NEXT_PUBLIC_API_URL is not configured');
  }

  return url.replace(/\/+$/, '');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${getApiUrl()}${path}`, {
    ...options,
    credentials: 'include',
    cache: 'no-store',
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
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
            ? 'The lead was changed by another manager. Refresh and try again.'
            : `CRM request failed: ${response.status}`;

    throw new Error(serverMessage || fallback);
  }

  return (await response.json()) as T;
}

function createQuery(filters: PipelineFilters, skip?: number) {
  const query = new URLSearchParams({
    limit: String(filters.limit),
  });

  if (filters.type !== 'ALL') {
    query.set('type', filters.type);
  }

  if (filters.search.trim()) {
    query.set('search', filters.search.trim());
  }

  if (skip !== undefined) {
    query.set('skip', String(skip));
  }

  return query.toString();
}

export function getPipelineBoard(
  filters: PipelineFilters,
  signal?: AbortSignal
) {
  return request<PipelineBoardResponse>(
    `/crm/pipeline?${createQuery(filters)}`,
    { signal }
  );
}

export function getPipelineColumn(
  status: PipelineStatus,
  filters: PipelineFilters,
  skip: number
) {
  return request<PipelineColumn>(
    `/crm/pipeline/columns/${status}?${createQuery(filters, skip)}`
  );
}

export function updatePipelineStatus(
  leadId: string,
  status: LeadStatus,
  version: number
) {
  return request<PipelineLead>(
    `/crm/leads/${encodeURIComponent(leadId)}/status`,
    {
      method: 'PATCH',
      body: JSON.stringify({
        status,
        version,
      }),
    }
  );
}
