export type LeadStatus =
  | 'NEW'
  | 'IN_PROGRESS'
  | 'WAITING_CUSTOMER'
  | 'OFFER_SENT'
  | 'WON'
  | 'LOST'
  | 'SPAM';

export type LeadType = 'REQUEST_QUOTE' | 'SELL_TO_US' | 'CONTACT_US';

export interface CrmLead {
  _id: string;
  type: LeadType;
  status: LeadStatus;

  name?: string;
  customerName?: string;
  email?: string;
  company?: string;

  createdAt: string;
  version: number;
}

export interface CrmLeadsResponse {
  items: CrmLead[];
  total: number;
}

const getApiUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_API_URL;

  if (!url) {
    throw new Error('NEXT_PUBLIC_API_URL is not configured');
  }

  return url.replace(/\/+$/, '');
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.status === 401) {
    throw new Error('AUTH_REQUIRED');
  }

  if (response.status === 403) {
    throw new Error('ACCESS_DENIED');
  }

  if (!response.ok) {
    throw new Error(`CRM API error: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getCrmLeads(
  status?: LeadStatus
): Promise<CrmLeadsResponse> {
  const params = new URLSearchParams({
    page: '1',
    limit: '20',
  });

  if (status) {
    params.set('status', status);
  }

  const response = await fetch(
    `${getApiUrl()}/crm/leads?${params.toString()}`,
    {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
    }
  );

  return handleResponse<CrmLeadsResponse>(response);
}

export async function updateCrmLeadStatus(
  id: string,
  status: LeadStatus,
  version: number
): Promise<CrmLead> {
  const response = await fetch(
    `${getApiUrl()}/crm/leads/${encodeURIComponent(id)}/status`,
    {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status,
        version,
      }),
    }
  );

  if (response.status === 409) {
    throw new Error('LEAD_CONFLICT');
  }

  return handleResponse<CrmLead>(response);
}
