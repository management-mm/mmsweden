'use client';

import { type FormEvent, useEffect, useState } from 'react';
import {
  FiArrowUpRight,
  FiCheck,
  FiClock,
  FiMail,
  FiPhone,
  FiRefreshCw,
  FiSearch,
  FiSend,
  FiUser,
  FiX,
} from 'react-icons/fi';

import {
  type CrmLead,
  type LeadEvent,
  type LeadNote,
  type LeadStatus,
  addLeadNote,
  assignLead,
  changeLeadStatus,
  getLead,
  getLeadHistory,
  getLeadNotes,
} from './crm-api';

const STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: 'New',
  IN_PROGRESS: 'In progress',
  WAITING_CUSTOMER: 'Waiting customer',
  OFFER_SENT: 'Offer sent',
  WON: 'Won',
  LOST: 'Lost',
  SPAM: 'Spam',
};

const STATUS_COLORS: Record<LeadStatus, string> = {
  NEW: 'bg-blue-50 text-blue-700',
  IN_PROGRESS: 'bg-amber-50 text-amber-700',
  WAITING_CUSTOMER: 'bg-violet-50 text-violet-700',
  OFFER_SENT: 'bg-sky-50 text-sky-700',
  WON: 'bg-green-50 text-green-700',
  LOST: 'bg-slate-100 text-slate-600',
  SPAM: 'bg-red-50 text-red-700',
};

const TYPES = {
  REQUEST_QUOTE: 'Request quote',
  SELL_TO_US: 'Sell to us',
  CONTACT_US: 'Contact us',
};

type Tab = 'details' | 'notes' | 'history';

type ManagerOption = {
  id: string;
  name: string;
  email: string;
};

interface Props {
  id: string | null;
  onClose: () => void;
  onChanged: () => void;
}

function formatDate(value?: string | null) {
  if (!value) return '—';

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? '—'
    : new Intl.DateTimeFormat('en-GB', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date);
}

function safeLink(value: string): string | null {
  try {
    const url = new URL(value);

    return url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
}

function hasValidVersion(value: number | undefined): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0;
}

// Retrieves employees from the existing
// CRM Tasks API. Internal IDs never appear
// in the user interface.
async function searchManagers(
  search: string,
  signal: AbortSignal
): Promise<ManagerOption[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is not configured');
  }

  const params = new URLSearchParams();

  if (search.trim()) {
    params.set('search', search.trim());
  }

  const response = await fetch(
    `${apiUrl.replace(/\/+$/, '')}/crm/tasks/assignees?${params.toString()}`,
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

    const message = Array.isArray(body?.message)
      ? body.message.join(', ')
      : body?.message;

    throw new Error(message || `Could not load managers (${response.status})`);
  }

  return (await response.json()) as ManagerOption[];
}

