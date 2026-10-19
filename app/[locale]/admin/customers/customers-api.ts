import type { LeadProduct, LeadStatus, LeadType } from '../leads/crm-api';

export interface Customer {
  id: string;
  email: string;
  customerName: string;
  companyName: string;
  phone: string;
  country: string;
  leadCount: number;
  activeLeads: number;
  wonLeads: number;
  firstContactAt: string;
  lastContactAt: string;
  lastLeadStatus: LeadStatus;
  lastLeadType: LeadType;
}

export interface CustomersResponse {
  items: Customer[];
  total: number;
  totalLeads: number;
  activeCustomers: number;
  page: number;
  limit: number;
}

export interface CustomerLead {
  id: string;
  type: LeadType;
  status: LeadStatus;
  priority: string;
  subject: string;
  message: string;
  askingPrice: string;
  equipmentDescription: string;
  requestedProducts: LeadProduct[];
  equipmentPhotos: string[];
  createdAt: string;
}

export interface CustomerDetails {
  customer: {
    id: string;
    email: string;
    customerName: string;
    companyName: string;
    phone: string;
    countryPhone: string;
    country: string;
    firstContactAt: string;
    lastContactAt: string;
  };
  totalLeads: number;
  hasMore: boolean;
  leads: CustomerLead[];
}

const getApiUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_URL;

  if (!url) {
    throw new Error('NEXT_PUBLIC_API_URL is not configured');
  }

  return url.replace(/\/+$/, '');
};

async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${getApiUrl()}${path}`, {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
    signal,
  });

  if (response.status === 401) {
    throw new Error('Session expired. Please sign in again.');
  }

  if (response.status === 403) {
    throw new Error('You do not have CRM access.');
  }

  if (!response.ok) {
    throw new Error(`CRM request failed (${response.status})`);
  }

  return (await response.json()) as T;
}

export function getCustomers(
  page: number,
  search: string,
  signal?: AbortSignal
) {
  const params = new URLSearchParams({
    page: String(page),
    limit: '15',
  });

  if (search.trim()) {
    params.set('search', search.trim());
  }

  return request<CustomersResponse>(
    `/crm/customers?${params.toString()}`,
    signal
  );
}

export function getCustomerDetails(id: string, signal?: AbortSignal) {
  return request<CustomerDetails>(
    `/crm/customers/${encodeURIComponent(id)}`,
    signal
  );
}
