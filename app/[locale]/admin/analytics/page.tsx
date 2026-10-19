'use client';

import { type ReactNode, useEffect, useMemo, useState } from 'react';
import {
  FiAlertCircle,
  FiBarChart2,
  FiBriefcase,
  FiDownload,
  FiFileText,
  FiInbox,
  FiRefreshCw,
  FiTrendingUp,
} from 'react-icons/fi';

import { useLocale } from 'next-intl';
import Link from 'next/link';

import {
  type AnalyticsDealStage,
  type AnalyticsLeadType,
  type AnalyticsPeriod,
  type AnalyticsQuotationStatus,
  type AnalyticsResponse,
  getCrmAnalytics,
} from './analytics-api';

const NAVY = '#002b49';

const LEAD_TYPES: Array<{
  key: AnalyticsLeadType;
  label: string;
}> = [
  {
    key: 'REQUEST_QUOTE',
    label: 'Request Quote',
  },
  {
    key: 'SELL_TO_US',
    label: 'Sell to Us',
  },
  {
    key: 'CONTACT_US',
    label: 'Contact Us',
  },
];

const DEAL_STAGES: Array<{
  key: AnalyticsDealStage;
  label: string;
}> = [
  { key: 'NEW', label: 'New' },
  { key: 'QUALIFIED', label: 'Qualified' },
  { key: 'PROPOSAL', label: 'Proposal' },
  { key: 'NEGOTIATION', label: 'Negotiation' },
  { key: 'WON', label: 'Won' },
  { key: 'LOST', label: 'Lost' },
];

const QUOTATION_STATUSES: Array<{
  key: AnalyticsQuotationStatus;
  label: string;
}> = [
  { key: 'DRAFT', label: 'Draft' },
  { key: 'ISSUED', label: 'Issued' },
  { key: 'ACCEPTED', label: 'Accepted' },
  { key: 'DECLINED', label: 'Declined' },
  { key: 'VOID', label: 'Void' },
];

function formatDate(value?: string | null): string {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

function shortDate(value: string): string {
  const date = new Date(`${value}T00:00:00.000Z`);

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    timeZone: 'UTC',
  }).format(date);
}

function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

function percentage(count: number, total: number): number {
  if (total <= 0) return 0;

  return Math.round((count / total) * 100);
}

function comparisonText(current: number, previous: number): string {
  if (previous === 0) {
    return current === 0
      ? 'No change from previous period'
      : 'Previous period: 0';
  }

  const difference = current - previous;

  const percent = Math.round((Math.abs(difference) / previous) * 100);

  if (difference === 0) {
    return 'No change from previous period';
  }

  return difference > 0
    ? `↑ ${percent}% vs previous period`
    : `↓ ${percent}% vs previous period`;
}

function getCurrencyRows(record: Record<string, number>) {
  return Object.entries(record)
    .filter(([, amount]) => amount !== 0)
    .sort(([currencyA], [currencyB]) => currencyA.localeCompare(currencyB));
}

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: ReactNode;
}

function KpiCard({ title, value, subtitle, icon }: KpiCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{title}</p>

        <div className="rounded-xl bg-slate-100 p-2.5 text-[#00528b]">
          {icon}
        </div>
      </div>

      <p className="mt-4 text-3xl font-bold text-[#002b49]">{value}</p>

      <p className="mt-2 text-xs text-slate-500">{subtitle}</p>
    </div>
  );
}

interface ProgressRowProps {
  label: string;
  count: number;
  total: number;
  color?: string;
}

