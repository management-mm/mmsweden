'use client';

import { useEffect, useState } from 'react';
import {
  FiChevronLeft,
  FiChevronRight,
  FiEdit2,
  FiFileText,
  FiPlus,
  FiPrinter,
  FiRefreshCw,
  FiSearch,
} from 'react-icons/fi';

import { useLocale } from 'next-intl';
import Link from 'next/link';

import QuotationEditor from './QuotationEditor';
import {
  ALLOWED_NEXT,
  QUOTATION_STATUSES,
  type Quotation,
  type QuotationStats,
  type QuotationStatus,
  STATUS_LABELS,
  changeQuotationStatus,
  formatMoney,
  getQuotation,
  getQuotationStats,
  getQuotations,
} from './quotations-api';

const PAGE_SIZE = 12;

const STATUS_COLORS: Record<QuotationStatus, string> = {
  DRAFT: 'bg-slate-100 text-slate-600',
  ISSUED: 'bg-blue-50 text-blue-700',
  ACCEPTED: 'bg-green-50 text-green-700',
  DECLINED: 'bg-red-50 text-red-700',
  VOID: 'bg-slate-100 text-slate-400',
};

function dateText(value?: string | null) {
  if (!value) return '—';

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? '—'
    : new Intl.DateTimeFormat('en-GB', {
        dateStyle: 'medium',
      }).format(date);
}

