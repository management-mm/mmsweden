'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiInbox,
  FiRefreshCw,
  FiTrendingUp,
} from 'react-icons/fi';

import { useLocale } from 'next-intl';
import Link from 'next/link';

import {
  type DashboardPeriod,
  type DashboardResponse,
  type DashboardTrendPoint,
  getCrmDashboard,
} from './dashboard-api';

import type { LeadStatus, LeadType } from '../leads/crm-api';

const NAVY = '#002b49';

const STATUS_ITEMS: {
  key: LeadStatus;
  label: string;
  color: string;
}[] = [
  {
    key: 'NEW',
    label: 'New',
    color: 'bg-blue-50 text-blue-700',
  },
  {
    key: 'IN_PROGRESS',
    label: 'In progress',
    color: 'bg-amber-50 text-amber-700',
  },
  {
    key: 'WAITING_CUSTOMER',
    label: 'Waiting customer',
    color: 'bg-violet-50 text-violet-700',
  },
  {
    key: 'OFFER_SENT',
    label: 'Offer sent',
    color: 'bg-sky-50 text-sky-700',
  },
  {
    key: 'WON',
    label: 'Won',
    color: 'bg-green-50 text-green-700',
  },
  {
    key: 'LOST',
    label: 'Lost',
    color: 'bg-slate-100 text-slate-600',
  },
  {
    key: 'SPAM',
    label: 'Spam',
    color: 'bg-red-50 text-red-700',
  },
];

const TYPE_ITEMS: {
  key: LeadType;
  label: string;
}[] = [
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

function shortDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    timeZone: 'UTC',
  }).format(date);
}

function fullDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

// Combine days into readable chart bars.
// 7 days = daily
// 30 days = 3-day groups
// 90 days = 7-day groups
function groupTrend(items: DashboardTrendPoint[], days: DashboardPeriod) {
  const groupSize = days === '7' ? 1 : days === '30' ? 3 : 7;

  const groups: {
    label: string;
    count: number;
  }[] = [];

  for (let index = 0; index < items.length; index += groupSize) {
    const group = items.slice(index, index + groupSize);

    const first = group[0];

    if (!first) continue;

    const count = group.reduce((sum, item) => sum + item.count, 0);

    groups.push({
      label: shortDate(`${first.date}T00:00:00Z`),
      count,
    });
  }

  return groups;
}

interface MetricCardProps {
  title: string;
  value: number | string;
  description: string;
  icon: React.ReactNode;
}

function MetricCard({ title, value, description, icon }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-slate-500">{title}</p>

        <div className="rounded-lg bg-slate-100 p-2 text-[#00528b]">{icon}</div>
      </div>

      <p className="mt-3 text-3xl font-bold text-[#002b49]">{value}</p>

      <p className="mt-2 text-xs text-slate-500">{description}</p>
    </div>
  );
}

