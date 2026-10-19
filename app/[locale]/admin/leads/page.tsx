'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  FiChevronLeft,
  FiChevronRight,
  FiExternalLink,
  FiInbox,
  FiRefreshCw,
  FiSearch,
  FiSliders,
} from 'react-icons/fi';

import LeadDetailsDrawer from './LeadDetailsDrawer';
import {
  type CrmLead,
  type LeadStatus,
  type LeadType,
  getLeads,
} from './crm-api';

const PAGE_SIZE = 15;

const STATUSES: {
  value: LeadStatus | 'ALL';
  label: string;
}[] = [
  { value: 'ALL', label: 'All' },
  { value: 'NEW', label: 'New' },
  { value: 'IN_PROGRESS', label: 'In progress' },
  {
    value: 'WAITING_CUSTOMER',
    label: 'Waiting customer',
  },
  { value: 'OFFER_SENT', label: 'Offer sent' },
  { value: 'WON', label: 'Won' },
  { value: 'LOST', label: 'Lost' },
  { value: 'SPAM', label: 'Spam' },
];

const TYPES: {
  value: LeadType | 'ALL';
  label: string;
}[] = [
  { value: 'ALL', label: 'All request types' },
  {
    value: 'REQUEST_QUOTE',
    label: 'Request quote',
  },
  { value: 'SELL_TO_US', label: 'Sell to us' },
  { value: 'CONTACT_US', label: 'Contact us' },
];

const TYPE_LABELS: Record<LeadType, string> = {
  REQUEST_QUOTE: 'Request quote',
  SELL_TO_US: 'Sell to us',
  CONTACT_US: 'Contact us',
};

const STATUS_STYLES: Record<LeadStatus, string> = {
  NEW: 'bg-blue-50 text-blue-700',
  IN_PROGRESS: 'bg-amber-50 text-amber-700',
  WAITING_CUSTOMER: 'bg-violet-50 text-violet-700',
  OFFER_SENT: 'bg-sky-50 text-sky-700',
  WON: 'bg-green-50 text-green-700',
  LOST: 'bg-slate-100 text-slate-600',
  SPAM: 'bg-red-50 text-red-700',
};

function formatDate(value: string) {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? '—'
    : new Intl.DateTimeFormat('en-GB', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date);
}

function leadDescription(lead: CrmLead) {
  if (lead.type === 'REQUEST_QUOTE') {
    return (
      lead.requestedProducts?.map(product => product.name).join(', ') ||
      'Equipment inquiry'
    );
  }

  if (lead.type === 'SELL_TO_US') {
    return lead.equipmentDescription || 'Equipment offer';
  }

  return lead.subject || lead.message || 'Contact request';
}