export default function LeadDetailsDrawer({ id, onClose, onChanged }: Props) {
  const [lead, setLead] = useState<CrmLead | null>(null);

  const [notes, setNotes] = useState<LeadNote[]>([]);

  const [history, setHistory] = useState<LeadEvent[]>([]);

  const [tab, setTab] = useState<Tab>('details');

  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [loadRevision, setLoadRevision] = useState(0);

  const [noteContent, setNoteContent] = useState('');

  // Manager selection state
  const [managerSearch, setManagerSearch] = useState('');

  const [managerOptions, setManagerOptions] = useState<ManagerOption[]>([]);

  const [selectedManager, setSelectedManager] = useState<ManagerOption | null>(
    null
  );

  const [knownManager, setKnownManager] = useState<ManagerOption | null>(null);

  const [managersLoading, setManagersLoading] = useState(false);

  const [managersError, setManagersError] = useState<string | null>(null);

  const [managerResultsOpen, setManagerResultsOpen] = useState(false);

  const refresh = () => {
    setLoadRevision(value => value + 1);
  };

  // -------------------------------
  // Load selected lead
  // -------------------------------
  useEffect(() => {
    if (!id) return;

    let active = true;

    setLoading(true);
    setError(null);

    Promise.all([getLead(id), getLeadNotes(id), getLeadHistory(id)])
      .then(([loadedLead, loadedNotes, loadedHistory]) => {
        if (!active) return;

        setLead(loadedLead);
        setNotes(loadedNotes);
        setHistory(loadedHistory);
      })
      .catch(err => {
        if (!active) return;

        setError(err instanceof Error ? err.message : 'Failed to load lead.');
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [id, loadRevision]);

  // -------------------------------
  // Reset when switching leads
  // -------------------------------
  useEffect(() => {
    setLead(null);
    setNotes([]);
    setHistory([]);
    setTab('details');
    setNoteContent('');
    setError(null);

    setManagerSearch('');
    setManagerOptions([]);
    setSelectedManager(null);
    setKnownManager(null);
    setManagerResultsOpen(false);
    setManagersError(null);
  }, [id]);

  // -------------------------------
  // Manager directory search
  // -------------------------------
  useEffect(() => {
    if (!id || !lead || lead._id !== id || tab !== 'details') {
      return;
    }

    const controller = new AbortController();

    const timer = window.setTimeout(async () => {
      setManagersLoading(true);
      setManagersError(null);

      try {
        const employees = await searchManagers(
          managerSearch,
          controller.signal
        );

        if (controller.signal.aborted) {
          return;
        }

        setManagerOptions(employees);

        // Resolve a readable name for
        // the currently assigned manager
        // whenever it is present among
        // the returned employees.
        const current = employees.find(
          employee => employee.id === lead.assignedToId
        );

        if (current) {
          setKnownManager(current);
        }
      } catch (err) {
        if (controller.signal.aborted) {
          return;
        }

        setManagerOptions([]);

        setManagersError(
          err instanceof Error ? err.message : 'Failed to load managers.'
        );
      } finally {
        if (!controller.signal.aborted) {
          setManagersLoading(false);
        }
      }
    }, 300);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [id, lead?._id, lead?.assignedToId, managerSearch, tab]);

  // -------------------------------
  // Close with Escape
  // -------------------------------
  useEffect(() => {
    if (!id) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [id, onClose]);

  // -------------------------------
  // Change lead status
  // -------------------------------
  async function updateStatus(next: LeadStatus) {
    if (!lead || next === lead.status) {
      return;
    }

    if (!hasValidVersion(lead.version)) {
      setError('Lead version is missing. Refresh the lead and try again.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await changeLeadStatus(lead._id, next, lead.version);

      refresh();
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update status.');

      refresh();
    } finally {
      setSaving(false);
    }
  }

  // -------------------------------
  // Assign or remove manager
  // -------------------------------
  async function saveManager(manager: ManagerOption | null) {
    if (!lead || saving) return;

    if (!hasValidVersion(lead.version)) {
      setError('Lead version is missing. Refresh the lead and try again.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // Reuse the EXISTING crm-api
      // function and backend DTO.
      await assignLead(lead._id, manager?.id ?? null, lead.version);

      setKnownManager(manager);
      setSelectedManager(null);
      setManagerSearch('');
      setManagerResultsOpen(false);

      refresh();
      onChanged();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not assign manager.'
      );

      refresh();
    } finally {
      setSaving(false);
    }
  }

  // -------------------------------
  // Add internal note
  // -------------------------------
  async function submitNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!lead || !noteContent.trim() || saving) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await addLeadNote(lead._id, noteContent.trim());

      setNoteContent('');
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save note.');
    } finally {
      setSaving(false);
    }
  }

  if (!id) return null;

  const versionAvailable = hasValidVersion(lead?.version);

  const currentManagerName = !lead?.assignedToId
    ? 'Not assigned'
    : knownManager?.id === lead.assignedToId
      ? knownManager.name
      : 'Manager assigned';

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close lead details"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/40"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-drawer-title"
        className="relative flex h-full w-full max-w-[670px] flex-col bg-white shadow-2xl"
      >
        {/* Header */}
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-5 sm:px-7">
          <div>
            <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
              CRM / Lead
            </p>

            <h2
              id="lead-drawer-title"
              className="mt-1 text-xl font-bold text-[#002b49]"
            >
              {lead?.customerName ?? 'Lead details'}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {lead ? TYPES[lead.type] : 'Loading...'}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={refresh}
              aria-label="Refresh lead"
              className="rounded-lg border p-2 hover:bg-slate-50"
            >
              <FiRefreshCw />
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-lg border p-2 hover:bg-slate-50"
            >
              <FiX />
            </button>
          </div>
        </header>

        {error && (
          <div
            role="alert"
            className="mx-5 mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 sm:mx-7"
          >
            {error}
          </div>
        )}

        {loading && !lead ? (
          <p className="p-7 text-sm text-slate-500">Loading lead...</p>
        ) : !lead ? (
          <p className="p-7 text-sm text-slate-500">
            Could not load the lead. Try Refresh.
          </p>
        ) : (
          <>
            {/* Status */}
            <div className="grid gap-3 border-b border-slate-200 p-5 sm:grid-cols-2 sm:px-7">
              <div>
                <label
                  htmlFor="lead-status"
                  className="mb-1 block text-xs font-medium text-slate-500"
                >
                  Status
                </label>

                <select
                  id="lead-status"
                  disabled={saving || !versionAvailable}
                  value={lead.status}
                  onChange={event =>
                    void updateStatus(event.target.value as LeadStatus)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-[#002b49] disabled:opacity-50"
                >
                  {Object.entries(STATUS_LABELS).map(([status, label]) => (
                    <option key={status} value={status}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className="mb-1 text-xs font-medium text-slate-500">
                  Current status
                </p>

                <span
                  className={`inline-flex rounded-full px-3 py-2 text-xs font-semibold ${
                    STATUS_COLORS[lead.status]
                  }`}
                >
                  {STATUS_LABELS[lead.status]}
                </span>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-5 border-b border-slate-200 px-5 sm:px-7">
              {(['details', 'notes', 'history'] as Tab[]).map(item => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setTab(item)}
                  className={`border-b-2 py-3 text-sm font-semibold capitalize ${
                    tab === item
                      ? 'border-[#00528b] text-[#00528b]'
                      : 'border-transparent text-slate-500'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-7">
              {tab === 'details' && (
                <>
                  {/* Customer */}
                  <div className="rounded-xl border border-slate-200 p-4">
                    <h3 className="mb-3 flex items-center gap-2 font-semibold text-[#002b49]">
                      <FiUser />
                      Customer
                    </h3>

                    <dl className="grid gap-3 text-sm sm:grid-cols-2">
                      <div>
                        <dt className="text-slate-500">Name</dt>

                        <dd className="font-medium">{lead.customerName}</dd>
                      </div>

                      <div>
                        <dt className="text-slate-500">Company</dt>

                        <dd className="font-medium">
                          {lead.companyName || '—'}
                        </dd>
                      </div>

                      <div>
                        <dt className="text-slate-500">Country</dt>

                        <dd className="font-medium">{lead.country || '—'}</dd>
                      </div>

                      <div>
                        <dt className="text-slate-500">Language</dt>

                        <dd className="font-medium uppercase">
                          {lead.locale || '—'}
                        </dd>
                      </div>
                    </dl>

                    <div className="mt-4 flex flex-wrap gap-4 text-sm">
                      <a
                        href={`mailto:${lead.email}`}
                        className="flex items-center gap-2 text-[#00528b] hover:underline"
                      >
                        <FiMail />
                        {lead.email}
                      </a>

                      {lead.phone && (
                        <span className="flex items-center gap-2 text-slate-600">
                          <FiPhone />

                          {lead.countryPhone ? `${lead.countryPhone} ` : ''}

                          {lead.phone}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Inquiry */}
                  {(lead.subject ||
                    lead.message ||
                    lead.equipmentDescription ||
                    lead.askingPrice) && (
                    <div className="rounded-xl border border-slate-200 p-4">
                      <h3 className="mb-3 font-semibold text-[#002b49]">
                        Inquiry
                      </h3>

                      {lead.subject && (
                        <p className="mb-2 text-sm">
                          <b>Subject:</b> {lead.subject}
                        </p>
                      )}

                      {lead.askingPrice && (
                        <p className="mb-2 text-sm">
                          <b>Asking price:</b> {lead.askingPrice}
                        </p>
                      )}

                      <p className="text-sm leading-6 break-words whitespace-pre-wrap text-slate-700">
                        {lead.message || lead.equipmentDescription}
                      </p>
                    </div>
                  )}

                  {/* Requested products */}
                  {lead.requestedProducts?.length > 0 && (
                    <div className="rounded-xl border border-slate-200 p-4">
                      <h3 className="mb-3 font-semibold text-[#002b49]">
                        Requested products ({lead.requestedProducts.length})
                      </h3>

                      <div className="space-y-3">
                        {lead.requestedProducts.map((product, index) => {
                          const photoUrl = safeLink(product.photo);

                          return (
                            <div
                              key={`${product.idNumber}-${index}`}
                              className="rounded-lg bg-slate-50 p-3 text-sm"
                            >
                              <p className="font-semibold">{product.name}</p>

                              {product.idNumber && (
                                <p className="mt-1 text-slate-500">
                                  Equipment number: {product.idNumber}
                                </p>
                              )}

                              {photoUrl && (
                                <a
                                  href={photoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-2 inline-flex items-center gap-1 text-[#00528b] hover:underline"
                                >
                                  View photo
                                  <FiArrowUpRight />
                                </a>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Equipment photos */}
                  {lead.equipmentPhotos?.length > 0 && (
                    <div className="rounded-xl border border-slate-200 p-4">
                      <h3 className="mb-3 font-semibold text-[#002b49]">
                        Equipment photos
                      </h3>

                      <div className="flex flex-wrap gap-3">
                        {lead.equipmentPhotos.map((photo, index) => {
                          const url = safeLink(photo);

                          if (!url) return null;

                          return (
                            <a
                              key={`${photo}-${index}`}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-lg border px-3 py-2 text-sm text-[#00528b]"
                            >
                              Photo {index + 1} ↗
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Assigned manager */}
                  <section className="rounded-xl border border-slate-200 p-4">
                    <h3 className="mb-3 flex items-center gap-2 font-semibold text-[#002b49]">
                      <FiUser />
                      Assigned manager
                    </h3>

                    <p className="text-sm text-slate-500">Current manager:</p>

                    <p className="mt-1 font-semibold text-[#002b49]">
                      {currentManagerName}
                    </p>

                    <div className="mt-4">
                      <label
                        htmlFor="manager-search"
                        className="mb-2 block text-xs font-medium text-slate-500"
                      >
                        Choose a manager
                      </label>

                      <div className="relative">
                        <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />

                        <input
                          id="manager-search"
                          type="search"
                          value={managerSearch}
                          onFocus={() => setManagerResultsOpen(true)}
                          onChange={event => {
                            setManagerSearch(event.target.value);

                            setSelectedManager(null);

                            setManagerResultsOpen(true);
                          }}
                          placeholder="Search by name or email..."
                          className="w-full rounded-lg border border-slate-200 py-2.5 pr-3 pl-10 text-sm outline-none focus:border-[#00528b]"
                        />
                      </div>

                      {managerResultsOpen && (
                        <div className="mt-2 max-h-52 overflow-y-auto rounded-lg border border-slate-200">
                          {managersLoading ? (
                            <p className="p-3 text-sm text-slate-500">
                              Searching managers...
                            </p>
                          ) : managerOptions.length === 0 ? (
                            <p className="p-3 text-sm text-slate-500">
                              No managers found.
                            </p>
                          ) : (
                            managerOptions.map(manager => (
                              <button
                                key={manager.id}
                                type="button"
                                onClick={() => {
                                  setSelectedManager(manager);

                                  setManagerSearch(manager.name);

                                  setManagerResultsOpen(false);
                                }}
                                className="flex w-full items-center justify-between gap-3 border-b border-slate-100 px-3 py-3 text-left last:border-0 hover:bg-blue-50"
                              >
                                <span className="min-w-0">
                                  <span className="block truncate text-sm font-semibold">
                                    {manager.name}
                                  </span>

                                  <span className="mt-1 block truncate text-xs text-slate-500">
                                    {manager.email}
                                  </span>
                                </span>

                                {selectedManager?.id === manager.id && (
                                  <FiCheck className="shrink-0 text-green-600" />
                                )}
                              </button>
                            ))
                          )}
                        </div>
                      )}

                      {managersError && (
                        <p role="alert" className="mt-2 text-sm text-red-600">
                          {managersError}
                        </p>
                      )}

                      {selectedManager && (
                        <p className="mt-3 text-sm text-[#00528b]">
                          Selected: <strong>{selectedManager.name}</strong>
                        </p>
                      )}

                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={
                            saving || !versionAvailable || !selectedManager
                          }
                          onClick={() => {
                            if (selectedManager) {
                              void saveManager(selectedManager);
                            }
                          }}
                          className="rounded-lg bg-[#00528b] px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {saving ? 'Saving...' : 'Assign manager'}
                        </button>

                        {lead.assignedToId && (
                          <button
                            type="button"
                            disabled={saving || !versionAvailable}
                            onClick={() => void saveManager(null)}
                            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 disabled:opacity-40"
                          >
                            Unassign
                          </button>
                        )}
                      </div>

                      {!versionAvailable && (
                        <p className="mt-3 text-xs text-amber-700">
                          Assignment is unavailable because the server did not
                          return a valid lead version.
                        </p>
                      )}
                    </div>
                  </section>

                  {/* Created date */}
                  <p className="flex items-center gap-2 text-xs text-slate-500">
                    <FiClock />
                    Created: {formatDate(lead.createdAt)}
                  </p>

                  {lead.notificationStatus && (
                    <p className="text-xs text-slate-500">
                      Manager email notification: {lead.notificationStatus}
                    </p>
                  )}
                </>
              )}

              {/* Internal notes */}
              {tab === 'notes' && (
                <>
                  <form
                    onSubmit={event => void submitNote(event)}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <label
                      htmlFor="lead-note"
                      className="mb-2 block font-semibold text-[#002b49]"
                    >
                      Internal note
                    </label>

                    <textarea
                      id="lead-note"
                      rows={4}
                      maxLength={5000}
                      value={noteContent}
                      onChange={event => setNoteContent(event.target.value)}
                      placeholder="Add a private comment for your team..."
                      className="w-full resize-y rounded-lg border p-3 text-sm"
                    />

                    <button
                      type="submit"
                      disabled={saving || !noteContent.trim()}
                      className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#00528b] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                    >
                      <FiSend />
                      Add note
                    </button>
                  </form>

                  {notes.length === 0 ? (
                    <p className="text-sm text-slate-500">No notes yet.</p>
                  ) : (
                    notes.map(note => (
                      <article key={note._id} className="rounded-xl border p-4">
                        <p className="text-sm break-words whitespace-pre-wrap">
                          {note.content}
                        </p>

                        <p className="mt-2 text-xs text-slate-500">
                          {formatDate(note.createdAt)}
                        </p>
                      </article>
                    ))
                  )}
                </>
              )}

              {/* Activity history */}
              {tab === 'history' &&
                (history.length === 0 ? (
                  <p className="text-sm text-slate-500">No activity yet.</p>
                ) : (
                  <div className="space-y-3">
                    {history.map(event => (
                      <div
                        key={event._id}
                        className="rounded-xl border p-4 text-sm"
                      >
                        <div className="flex items-center gap-2 font-semibold text-[#002b49]">
                          <FiClock />

                          {event.type.replaceAll('_', ' ')}
                        </div>

                        {event.fromStatus && event.toStatus && (
                          <p className="mt-2 text-slate-600">
                            {event.fromStatus} → {event.toStatus}
                          </p>
                        )}

                        <p className="mt-2 text-xs text-slate-500">
                          {formatDate(event.createdAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