export default function CrmDashboardPage() {
  const locale = useLocale();

  const [period, setPeriod] = useState<DashboardPeriod>('30');

  const [data, setData] = useState<DashboardResponse | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [revision, setRevision] = useState(0);

  const leadsUrl = `/${locale}/admin/leads`;

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    getCrmDashboard(period, controller.signal)
      .then(result => {
        if (!controller.signal.aborted) {
          setData(result);
        }
      })
      .catch(err => {
        if (controller.signal.aborted) {
          return;
        }

        setData(null);

        setError(
          err instanceof Error ? err.message : 'Failed to load CRM dashboard.'
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [period, revision]);

  const chart = useMemo(
    () => groupTrend(data?.trend ?? [], period),
    [data, period]
  );

  const maxCount = Math.max(1, ...chart.map(item => item.count));

  const total = data?.totals.leads ?? 0;

  const cards = [
    {
      title: 'Total Leads',
      value: data?.totals.leads ?? '—',
      description: `Received in the last ${period} days`,
      icon: <FiInbox size={19} />,
    },
    {
      title: 'New Requests',
      value: data?.totals.new ?? '—',
      description: 'Waiting for processing',
      icon: <FiFileText size={19} />,
    },
    {
      title: 'In Progress',
      value: data?.totals.inProgress ?? '—',
      description: 'Currently being handled',
      icon: <FiClock size={19} />,
    },
    {
      title: 'Won',
      value: data?.totals.won ?? '—',
      description: 'Successfully closed leads',
      icon: <FiCheckCircle size={19} />,
    },
  ];

  return (
    <main className="min-h-full bg-[#fcfcfd] text-[#002b49]">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white px-5 py-7 sm:px-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">CRM Dashboard</h1>

            <p className="mt-1 text-sm text-slate-500">
              Overview of customer inquiries and sales activity
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={leadsUrl}
              className="inline-flex items-center gap-2 rounded-full bg-[#002b49] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#00528b]"
            >
              View Leads
              <FiArrowRight />
            </Link>

            <button
              type="button"
              onClick={() => setRevision(value => value + 1)}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-full border border-[#002b49] px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
            >
              <FiRefreshCw className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>
      </header>

      <div className="space-y-6 p-4 sm:p-7">
        {/* PERIOD FILTER */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold">Business Overview</h2>

            <p className="text-xs text-slate-500">
              Statistics for leads received during the selected period
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
                onClick={() => setPeriod(value)}
                aria-pressed={period === value}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
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

        {/* ERROR */}
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {/* METRIC CARDS */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map(card => (
            <MetricCard key={card.title} {...card} />
          ))}
        </div>

        {loading && (
          <p role="status" className="text-sm text-slate-500">
            Updating CRM statistics...
          </p>
        )}

        {/* CHARTS */}
        <div className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
          {/* LEADS TREND */}
          <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-5">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-bold">Leads Overview</h2>

                <p className="mt-1 text-xs text-slate-500">
                  New inquiries received
                </p>
              </div>

              <FiTrendingUp size={20} className="text-[#00528b]" />
            </div>

            {!data ? (
              <div className="flex h-52 items-center justify-center text-sm text-slate-400">
                {loading ? 'Loading chart...' : 'No chart data available'}
              </div>
            ) : (
              <>
                <div
                  className="flex h-52 items-end gap-2"
                  role="img"
                  aria-label={`Daily inquiry trend, ${total} leads in the selected period`}
                >
                  {chart.map((item, index) => {
                    const height =
                      item.count === 0
                        ? 0
                        : Math.max(4, (item.count / maxCount) * 100);

                    return (
                      <div
                        key={`${item.label}-${index}`}
                        className="flex h-full min-w-0 flex-1 flex-col justify-end gap-2"
                      >
                        <div className="flex h-40 items-end justify-center rounded-lg bg-slate-50 px-1">
                          <div
                            title={`${item.count} leads`}
                            style={{
                              height: `${height}%`,
                            }}
                            className="w-full max-w-12 rounded-t-md bg-[#00528b] transition-all duration-300"
                          />
                        </div>

                        <p className="truncate text-center text-[10px] text-slate-500">
                          {item.label}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {total === 0 && (
                  <p className="mt-4 text-center text-xs text-slate-500">
                    No incoming leads during this period.
                  </p>
                )}
              </>
            )}
          </section>

          {/* REQUEST TYPES */}
          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="font-bold">Request Types</h2>

            <p className="mt-1 text-xs text-slate-500">
              Distribution of incoming inquiries
            </p>

            <div className="mt-7 space-y-7">
              {TYPE_ITEMS.map(item => {
                const count = data?.byType[item.key] ?? 0;

                const percentage =
                  total > 0 ? Math.round((count / total) * 100) : 0;

                return (
                  <div key={item.key}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium">{item.label}</span>

                      <span className="text-slate-500">
                        {count} ({percentage}%)
                      </span>
                    </div>

                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        style={{
                          width: `${percentage}%`,
                        }}
                        className="h-full rounded-full bg-[#00528b]"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* STATUS BREAKDOWN */}
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-bold">Lead Status Breakdown</h2>

              <p className="mt-1 text-xs text-slate-500">
                Current status of leads received in the selected period
              </p>
            </div>

            <span className="text-sm text-slate-500">{total} total</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {STATUS_ITEMS.map(item => {
              const count = data?.byStatus[item.key] ?? 0;

              return (
                <div
                  key={item.key}
                  className="flex items-center justify-between rounded-xl border border-slate-100 p-4"
                >
                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${item.color}`}
                  >
                    {item.label}
                  </span>

                  <span className="text-lg font-bold">{count}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* RECENT LEADS */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 p-5">
            <div>
              <h2 className="font-bold">Recent Leads</h2>

              <p className="mt-1 text-xs text-slate-500">
                Latest customer inquiries in the selected period
              </p>
            </div>

            <Link
              href={leadsUrl}
              className="flex items-center gap-2 text-sm font-semibold text-[#00528b] hover:underline"
            >
              View all
              <FiArrowRight />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
                <tr>
                  <th className="px-5 py-4">Customer</th>

                  <th className="px-5 py-4">Request</th>

                  <th className="px-5 py-4">Status</th>

                  <th className="px-5 py-4">Date</th>
                </tr>
              </thead>

              <tbody>
                {data?.recent.map(lead => {
                  const status = STATUS_ITEMS.find(
                    item => item.key === lead.status
                  );

                  const requestType = TYPE_ITEMS.find(
                    item => item.key === lead.type
                  );

                  return (
                    <tr
                      key={lead._id}
                      className="border-t border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold">{lead.customerName}</p>

                        <p className="mt-1 text-xs text-slate-500">
                          {lead.companyName || lead.email}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        {requestType?.label ?? lead.type}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                            status?.color ?? 'bg-slate-100'
                          }`}
                        >
                          {status?.label ?? lead.status}
                        </span>
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap text-slate-500">
                        {fullDate(lead.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {data && data.recent.length === 0 && (
            <div className="p-10 text-center text-sm text-slate-500">
              There are no recent leads to display.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
