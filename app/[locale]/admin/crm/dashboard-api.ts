import type { LeadStatus, LeadType } from '../leads/crm-api';

export type DashboardPeriod = '7' | '30' | '90';

export interface DashboardTrendPoint {
  date: string;
  count: number;
}

export interface DashboardRecentLead {
  _id: string;
  customerName: string;
  companyName: string | null;
  email: string;
  type: LeadType;
  status: LeadStatus;
  createdAt: string;
}

export interface DashboardResponse {
  periodDays: number;
  periodStart: string;
  generatedAt: string;

  totals: {
    leads: number;
    new: number;
    inProgress: number;
    offerSent: number;
    won: number;
  };

  byStatus: Record<LeadStatus, number>;
  byType: Record<LeadType, number>;

  trend: DashboardTrendPoint[];
  recent: DashboardRecentLead[];
}

export async function getCrmDashboard(
  days: DashboardPeriod = '30',
  signal?: AbortSignal
): Promise<DashboardResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is not configured');
  }

  const response = await fetch(
    `${baseUrl.replace(/\/+$/, '')}/crm/dashboard?days=${days}`,
    {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
      signal,
    }
  );

  if (response.status === 401) {
    throw new Error('Your session has expired. Please sign in.');
  }

  if (response.status === 403) {
    throw new Error('You do not have CRM access. Contact your administrator.');
  }

  if (!response.ok) {
    throw new Error(`Failed to load dashboard (${response.status})`);
  }

  return (await response.json()) as DashboardResponse;
}