function ProgressRow({ label, count, total, color = NAVY }: ProgressRowProps) {
  const value = percentage(count, total);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-[#002b49]">{label}</span>

        <span className="whitespace-nowrap text-slate-500">
          {count} ({value}%)
        </span>
      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${value}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}

interface GroupedTrendPoint {
  label: string;
  count: number;
}

function groupTrend(
  data: AnalyticsResponse['leads']['trend'],
  period: AnalyticsPeriod
): GroupedTrendPoint[] {
  const chunkSize = period === '7' ? 1 : period === '30' ? 3 : 7;

  const result: GroupedTrendPoint[] = [];

  for (let index = 0; index < data.length; index += chunkSize) {
    const chunk = data.slice(index, index + chunkSize);

    const first = chunk[0];

    if (!first) continue;

    result.push({
      label: shortDate(first.date),
      count: chunk.reduce((sum, day) => sum + day.count, 0),
    });
  }

  return result;
}

function LeadsChart({ points }: { points: GroupedTrendPoint[] }) {
  const maximum = Math.max(1, ...points.map(point => point.count));

  const hasActivity = points.some(point => point.count > 0);

  if (points.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-slate-500">
        No chart data available.
      </p>
    );
  }

  return (
    <div>
      <div
        className="flex h-56 items-end gap-2"
        role="img"
        aria-label="Incoming leads chart"
      >
        {points.map((point, index) => {
          const height = (point.count / maximum) * 100;

          return (
            <div
              key={`${point.label}-${index}`}
              className="flex h-full min-w-0 flex-1 flex-col justify-end gap-2"
              title={`${point.label}: ${point.count} leads`}
            >
              <div className="flex h-44 items-end rounded-lg bg-slate-50 px-1">
                <div
                  className="w-full rounded-t-md bg-[#00528b]"
                  style={{
                    height: `${height}%`,
                    minHeight: point.count > 0 ? '3px' : '0px',
                  }}
                />
              </div>

              <span className="truncate text-center text-[10px] text-slate-500">
                {point.label}
              </span>
            </div>
          );
        })}
      </div>

      {!hasActivity && (
        <p className="mt-3 text-center text-xs text-slate-500">
          No inquiries received during this period.
        </p>
      )}
    </div>
  );
}