export default function LeadsPage() {
  const [status, setStatus] = useState<LeadStatus | 'ALL'>('ALL');

  const [type, setType] = useState<LeadType | 'ALL'>('ALL');

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [page, setPage] = useState(1);
  const [leads, setLeads] = useState<CrmLead[]>([]);

  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [revision, setRevision] = useState(0);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Search debounce
  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedSearch(search), 350);

    return () => window.clearTimeout(timeout);
  }, [search]);

  // Fetch leads from NestJS
  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    getLeads(
      {
        status,
        type,
        search: debouncedSearch,
        page,
        limit: PAGE_SIZE,
      },
      controller.signal
    )
      .then(data => {
        if (controller.signal.aborted) return;

        setLeads(data.items);
        setTotal(data.total);
      })
      .catch(err => {
        if (controller.signal.aborted) return;

        setError(err instanceof Error ? err.message : 'Failed to load leads.');

        setLeads([]);
        setTotal(0);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [status, type, debouncedSearch, page, revision]);

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const pageStats = useMemo(
    () => ({
      newLeads: leads.filter(lead => lead.status === 'NEW').length,

      inProgress: leads.filter(lead => lead.status === 'IN_PROGRESS').length,

      quotes: leads.filter(lead => lead.type === 'REQUEST_QUOTE').length,
    }),
    [leads]
  );

  const setStatusFilter = (value: LeadStatus | 'ALL') => {
    setStatus(value);
    setPage(1);
  };

  const setTypeFilter = (value: LeadType | 'ALL') => {
    setType(value);
    setPage(1);
  };

  const onSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const reload = () => {
    setRevision(value => value + 1);
  };

  return (
    <div className="min-h-full bg-[#fcfcfd] text-[#002b49]">
      {/* Page header */}
      <header className="border-b border-slate-200 bg-white px-5 py-7 sm:px-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Customer Leads</h1>

            <p className="mt-1 text-sm text-slate-500">
              Incoming customer inquiries and equipment requests
            </p>
          </div>

          <button
            type="button"
            onClick={reload}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full border border-[#002b49] px-4 py-2 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50"
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </header>

      <div className="space-y-6 px-4 py-6 sm:px-7">
        {/* Statistics */}
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: 'Matching leads',
              count: total,
            },
            {
              label: 'New · current page',
              count: pageStats.newLeads,
            },
            {
              label: 'In progress · current page',
              count: pageStats.inProgress,
            },
            {
              label: 'Quotes · current page',
              count: pageStats.quotes,
            },
          ].map(stat => (
            <div
              key={stat.label}
              className="rounded-xl border border-slate-200 bg-white px-5 py-4"
            >
              <p className="text-xs font-medium text-slate-500">{stat.label}</p>

              <p className="mt-2 text-3xl font-bold text-[#002b49]">
                {stat.count}
              </p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="flex flex-wrap gap-2">
            {STATUSES.slice(0, 7).map(item => (
              <button
                key={item.value}
                type="button"
                onClick={() => setStatusFilter(item.value)}
                aria-pressed={status === item.value}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  status === item.value
                    ? 'border-[#002b49] bg-[#002b49] text-white'
                    : 'border-[#002b49] bg-white text-[#002b49] hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-[minmax(230px,1fr)_220px_180px]">
            {/* Search */}
            <label className="relative block">
              <span className="sr-only">Search leads</span>

              <FiSearch className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={event => onSearch(event.target.value)}
                placeholder="Search name, company, email, subject..."
                className="w-full rounded-full border border-slate-200 py-2.5 pr-4 pl-10 text-sm outline-none focus:border-[#00528b]"
              />
            </label>

            {/* Type filter */}
            <label className="relative flex items-center gap-2 rounded-full border border-slate-200 px-3">
              <FiSliders className="shrink-0 text-slate-500" />

              <span className="sr-only">Request type</span>

              <select
                value={type}
                onChange={event =>
                  setTypeFilter(event.target.value as LeadType | 'ALL')
                }
                className="w-full bg-transparent py-2.5 text-sm outline-none"
              >
                {TYPES.map(item => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            {/* Status filter */}
            <label className="rounded-full border border-slate-200 px-3">
              <span className="sr-only">Status</span>

              <select
                value={status}
                onChange={event =>
                  setStatusFilter(event.target.value as LeadStatus | 'ALL')
                }
                className="w-full bg-transparent py-2.5 text-sm outline-none"
              >
                {STATUSES.map(item => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {/* Leads table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-2 font-semibold">
              <FiInbox />
              Leads list
            </div>

            <span className="text-xs text-slate-500">{total} results</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left text-sm">
              <thead className="bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
                <tr>
                  <th className="px-5 py-4 font-semibold">Customer</th>

                  <th className="px-5 py-4 font-semibold">Request</th>

                  <th className="px-5 py-4 font-semibold">Status</th>

                  <th className="px-5 py-4 font-semibold">Priority</th>

                  <th className="px-5 py-4 font-semibold">Received</th>

                  <th className="px-5 py-4 text-right font-semibold">
                    Details
                  </th>
                </tr>
              </thead>

              <tbody>
                {!loading &&
                  leads.map(lead => (
                    <tr
                      key={lead._id}
                      className="border-t border-slate-100 hover:bg-slate-50/70"
                    >
                      {/* Customer */}
                      <td className="px-5 py-4">
                        <p className="font-semibold text-[#002b49]">
                          {lead.customerName}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-500">
                          {lead.companyName || lead.email}
                        </p>
                      </td>

                      {/* Request */}
                      <td className="max-w-[260px] px-5 py-4">
                        <p className="font-medium">{TYPE_LABELS[lead.type]}</p>

                        <p
                          className="mt-0.5 truncate text-xs text-slate-500"
                          title={leadDescription(lead)}
                        >
                          {leadDescription(lead)}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap ${
                            STATUS_STYLES[lead.status]
                          }`}
                        >
                          {STATUSES.find(item => item.value === lead.status)
                            ?.label ?? lead.status}
                        </span>
                      </td>

                      {/* Priority */}
                      <td className="px-5 py-4 text-slate-600 capitalize">
                        {lead.priority?.toLowerCase() || '—'}
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 whitespace-nowrap text-slate-600">
                        {formatDate(lead.createdAt)}
                      </td>

                      {/* Open details */}
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedId(lead._id)}
                          className="inline-flex items-center gap-1 rounded-full border border-[#002b49] px-3 py-1.5 font-semibold text-[#002b49] hover:bg-[#002b49] hover:text-white"
                        >
                          Open
                          <FiExternalLink />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {loading && (
              <div className="p-10 text-center text-sm text-slate-500">
                Loading leads...
              </div>
            )}

            {!loading && !error && leads.length === 0 && (
              <div className="p-12 text-center text-sm text-slate-500">
                No leads found. Try another filter or search term.
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4">
            <p className="text-xs text-slate-500">
              Page {page} of {pageCount} · {PAGE_SIZE} per page
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1 || loading}
                onClick={() => setPage(value => Math.max(1, value - 1))}
                className="rounded-lg border border-slate-200 p-2 disabled:opacity-40"
                aria-label="Previous page"
              >
                <FiChevronLeft />
              </button>

              <button
                type="button"
                disabled={page >= pageCount || loading}
                onClick={() => setPage(value => value + 1)}
                className="rounded-lg border border-slate-200 p-2 disabled:opacity-40"
                aria-label="Next page"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lead details drawer */}
      <LeadDetailsDrawer
        id={selectedId}
        onClose={() => setSelectedId(null)}
        onChanged={reload}
      />
    </div>
  );
}
