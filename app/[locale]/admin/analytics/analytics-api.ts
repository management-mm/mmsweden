export type AnalyticsPeriod = '7' | '30' | '90';

export type AnalyticsLeadType = 'REQUEST_QUOTE' | 'SELL_TO_US' | 'CONTACT_US';

export type AnalyticsLeadStatus =
  | 'NEW'
  | 'IN_PROGRESS'
  | 'WAITING_CUSTOMER'
  | 'OFFER_SENT'
  | 'WON'
  | 'LOST'
  | 'SPAM';

export type AnalyticsDealStage =
  'NEW' | 'QUALIFIED' | 'PROPOSAL' | 'NEGOTIATION' | 'WON' | 'LOST';

export type AnalyticsQuotationStatus =
  'DRAFT' | 'ISSUED' | 'ACCEPTED' | 'DECLINED' | 'VOID';

export interface AnalyticsResponse {
  periodDays: number;
  periodStart: string;
  generatedAt: string;

  leads: {
    total: number;
    previousTotal: number;
    byType: Record<AnalyticsLeadType, number>;
    byStatus: Record<AnalyticsLeadStatus, number>;
    trend: Array<{
      date: string;
      count: number;
    }>;
  };

  sales: {
    total: number;
    previousTotal: number;
    byStage: Record<AnalyticsDealStage, number>;
    openValueByCurrency: Record<string, number>;
    wonValueByCurrency: Record<string, number>;
  };

  purchases: {
    total: number;
  };

  quotations: {
    total: number;
    byStatus: Record<AnalyticsQuotationStatus, number>;
    acceptedValueByCurrency: Record<string, number>;
  };

  tasks: {
    open: number;
    overdue: number;
    workload: Array<{
      assigneeId: string;
      name: string;
      open: number;
      overdue: number;
    }>;
  };
}

export async function getCrmAnalytics(
  period: AnalyticsPeriod,
  signal?: AbortSignal
): Promise<AnalyticsResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is not configured');
  }

  const response = await fetch(
    `${apiUrl.replace(/\/+$/, '')}/crm/analytics?days=${period}`,
    {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
      signal,
    }
  );

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      message?: string | string[];
    } | null;

    const serverMessage = Array.isArray(body?.message)
      ? body.message.join(', ')
      : body?.message;

    const fallback =
      response.status === 401
        ? 'Your session has expired.'
        : response.status === 403
          ? 'You do not have CRM access.'
          : `Failed to load analytics (${response.status}).`;

    throw new Error(serverMessage || fallback);
  }

  return (await response.json()) as AnalyticsResponse;
}