function MoneySection({
  title,
  values,
  description,
}: {
  title: string;
  values: Record<string, number>;
  description: string;
}) {
  const currencies = getCurrencyRows(values);

  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <p className="text-sm font-semibold">{title}</p>

      <p className="mt-1 text-xs text-slate-500">{description}</p>

      {currencies.length === 0 ? (
        <p className="mt-4 text-2xl font-bold">—</p>
      ) : (
        <div className="mt-4 space-y-2">
          {currencies.map(([currency, amount]) => (
            <p
              key={currency}
              className="text-xl font-bold break-words text-[#002b49]"
            >
              {formatMoney(amount, currency)}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

function escapeCsv(value: string | number) {
  return '"' + String(value).replaceAll('"', '""') + '"';
}

function downloadCsv(data: AnalyticsResponse) {
  const rows: Array<Array<string | number>> = [
    ['Section', 'Metric', 'Dimension', 'Value'],
    ['Period', 'Days', '', data.periodDays],
    ['Leads', 'Current', '', data.leads.total],
    ['Leads', 'Previous', '', data.leads.previousTotal],
    ['Sales deals', 'Current', '', data.sales.total],
    ['Sales deals', 'Previous', '', data.sales.previousTotal],
    ['Purchases', 'Created', '', data.purchases.total],
    ['Quotations', 'Created', '', data.quotations.total],
    ['Tasks', 'Currently open', '', data.tasks.open],
    ['Tasks', 'Currently overdue', '', data.tasks.overdue],
  ];

  for (const [type, count] of Object.entries(data.leads.byType)) {
    rows.push(['Leads', 'Request type', type, count]);
  }

  for (const [status, count] of Object.entries(data.sales.byStage)) {
    rows.push(['Sales deals', 'Current stage', status, count]);
  }

  for (const [status, count] of Object.entries(data.quotations.byStatus)) {
    rows.push(['Quotations', 'Current status', status, count]);
  }

  const valueSections = [
    ['Open sales deals', data.sales.openValueByCurrency],
    ['Won sales deals', data.sales.wonValueByCurrency],
    ['Accepted quotations', data.quotations.acceptedValueByCurrency],
  ] as const;

  for (const [section, values] of valueSections) {
    for (const [currency, amount] of Object.entries(values)) {
      rows.push([section, 'Amount', currency, amount]);
    }
  }

  for (const manager of data.tasks.workload) {
    rows.push(['Manager tasks', manager.name, 'Open', manager.open]);

    rows.push(['Manager tasks', manager.name, 'Overdue', manager.overdue]);
  }

  for (const day of data.leads.trend) {
    rows.push(['Daily leads', 'Received', day.date, day.count]);
  }

  const csv =
    '\uFEFF' + rows.map(row => row.map(escapeCsv).join(',')).join('\r\n');

  const blob = new Blob([csv], {
    type: 'text/csv;charset=utf-8',
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');

  link.href = url;
  link.download = `mm-sweden-crm-analytics-${data.periodDays}d.csv`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function CrmAnalyticsPage() {
  const locale = useLocale();

  const [period, setPeriod] = useState<AnalyticsPeriod>('30');

  const [data, setData] = useState<AnalyticsResponse | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    getCrmAnalytics(period, controller.signal)
      .then(result => {
        if (!controller.signal.aborted) {
          setData(result);
        }
      })
      .catch(err => {
        if (!controller.signal.aborted) {
          setData(null);

          setError(
            err instanceof Error ? err.message : 'Failed to load analytics.'
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [period, revision]);

  const chart = useMemo(
    () => groupTrend(data?.leads.trend ?? [], period),
    [data, period]
  );

  const leadsTotal = data?.leads.total ?? 0;
  const salesTotal = data?.sales.total ?? 0;
  const quotationTotal = data?.quotations.total ?? 0;

  const acceptedQuotations = data?.quotations.byStatus.ACCEPTED ?? 0;

  const wonSales = data?.sales.byStage.WON ?? 0;

  const cardData = [
    {
      title: 'Incoming Leads',
      value: data ? data.leads.total : '—',
      subtitle: data
        ? comparisonText(data.leads.total, data.leads.previousTotal)
        : 'Waiting for data',
      icon: <FiInbox size={20} />,
    },
    {
      title: 'New Sales Deals',
      value: data ? data.sales.total : '—',
      subtitle: data
        ? comparisonText(data.sales.total, data.sales.previousTotal)
        : 'Waiting for data',
      icon: <FiBriefcase size={20} />,
    },
    {
      title: 'Accepted Quotations',
      value: data ? acceptedQuotations : '—',
      subtitle: 'Created during selected period',
      icon: <FiFileText size={20} />,
    },
    {
      title: 'Overdue Tasks',
      value: data ? data.tasks.overdue : '—',
      subtitle: 'Current team workload · UTC',
      icon: <FiAlertCircle size={20} />,
    },
  ];

  return (
    <main className="min-h-full bg-[#fcfcfd] text-[#002b49]">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white px-5 py-7 sm:px-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-500">
              <FiBarChart2 />
              CRM / Analytics
            </p>

            <h1 className="text-2xl font-bold">CRM Analytics</h1>

            <p className="mt-1 text-sm text-slate-500">
              Understand customer demand, sales activity and team performance
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={!data || loading}
              onClick={() => {
                if (data) {
                  downloadCsv(data);
                }
              }}
              className="inline-flex items-center gap-2 rounded-full border border-[#002b49] px-4 py-2.5 text-sm font-semibold disabled:opacity-40"
            >
              <FiDownload />
              Export CSV
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => setRevision(value => value + 1)}
              className="inline-flex items-center gap-2 rounded-full border border-[#002b49] px-4 py-2.5 text-sm font-semibold disabled:opacity-40"
            >
              <FiRefreshCw className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>
      </header>

      <div className="space-y-6 p-4 sm:p-7">
        {/* Period selector */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold">Business Performance</h2>

            <p className="mt-1 text-xs text-slate-500">
              {data
                ? `Period starts ${formatDate(data.periodStart)} · UTC dates`
                : 'Select an analysis period'}
            </p>
          </div>

          <div className="flex rounded-full border border-slate-200 bg-white p-1">
            {(
              [
                ['7', '7 days'],
                ['30', '30 days'],
                ['90', '90 days'],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={period === value}
                onClick={() => setPeriod(value)}
                className={`rounded-full px-4 py-2 text-xs font-semibold ${
                  period === value
                    ? 'bg-[#002b49] text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {loading && (
          <p role="status" className="text-sm text-slate-500">
            Updating analytics...
          </p>
        )}

        {/* KPI */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cardData.map(card => (
            <KpiCard key={card.title} {...card} />
          ))}
        </div>

        {/* Leads trend & request types */}
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,1fr)]">
          <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <div className="mb-6 flex items-start justify-between gap-3">
              <div>
                <h2 className="font-bold">Inquiry Activity</h2>

                <p className="mt-1 text-xs text-slate-500">
                  Incoming website leads
                </p>
              </div>

              <FiTrendingUp size={21} className="text-[#00528b]" />
            </div>

            {data ? (
              <LeadsChart points={chart} />
            ) : (
              <p className="py-16 text-center text-sm text-slate-500">
                No data available.
              </p>
            )}

            <div className="mt-6 flex items-center justify-between border-t pt-4 text-sm">
              <span className="text-slate-500">Total inquiries</span>

              <strong>{leadsTotal}</strong>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h2 className="font-bold">Inquiry Types</h2>

            <p className="mt-1 text-xs text-slate-500">
              How customers contact MM Sweden
            </p>

            <div className="mt-8 space-y-7">
              {LEAD_TYPES.map(item => (
                <ProgressRow
                  key={item.key}
                  label={item.label}
                  count={data?.leads.byType[item.key] ?? 0}
                  total={leadsTotal}
                />
              ))}
            </div>

            <Link
              href={`/${locale}/admin/leads`}
              className="mt-8 inline-flex text-sm font-semibold text-[#00528b] hover:underline"
            >
              Open Customer Leads →
            </Link>
          </section>
        </div>

        {/* Sales & quotations */}
        <div className="grid gap-5 xl:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-bold">Sales Deal Stages</h2>

              <span className="text-xs text-slate-500">
                {salesTotal} sales deals
              </span>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Current stage of sales deals created during the period
            </p>

            <div className="mt-7 space-y-5">
              {DEAL_STAGES.map(item => (
                <ProgressRow
                  key={item.key}
                  label={item.label}
                  count={data?.sales.byStage[item.key] ?? 0}
                  total={salesTotal}
                  color={
                    item.key === 'WON'
                      ? '#15803d'
                      : item.key === 'LOST'
                        ? '#dc2626'
                        : NAVY
                  }
                />
              ))}
            </div>

            <div className="mt-7 rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Share currently Won</p>

              <p className="mt-1 text-2xl font-bold">
                {percentage(wonSales, salesTotal)}%
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {wonSales} of {salesTotal} sales deals created in this period
              </p>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Purchase deals created during this period:{' '}
              <strong>{data?.purchases.total ?? 0}</strong>
            </p>

            <Link
              href={`/${locale}/admin/deals`}
              className="mt-4 inline-flex text-sm font-semibold text-[#00528b] hover:underline"
            >
              Open Equipment Deals →
            </Link>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-bold">Commercial Offers</h2>

              <span className="text-xs text-slate-500">
                {quotationTotal} quotations
              </span>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Current status of quotations created during the period
            </p>

            <div className="mt-7 space-y-5">
              {QUOTATION_STATUSES.map(item => (
                <ProgressRow
                  key={item.key}
                  label={item.label}
                  count={data?.quotations.byStatus[item.key] ?? 0}
                  total={quotationTotal}
                  color={
                    item.key === 'ACCEPTED'
                      ? '#15803d'
                      : item.key === 'DECLINED'
                        ? '#dc2626'
                        : NAVY
                  }
                />
              ))}
            </div>

            <div className="mt-7 rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Share currently Accepted</p>

              <p className="mt-1 text-2xl font-bold">
                {percentage(acceptedQuotations, quotationTotal)}%
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {acceptedQuotations} of {quotationTotal} quotations
              </p>
            </div>

            <Link
              href={`/${locale}/admin/quotations`}
              className="mt-5 inline-flex text-sm font-semibold text-[#00528b] hover:underline"
            >
              Open Quotations →
            </Link>
          </section>
        </div>

        {/* Monetary values */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="font-bold">Sales Value Overview</h2>

            <p className="mt-1 text-xs text-slate-500">
              Values are shown by original currency; no exchange-rate conversion
              is applied
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <MoneySection
              title="Open sales deals"
              description="Deal value at active stages"
              values={data?.sales.openValueByCurrency ?? {}}
            />

            <MoneySection
              title="Won sales deals"
              description="Value of deals currently Won"
              values={data?.sales.wonValueByCurrency ?? {}}
            />

            <MoneySection
              title="Accepted quotations"
              description="Value of offers currently Accepted"
              values={data?.quotations.acceptedValueByCurrency ?? {}}
            />
          </div>

          <p className="mt-4 text-xs leading-5 text-slate-500">
            These are deal and quotation amounts, not confirmed revenue, cash
            received or gross profit. The same potential sale may appear in both
            Deals and Quotations.
          </p>
        </section>

        {/* Team workload */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-bold">Team Workload</h2>

              <p className="mt-1 text-xs text-slate-500">
                Current open and overdue tasks, independently of selected period
              </p>
            </div>

            <Link
              href={`/${locale}/admin/crm/tasks`}
              className="text-sm font-semibold text-[#00528b] hover:underline"
            >
              Open Tasks →
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Open tasks</p>

              <p className="mt-2 text-3xl font-bold">
                {data?.tasks.open ?? '—'}
              </p>
            </div>

            <div className="rounded-xl bg-red-50 p-4">
              <p className="text-sm text-red-700">Overdue tasks</p>

              <p className="mt-2 text-3xl font-bold text-red-700">
                {data?.tasks.overdue ?? '—'}
              </p>
            </div>
          </div>

          <h3 className="mt-7 font-semibold">Manager Workload</h3>

          {!data || data.tasks.workload.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">
              No active tasks assigned to managers.
            </p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[470px] text-left text-sm">
                <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
                  <tr>
                    <th className="px-4 py-3">Manager</th>

                    <th className="px-4 py-3 text-right">Open</th>

                    <th className="px-4 py-3 text-right">Overdue</th>
                  </tr>
                </thead>

                <tbody>
                  {data.tasks.workload.map(manager => (
                    <tr
                      key={manager.assigneeId}
                      className="border-t border-slate-100"
                    >
                      <td className="px-4 py-4 font-semibold">
                        {manager.name || 'Unknown manager'}
                      </td>

                      <td className="px-4 py-4 text-right">{manager.open}</td>

                      <td className="px-4 py-4 text-right">
                        {manager.overdue > 0 ? (
                          <span className="rounded-full bg-red-50 px-3 py-1 font-semibold text-red-700">
                            {manager.overdue}
                          </span>
                        ) : (
                          0
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Reporting notes */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 text-xs leading-6 text-slate-500">
          <p className="font-semibold text-[#002b49]">About this report</p>

          <p className="mt-2">
            Leads, Deals and Quotations are filtered by creation date. Their
            displayed statuses reflect their current state. The report does not
            reconstruct historical stage changes or calculate financial profit.
          </p>

          {data && (
            <p className="mt-2">Last updated: {formatDate(data.generatedAt)}</p>
          )}
        </div>
      </div>
    </main>
  );
}
