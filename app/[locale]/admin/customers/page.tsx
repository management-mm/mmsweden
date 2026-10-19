'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiMail,
  FiPhone,
  FiRefreshCw,
  FiSearch,
  FiUsers,
  FiX,
} from 'react-icons/fi';

import {
  type Customer,
  type CustomerDetails,
  getCustomerDetails,
  getCustomers,
} from './customers-api';

const PAGE_SIZE = 15;

function formatDate(value: string): string {
  if (!value) return '—';

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

const TYPE_LABELS: Record<string, string> = {
  REQUEST_QUOTE: 'Request quote',
  SELL_TO_US: 'Sell to us',
  CONTACT_US: 'Contact us',
};

const STATUS_LABELS: Record<string, string> = {
  NEW: 'New',
  IN_PROGRESS: 'In progress',
  WAITING_CUSTOMER: 'Waiting customer',
  OFFER_SENT: 'Offer sent',
  WON: 'Won',
  LOST: 'Lost',
  SPAM: 'Spam',
};

function CustomerDrawer({
  customerId,
  onClose,
}: {
  customerId: string;
  onClose: () => void;
}) {
  const [data, setData] = useState<CustomerDetails | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError(null);
    setData(null);

    getCustomerDetails(customerId, controller.signal)
      .then(result => {
        if (!controller.signal.aborted) {
          setData(result);
        }
      })
      .catch(err => {
        if (!controller.signal.aborted) {
          setError(
            err instanceof Error ? err.message : 'Failed to load customer.'
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [customerId]);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close customer details"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/40"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="customer-title"
        className="relative flex h-full w-full max-w-[650px] flex-col bg-white shadow-2xl"
      >
        <header className="flex items-start justify-between border-b border-slate-200 p-6">
          <div>
            <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
              CRM / Customers
            </p>

            <h2
              id="customer-title"
              className="mt-1 text-xl font-bold text-[#002b49]"
            >
              {data?.customer.customerName || 'Customer details'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg border p-2 hover:bg-slate-50"
          >
            <FiX size={20} />
          </button>
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          {loading && (
            <p className="text-sm text-slate-500">Loading customer...</p>
          )}

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-4 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          {data && (
            <>
              {/* CONTACT INFORMATION */}
              <section className="rounded-xl border border-slate-200 p-5">
                <h3 className="mb-4 font-bold text-[#002b49]">
                  Contact Information
                </h3>

                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-slate-500">Company</p>
                    <p className="font-medium">
                      {data.customer.companyName || '—'}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500">Country</p>
                    <p className="font-medium">
                      {data.customer.country || '—'}
                    </p>
                  </div>

                  <a
                    href={`mailto:${data.customer.email}`}
                    className="flex items-center gap-2 break-all text-[#00528b] hover:underline"
                  >
                    <FiMail />
                    {data.customer.email}
                  </a>

                  {data.customer.phone && (
                    <div className="flex items-center gap-2">
                      <FiPhone />
                      {data.customer.countryPhone} {data.customer.phone}
                    </div>
                  )}

                  <div className="border-t pt-3 text-slate-500">
                    First contact: {formatDate(data.customer.firstContactAt)}
                  </div>
                </div>
              </section>

              {/* HISTORY */}
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-bold text-[#002b49]">Inquiry History</h3>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">
                    {data.totalLeads} requests
                  </span>
                </div>

                {data.hasMore && (
                  <p className="mb-3 text-xs text-amber-700">
                    Showing the latest 100 requests.
                  </p>
                )}

                <div className="space-y-3">
                  {data.leads.map(lead => (
                    <article
                      key={lead.id}
                      className="rounded-xl border border-slate-200 p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-semibold text-[#002b49]">
                          {TYPE_LABELS[lead.type] ?? lead.type}
                        </span>

                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">
                          {STATUS_LABELS[lead.status] ?? lead.status}
                        </span>
                      </div>

                      <p className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                        <FiClock />
                        {formatDate(lead.createdAt)}
                      </p>

                      {lead.subject && (
                        <p className="mt-3 font-medium">{lead.subject}</p>
                      )}

                      {(lead.message || lead.equipmentDescription) && (
                        <p className="mt-2 text-sm break-words whitespace-pre-wrap text-slate-600">
                          {lead.message || lead.equipmentDescription}
                        </p>
                      )}

                      {lead.askingPrice && (
                        <p className="mt-3 text-sm">
                          Asking price: <strong>{lead.askingPrice}</strong>
                        </p>
                      )}

                      {lead.requestedProducts?.length > 0 && (
                        <div className="mt-3 rounded-lg bg-slate-50 p-3">
                          <p className="mb-2 text-xs font-semibold">
                            Requested Equipment
                          </p>

                          {lead.requestedProducts.map((product, index) => (
                            <p
                              key={`${product.idNumber}-${index}`}
                              className="text-sm text-slate-700"
                            >
                              {product.name} — {product.idNumber}
                            </p>
                          ))}
                        </div>
                      )}

                      {lead.equipmentPhotos?.length > 0 && (
                        <div className="mt-3 space-y-1 text-sm">
                          <p className="font-medium">Equipment photos</p>

                          {lead.equipmentPhotos.map(
                            (photo, index) =>
                              photo.startsWith('https://') && (
                                <a
                                  key={`${index}-${photo}`}
                                  href={photo}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block text-[#00528b] hover:underline"
                                >
                                  Photo {index + 1} ↗
                                </a>
                              )
                          )}
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalLeads, setTotalLeads] = useState(0);

  const [activeCustomers, setActiveCustomers] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [revision, setRevision] = useState(0);

  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null
  );

  // Search debounce
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [search]);

  // Load customers
  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    getCustomers(page, debouncedSearch, controller.signal)
      .then(result => {
        if (controller.signal.aborted) return;

        setCustomers(result.items);
        setTotal(result.total);
        setTotalLeads(result.totalLeads);
        setActiveCustomers(result.activeCustomers);
      })
      .catch(err => {
        if (controller.signal.aborted) return;

        setError(
          err instanceof Error ? err.message : 'Failed to load customers.'
        );

        setCustomers([]);
        setTotal(0);
        setTotalLeads(0);
        setActiveCustomers(0);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [page, debouncedSearch, revision]);

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const refresh = () => {
    setRevision(value => value + 1);
  };

  const closeCustomer = useCallback(() => {
    setSelectedCustomerId(null);
  }, []);

  return (
    <main className="min-h-full bg-[#fcfcfd] text-[#002b49]">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white px-6 py-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Customers</h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage customers and view their inquiry history
            </p>
          </div>

          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            className="flex items-center gap-2 rounded-full border border-[#002b49] px-4 py-2 text-sm font-semibold disabled:opacity-50"
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </header>

      <div className="space-y-6 p-6">
        {/* STATISTICS */}
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              label: 'Matching Customers',
              value: total,
              icon: <FiUsers size={20} />,
            },
            {
              label: 'Active Customers',
              value: activeCustomers,
              icon: <FiClock size={20} />,
            },
            {
              label: 'Total Inquiries',
              value: totalLeads,
              icon: <FiMail size={20} />,
            },
          ].map(stat => (
            <div
              key={stat.label}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <div className="flex items-center justify-between text-slate-500">
                <p className="text-sm">{stat.label}</p>
                {stat.icon}
              </div>

              <p className="mt-3 text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* SEARCH */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <label className="relative block">
            <span className="sr-only">Search customers</span>

            <FiSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Search by name, email or company..."
              className="w-full rounded-full border border-slate-200 px-11 py-3 text-sm outline-none focus:border-[#00528b]"
            />
          </label>
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {/* CUSTOMERS TABLE */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <h2 className="font-bold">Customer Database</h2>

            <span className="text-xs text-slate-500">{total} customers</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
                <tr>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Country</th>
                  <th className="px-5 py-4">Inquiries</th>
                  <th className="px-5 py-4">Active</th>
                  <th className="px-5 py-4">Last Contact</th>
                  <th className="px-5 py-4 text-right">Details</th>
                </tr>
              </thead>

              <tbody>
                {!loading &&
                  customers.map(customer => (
                    <tr
                      key={customer.id}
                      className="border-t border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold">{customer.customerName}</p>

                        {customer.companyName && (
                          <p className="text-xs text-slate-500">
                            {customer.companyName}
                          </p>
                        )}

                        <p className="mt-1 text-xs text-[#00528b]">
                          {customer.email}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {customer.country || '—'}
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-blue-50 px-3 py-1.5 font-semibold text-blue-700">
                          {customer.leadCount}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        {customer.activeLeads > 0 ? (
                          <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                            {customer.activeLeads} active
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {formatDate(customer.lastContactAt)}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedCustomerId(customer.id)}
                          className="inline-flex items-center gap-2 rounded-full border border-[#002b49] px-4 py-2 font-semibold hover:bg-[#002b49] hover:text-white"
                        >
                          Open
                          <FiArrowRight />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {loading && (
              <div className="p-10 text-center text-sm text-slate-500">
                Loading customers...
              </div>
            )}

            {!loading && !error && customers.length === 0 && (
              <div className="p-12 text-center text-sm text-slate-500">
                No customers found.
              </div>
            )}
          </div>

          {/* PAGINATION */}
          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
            <p className="text-xs text-slate-500">
              Page {page} of {pageCount}
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={page === 1 || loading}
                onClick={() => setPage(value => Math.max(1, value - 1))}
                className="rounded-lg border p-2 disabled:opacity-40"
                aria-label="Previous page"
              >
                <FiChevronLeft />
              </button>

              <button
                type="button"
                disabled={page >= pageCount || loading}
                onClick={() => setPage(value => value + 1)}
                className="rounded-lg border p-2 disabled:opacity-40"
                aria-label="Next page"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        </section>
      </div>

      {selectedCustomerId && (
        <CustomerDrawer
          customerId={selectedCustomerId}
          onClose={closeCustomer}
        />
      )}
    </main>
  );
}
