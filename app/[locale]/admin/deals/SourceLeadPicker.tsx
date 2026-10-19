'use client';

import { useEffect, useState } from 'react';
import { FiCheck, FiSearch, FiX } from 'react-icons/fi';

import { type CrmLead, getLead } from '../leads/crm-api';

interface Props {
  value: string | null;
  onSelect: (lead: CrmLead | null) => void;
}

const LEAD_TYPES: Record<CrmLead['type'], string> = {
  REQUEST_QUOTE: 'Request quote',
  SELL_TO_US: 'Sell to us',
  CONTACT_US: 'Contact us',
};

async function searchLeads(
  search: string,
  signal: AbortSignal
): Promise<CrmLead[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is not configured');
  }

  const params = new URLSearchParams({
    page: '1',
    limit: '10',
  });

  if (search.trim()) {
    params.set('search', search.trim());
  }

  const response = await fetch(
    `${apiUrl.replace(/\/+$/, '')}/crm/leads?${params.toString()}`,
    {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
      signal,
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to load leads (${response.status})`);
  }

  const result = (await response.json()) as {
    items?: CrmLead[];
  };

  if (!Array.isArray(result.items)) {
    throw new Error('Unexpected leads API response format');
  }

  return result.items;
}

export default function SourceLeadPicker({ value, onSelect }: Props) {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  const [results, setResults] = useState<CrmLead[]>([]);

  const [selected, setSelected] = useState<CrmLead | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // Resolve the lead name when editing
  // a Deal that already has a linked Lead.
  useEffect(() => {
    if (!value) {
      setSelected(null);
      return;
    }

    if (selected?._id === value) {
      return;
    }

    let active = true;

    getLead(value)
      .then(lead => {
        if (active) {
          setSelected(lead);
        }
      })
      .catch(() => {
        if (active) {
          setError('Could not load the linked lead.');
        }
      });

    return () => {
      active = false;
    };
  }, [value, selected?._id]);

  // Search only when the manager
  // opens the selector.
  useEffect(() => {
    if (!open) return;

    const controller = new AbortController();

    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        const leads = await searchLeads(search, controller.signal);

        if (!controller.signal.aborted) {
          setResults(leads);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setResults([]);

          setError(
            err instanceof Error ? err.message : 'Failed to search leads.'
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [open, search]);

  function selectLead(lead: CrmLead) {
    setSelected(lead);
    setSearch('');
    setOpen(false);
    setError(null);

    onSelect(lead);
  }

  function removeLead() {
    setSelected(null);
    setSearch('');
    setOpen(false);
    setError(null);

    onSelect(null);
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <h3 className="font-semibold text-[#002b49]">Related Customer Inquiry</h3>

      <p className="mt-1 text-xs text-slate-500">
        Optional. Find a customer inquiry to automatically fill in the customer
        information.
      </p>

      {selected && (
        <div className="mt-4 flex items-start justify-between gap-3 rounded-lg border border-green-200 bg-green-50 p-3">
          <div className="flex min-w-0 gap-2">
            <FiCheck className="mt-0.5 shrink-0 text-green-700" />

            <div className="min-w-0">
              <p className="text-sm font-semibold text-green-900">
                {selected.customerName}
              </p>

              {selected.companyName && (
                <p className="mt-1 text-xs text-green-800">
                  {selected.companyName}
                </p>
              )}

              <p className="mt-1 text-xs break-all text-green-800">
                {selected.email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={removeLead}
            aria-label="Remove linked inquiry"
            className="rounded-lg p-1 text-green-800 hover:bg-green-100"
          >
            <FiX />
          </button>
        </div>
      )}

      <div className="relative mt-4">
        <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />

        <input
          type="search"
          maxLength={100}
          value={search}
          onFocus={() => setOpen(true)}
          onChange={event => {
            setSearch(event.target.value);
            setOpen(true);
          }}
          placeholder="Search customer, company, email or subject..."
          aria-label="Search customer inquiries"
          className="w-full rounded-lg border border-slate-300 bg-white py-3 pr-4 pl-10 text-sm outline-none focus:border-[#00528b]"
        />
      </div>

      {open && (
        <div className="mt-3 overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b bg-slate-50 px-3 py-2">
            <span className="text-xs font-semibold text-slate-600">
              {search.trim() ? 'Matching inquiries' : 'Recent inquiries'}
            </span>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close search results"
              className="p-1 text-slate-500"
            >
              <FiX />
            </button>
          </div>

          {loading ? (
            <p className="p-4 text-sm text-slate-500">Searching inquiries...</p>
          ) : results.length === 0 ? (
            <p className="p-4 text-sm text-slate-500">
              No matching inquiries. You can create this deal without a linked
              inquiry.
            </p>
          ) : (
            <div className="max-h-60 overflow-y-auto">
              {results.map(lead => (
                <button
                  key={lead._id}
                  type="button"
                  onClick={() => selectLead(lead)}
                  className="w-full border-b border-slate-100 px-4 py-3 text-left last:border-b-0 hover:bg-blue-50"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-[#002b49]">
                      {lead.customerName}
                    </p>

                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                      {LEAD_TYPES[lead.type]}
                    </span>
                  </div>

                  {lead.companyName && (
                    <p className="mt-1 text-xs text-slate-600">
                      {lead.companyName}
                    </p>
                  )}

                  <p className="mt-1 text-xs break-all text-slate-500">
                    {lead.email}
                  </p>

                  {lead.subject && (
                    <p className="mt-2 line-clamp-2 text-xs text-slate-500">
                      {lead.subject}
                    </p>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}
    </section>
  );
}
