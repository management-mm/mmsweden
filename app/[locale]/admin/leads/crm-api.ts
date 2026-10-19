export type LeadType = 'REQUEST_QUOTE' | 'SELL_TO_US' | 'CONTACT_US';

export type LeadStatus =
  | 'NEW'
  | 'IN_PROGRESS'
  | 'WAITING_CUSTOMER'
  | 'OFFER_SENT'
  | 'WON'
  | 'LOST'
  | 'SPAM';

export type LeadPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export type NotificationStatus = 'PENDING' | 'SENT' | 'FAILED';

export interface LeadProduct {
  name: string;
  idNumber: string;
  photo: string;
}

export interface CrmLead {
  _id: string;
  type: LeadType;
  status: LeadStatus;
  priority: LeadPriority;

  customerName: string;
  companyName?: string;
  email: string;
  phone?: string;
  countryPhone?: string;
  country?: string;
  locale: string;

  subject?: string;
  message?: string;

  askingPrice?: string;
  equipmentDescription?: string;
  equipmentPhotos: string[];
  requestedProducts: LeadProduct[];

  assignedToId?: string | null;
  notificationStatus?: NotificationStatus;

  createdAt: string;
  updatedAt: string;
  version?: number;
}

export interface LeadNote {
  _id: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface LeadEvent {
  _id: string;
  type: string;
  actorId: string | null;
  fromStatus?: string;
  toStatus?: string;
  fromAssigneeId?: string | null;
  toAssigneeId?: string | null;
  createdAt: string;
}

export interface LeadsResponse {
  items: CrmLead[];
  total: number;
  page: number;
  limit: number;
}

export interface LeadsFilters {
  status: LeadStatus | 'ALL';
  type: LeadType | 'ALL';
  search: string;
  page: number;
  limit: number;
}

export class CrmApiError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = 'CrmApiError';
  }
}

function apiBase(): string {
  const base = process.env.NEXT_PUBLIC_API_URL;

  if (!base) {
    throw new Error('NEXT_PUBLIC_API_URL is not configured');
  }

  return base.replace(/\/+$/, '');
}

async function crmRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${apiBase()}${path}`, {
    ...init,
    credentials: 'include',
    cache: 'no-store',
    headers: {
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...init.headers,
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
          ? 'You do not have CRM permissions.'
          : response.status === 409
            ? 'This lead was changed by someone else. Refresh it.'
            : `Request failed (${response.status}).`;

    throw new CrmApiError(serverMessage || fallback, response.status);
  }

  return (await response.json()) as T;
}

export function getLeads(filters: LeadsFilters, signal?: AbortSignal) {
  const query = new URLSearchParams({
    page: String(filters.page),
    limit: String(filters.limit),
  });

  if (filters.status !== 'ALL') {
    query.set('status', filters.status);
  }

  if (filters.type !== 'ALL') {
    query.set('type', filters.type);
  }

  if (filters.search.trim()) {
    query.set('search', filters.search.trim());
  }

  return crmRequest<LeadsResponse>(`/crm/leads?${query.toString()}`, {
    signal,
  });
}

export function getLead(id: string) {
  return crmRequest<CrmLead>(`/crm/leads/${encodeURIComponent(id)}`);
}

export function getLeadNotes(id: string) {
  return crmRequest<LeadNote[]>(`/crm/leads/${encodeURIComponent(id)}/notes`);
}

export function getLeadHistory(id: string) {
  return crmRequest<LeadEvent[]>(
    `/crm/leads/${encodeURIComponent(id)}/history`
  );
}

export function changeLeadStatus(
  id: string,
  status: LeadStatus,
  version: number
) {
  return crmRequest<CrmLead>(`/crm/leads/${encodeURIComponent(id)}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, version }),
  });
}

export function assignLead(
  id: string,
  assignedToId: string | null,
  version: number
) {
  return crmRequest<CrmLead>(`/crm/leads/${encodeURIComponent(id)}/assign`, {
    method: 'PATCH',
    body: JSON.stringify({
      assignedToId,
      version,
    }),
  });
}

export function addLeadNote(id: string, content: string) {
  return crmRequest<LeadNote>(`/crm/leads/${encodeURIComponent(id)}/notes`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}