export default function QuotationsPage() {
  const locale = useLocale();

  const [items, setItems] = useState<Quotation[]>([]);

  const [stats, setStats] = useState<QuotationStats | null>(null);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [status, setStatus] = useState<QuotationStatus | 'ALL'>('ALL');

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [revision, setRevision] = useState(0);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [selected, setSelected] = useState<Quotation | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editorOpen, setEditorOpen] = useState(false);

  const [editing, setEditing] = useState<Quotation | null>(null);

  const [initialDealId, setInitialDealId] = useState<string | null>(null);

  // Support /admin/quotations?dealId=...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const dealId = params.get('dealId');

    if (dealId && /^[a-f\d]{24}$/i.test(dealId)) {
      setInitialDealId(dealId);
      setEditing(null);
      setEditorOpen(true);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    Promise.all([
      getQuotations(
        {
          page,
          limit: PAGE_SIZE,
          search: debouncedSearch,
          status,
        },
        controller.signal
      ),
      getQuotationStats(controller.signal),
    ])
      .then(([result, statistics]) => {
        if (controller.signal.aborted) {
          return;
        }

        setItems(result.items);
        setTotal(result.total);
        setStats(statistics);

        setSelectedId(previous => previous ?? result.items[0]?._id ?? null);
      })
      .catch(err => {
        if (controller.signal.aborted) {
          return;
        }

        setItems([]);
        setTotal(0);
        setStats(null);

        setError(
          err instanceof Error ? err.message : 'Failed to load quotations.'
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [page, debouncedSearch, status, revision]);

  useEffect(() => {
    if (!selectedId) {
      setSelected(null);
      return;
    }

    const controller = new AbortController();

    setLoadingDetail(true);

    getQuotation(selectedId, controller.signal)
      .then(result => {
        if (!controller.signal.aborted) {
          setSelected(result);
        }
      })
      .catch(err => {
        if (!controller.signal.aborted) {
          setSelected(null);

          setError(
            err instanceof Error ? err.message : 'Failed to open quotation.'
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoadingDetail(false);
        }
      });

    return () => controller.abort();
  }, [selectedId, revision]);

  const refresh = () => {
    setRevision(value => value + 1);
  };

  const onSaved = (quote: Quotation) => {
    setEditorOpen(false);
    setEditing(null);
    setInitialDealId(null);

    setSelectedId(quote._id);
    setSelected(quote);

    refresh();
  };

  async function updateStatus(next: QuotationStatus) {
    if (!selected || busy) return;

    if (
      !window.confirm(
        `Change ${selected.number} to ${STATUS_LABELS[next]}?` +
          (next === 'ISSUED' ? '\nThe content can no longer be edited.' : '')
      )
    ) {
      return;
    }

    setBusy(true);
    setError(null);

    try {
      const updated = await changeQuotationStatus(
        selected._id,
        next,
        selected.version
      );

      setSelected(updated);
      refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not change quotation status.'
      );

      refresh();
    } finally {
      setBusy(false);
    }
  }

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main className="min-h-full bg-[#fcfcfd] text-[#002b49]">
      <header className="border-b border-slate-200 bg-white px-5 py-7 sm:px-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Quotations</h1>

            <p className="mt-1 text-sm text-slate-500">
              Prepare and manage commercial offers for industrial equipment
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={refresh}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm disabled:opacity-50"
            >
              <FiRefreshCw className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>

            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setInitialDealId(null);
                setEditorOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-full bg-[#002b49] px-5 py-2.5 text-sm font-semibold text-white"
            >
              <FiPlus />
              New Quotation
            </button>
          </div>
        </div>
      </header>

      <div className="space-y-6 p-4 sm:p-7">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: 'Total quotations',
              value: stats?.total ?? '—',
            },
            {
              label: 'Drafts',
              value: stats?.draft ?? '—',
            },
            {
              label: 'Issued',
              value: stats?.issued ?? '—',
            },
            {
              label: 'Accepted',
              value: stats?.accepted ?? '—',
            },
          ].map(card => (
            <div
              key={card.label}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <p className="text-sm text-slate-500">{card.label}</p>

              <p className="mt-3 text-3xl font-bold">{card.value}</p>
            </div>
          ))}
        </div>

        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_180px]">
            <label className="relative">
              <FiSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />

              <input
                aria-label="Search quotations"
                maxLength={100}
                value={search}
                onChange={event => setSearch(event.target.value)}
                placeholder="Search number, customer or equipment..."
                className="w-full rounded-full border py-3 pr-4 pl-11 text-sm"
              />
            </label>

            <select
              value={status}
              aria-label="Filter status"
              onChange={event => {
                setStatus(event.target.value as QuotationStatus | 'ALL');
                setPage(1);
              }}
              className="rounded-full border bg-white px-4 py-3 text-sm"
            >
              <option value="ALL">All statuses</option>

              {QUOTATION_STATUSES.map(item => (
                <option key={item} value={item}>
                  {STATUS_LABELS[item]}
                </option>
              ))}
            </select>
          </div>
        </section>

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <div className="grid items-start gap-5 xl:grid-cols-[minmax(320px,0.9fr)_minmax(0,1.5fr)]">
          {/* Document list */}
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="font-bold">Documents</h2>

              <span className="text-xs text-slate-500">{total} results</span>
            </div>

            {loading && (
              <p className="p-6 text-sm text-slate-500">
                Loading quotations...
              </p>
            )}

            {!loading && items.length === 0 && !error && (
              <div className="p-8 text-center">
                <FiFileText size={28} className="mx-auto text-slate-400" />

                <p className="mt-3 text-sm text-slate-500">
                  No quotations found.
                </p>
              </div>
            )}

            <div className="divide-y divide-slate-100">
              {!loading &&
                items.map(quote => (
                  <button
                    key={quote._id}
                    type="button"
                    onClick={() => setSelectedId(quote._id)}
                    className={`w-full p-4 text-left transition ${
                      selectedId === quote._id
                        ? 'bg-blue-50'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-[#002b49]">
                        {quote.number}
                      </span>

                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          STATUS_COLORS[quote.status]
                        }`}
                      >
                        {STATUS_LABELS[quote.status]}
                      </span>
                    </div>

                    <p className="mt-2 line-clamp-1 text-sm font-medium">
                      {quote.title}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {quote.companyName || quote.customerName}
                    </p>

                    <div className="mt-3 flex items-center justify-between gap-2">
                      <strong className="text-sm">
                        {formatMoney(quote.total, quote.currency)}
                      </strong>

                      <span className="text-xs text-slate-400">
                        {dateText(quote.createdAt)}
                      </span>
                    </div>
                  </button>
                ))}
            </div>

            <div className="flex items-center justify-between border-t p-4">
              <span className="text-xs text-slate-500">
                Page {page} / {pageCount}
              </span>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={loading || page <= 1}
                  onClick={() => setPage(value => value - 1)}
                  aria-label="Previous page"
                  className="rounded-lg border p-2 disabled:opacity-40"
                >
                  <FiChevronLeft />
                </button>

                <button
                  type="button"
                  disabled={loading || page >= pageCount}
                  onClick={() => setPage(value => value + 1)}
                  aria-label="Next page"
                  className="rounded-lg border p-2 disabled:opacity-40"
                >
                  <FiChevronRight />
                </button>
              </div>
            </div>
          </section>

          {/* Selected document */}
          <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 sm:p-7">
            {loadingDetail ? (
              <p className="text-sm text-slate-500">Loading document...</p>
            ) : !selected ? (
              <div className="py-14 text-center text-sm text-slate-500">
                Select a quotation to see its details.
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs tracking-wide text-slate-500 uppercase">
                      Commercial Offer
                    </p>

                    <h2 className="mt-2 text-2xl font-bold">
                      {selected.number}
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                      {selected.title}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                      STATUS_COLORS[selected.status]
                    }`}
                  >
                    {STATUS_LABELS[selected.status]}
                  </span>
                </div>

                <div className="mt-6 grid gap-4 rounded-xl bg-slate-50 p-5 text-sm sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-slate-500">Customer</p>

                    <p className="mt-1 font-semibold">
                      {selected.customerName}
                    </p>

                    <p className="mt-1 text-slate-600">
                      {selected.companyName}
                    </p>

                    <p className="mt-1 break-all text-[#00528b]">
                      {selected.customerEmail}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Created</p>

                    <p className="mt-1 font-medium">
                      {dateText(selected.createdAt)}
                    </p>

                    <p className="mt-3 text-xs text-slate-500">Valid until</p>

                    <p className="mt-1 font-medium">
                      {dateText(selected.validUntil)}
                    </p>
                  </div>
                </div>

                <h3 className="mt-7 font-bold">Equipment</h3>

                <div className="mt-3 overflow-x-auto">
                  <table className="w-full min-w-[400px] text-left text-sm">
                    <thead className="border-b text-xs text-slate-500">
                      <tr>
                        <th className="py-3">Item</th>
                        <th className="py-3 text-center">Qty</th>
                        <th className="py-3 text-right">Price</th>
                      </tr>
                    </thead>

                    <tbody>
                      {selected.items.map((item, index) => (
                        <tr key={index} className="border-b border-slate-100">
                          <td className="py-4">
                            <p className="font-medium">{item.name}</p>

                            <p className="mt-1 text-xs text-slate-500">
                              {item.idNumber || 'No equipment ID'}
                            </p>
                          </td>

                          <td className="py-4 text-center">{item.quantity}</td>

                          <td className="py-4 text-right font-medium">
                            {formatMoney(
                              item.unitPrice * item.quantity,
                              selected.currency
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-5 ml-auto max-w-[300px] space-y-2 text-sm">
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">Subtotal</span>
                    <span>
                      {formatMoney(selected.subtotal, selected.currency)}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">
                      Discount ({selected.discountPercent}%)
                    </span>
                    <span>
                      −{formatMoney(selected.discountAmount, selected.currency)}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">Shipping</span>
                    <span>
                      {formatMoney(selected.shippingCost, selected.currency)}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">
                      VAT ({selected.vatPercent}%)
                    </span>
                    <span>
                      {formatMoney(selected.vatAmount, selected.currency)}
                    </span>
                  </div>

                  <div className="flex justify-between border-t pt-3 text-lg font-bold">
                    <span>Total</span>
                    <span>
                      {formatMoney(selected.total, selected.currency)}
                    </span>
                  </div>
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    href={`/${locale}/admin/quotations/${selected._id}/print`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#002b49] px-5 py-2.5 text-sm font-semibold text-white"
                  >
                    <FiPrinter />
                    Preview / PDF
                  </Link>

                  {selected.status === 'DRAFT' && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(selected);
                        setInitialDealId(null);
                        setEditorOpen(true);
                      }}
                      className="inline-flex items-center gap-2 rounded-full border border-[#002b49] px-5 py-2.5 text-sm font-semibold"
                    >
                      <FiEdit2 />
                      Edit draft
                    </button>
                  )}
                </div>

                {ALLOWED_NEXT[selected.status].length > 0 && (
                  <section className="mt-7 border-t pt-5">
                    <h3 className="mb-3 font-bold">Quotation workflow</h3>

                    <div className="flex flex-wrap gap-2">
                      {ALLOWED_NEXT[selected.status].map(next => (
                        <button
                          key={next}
                          type="button"
                          disabled={busy}
                          onClick={() => void updateStatus(next)}
                          className="rounded-full border px-4 py-2 text-xs font-semibold hover:bg-slate-50 disabled:opacity-50"
                        >
                          Mark as {STATUS_LABELS[next]}
                        </button>
                      ))}
                    </div>
                  </section>
                )}

                <section className="mt-7 border-t pt-5">
                  <h3 className="font-bold">Status history</h3>

                  {selected.statusHistory.length === 0 ? (
                    <p className="mt-3 text-sm text-slate-500">
                      No changes yet.
                    </p>
                  ) : (
                    <div className="mt-3 space-y-3">
                      {[...selected.statusHistory]
                        .reverse()
                        .map((event, index) => (
                          <p
                            key={`${event.at}-${index}`}
                            className="text-sm text-slate-600"
                          >
                            {dateText(event.at)}: {STATUS_LABELS[event.from]}
                            {' → '}
                            {STATUS_LABELS[event.to]}
                          </p>
                        ))}
                    </div>
                  )}
                </section>
              </>
            )}
          </section>
        </div>
      </div>

      {editorOpen && (
        <QuotationEditor
          key={editing?._id ?? initialDealId ?? 'new'}
          quotation={editing}
          initialDealId={initialDealId}
          onClose={() => {
            setEditorOpen(false);
            setEditing(null);
            setInitialDealId(null);
          }}
          onSaved={onSaved}
        />
      )}
    </main>
  );
}
