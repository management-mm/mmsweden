'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FiArrowUpRight,
  FiClock,
  FiInbox,
  FiMail,
  FiMove,
  FiRefreshCw,
  FiSearch,
  FiX,
} from 'react-icons/fi';

import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import {
  type LeadStatus,
  type LeadType,
  PIPELINE_STATUSES,
  type PipelineBoardResponse,
  type PipelineColumn,
  type PipelineFilters,
  type PipelineLead,
  type PipelineStatus,
  getPipelineBoard,
  getPipelineColumn,
  updatePipelineStatus,
} from './pipeline-api';

const COLUMN_LIMIT = 25;

const STATUS_LABELS: Record<PipelineStatus, string> = {
  NEW: 'New',
  IN_PROGRESS: 'In Progress',
  WAITING_CUSTOMER: 'Waiting Customer',
  OFFER_SENT: 'Offer Sent',
  WON: 'Won',
  LOST: 'Lost',
};

const STATUS_COLORS: Record<PipelineStatus, string> = {
  NEW: 'bg-blue-500',
  IN_PROGRESS: 'bg-amber-500',
  WAITING_CUSTOMER: 'bg-violet-500',
  OFFER_SENT: 'bg-sky-500',
  WON: 'bg-green-500',
  LOST: 'bg-slate-400',
};

const TYPE_LABELS: Record<LeadType, string> = {
  REQUEST_QUOTE: 'Request Quote',
  SELL_TO_US: 'Sell to Us',
  CONTACT_US: 'Contact Us',
};

function formatDate(value: string): string {
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

function isPipelineStatus(value: string): value is PipelineStatus {
  return PIPELINE_STATUSES.some(status => status === value);
}

// ----------------------------------------
// Card preview used by DragOverlay
// ----------------------------------------

function CardPreview({ lead }: { lead: PipelineLead }) {
  return (
    <div className="rounded-xl border border-[#00528b] bg-white p-4 shadow-xl">
      <p className="text-sm font-bold text-[#002b49]">{lead.customerName}</p>

      {lead.companyName && (
        <p className="mt-1 text-xs text-slate-500">{lead.companyName}</p>
      )}

      <p className="mt-3 text-xs text-[#00528b]">{TYPE_LABELS[lead.type]}</p>
    </div>
  );
}

// ----------------------------------------
// Draggable lead card
// ----------------------------------------

interface LeadCardProps {
  lead: PipelineLead;
  busy: boolean;
  onMove: (lead: PipelineLead, status: LeadStatus) => void;
  onDetails: (lead: PipelineLead) => void;
}

function LeadCard({ lead, busy, onMove, onDetails }: LeadCardProps) {
  const canMove = lead.version !== null && !busy;

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: lead._id,
    disabled: !canMove,
    data: {
      leadId: lead._id,
    },
  });

  const isUrgent = lead.priority === 'URGENT' || lead.priority === 'HIGH';

  return (
    <article
      ref={setNodeRef}
      className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md ${
        isDragging ? 'opacity-40' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-bold break-words text-[#002b49]">
            {lead.customerName}
          </p>

          {lead.companyName && (
            <p className="mt-1 truncate text-xs text-slate-500">
              {lead.companyName}
            </p>
          )}
        </div>

        <button
          type="button"
          {...attributes}
          {...listeners}
          disabled={!canMove}
          aria-label={`Drag ${lead.customerName}`}
          title="Drag to change status"
          style={{ touchAction: 'none' }}
          className="shrink-0 cursor-grab rounded-md p-1 text-slate-400 hover:bg-slate-100 active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-40"
        >
          <FiMove size={18} />
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
          {TYPE_LABELS[lead.type]}
        </span>

        {isUrgent && (
          <span className="rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700">
            {lead.priority}
          </span>
        )}
      </div>

      <p className="mt-3 line-clamp-3 text-xs leading-5 break-words text-slate-600">
        {lead.summary}
      </p>

      {lead.productCount > 0 && (
        <p className="mt-2 text-xs text-slate-500">
          Equipment: {lead.productCount}
        </p>
      )}

      <div className="mt-4 flex items-center gap-1 text-[11px] text-slate-400">
        <FiClock />
        {formatDate(lead.createdAt)}
      </div>

      <div className="mt-4 border-t border-slate-100 pt-3">
        <label
          className="mb-1 block text-[11px] text-slate-500"
          htmlFor={`status-${lead._id}`}
        >
          Move to
        </label>

        <select
          id={`status-${lead._id}`}
          value={lead.status}
          disabled={!canMove}
          onChange={event => onMove(lead, event.target.value as LeadStatus)}
          className="w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs text-[#002b49] disabled:opacity-50"
        >
          {PIPELINE_STATUSES.map(status => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}

          <option value="SPAM">Spam / Archive</option>
        </select>

        <button
          type="button"
          onClick={() => onDetails(lead)}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-[#002b49] px-3 py-2 text-xs font-semibold text-white hover:bg-[#00528b]"
        >
          View details
          <FiArrowUpRight />
        </button>
      </div>

      {lead.version === null && (
        <p className="mt-2 text-xs text-red-600">
          Version missing — update disabled.
        </p>
      )}
    </article>
  );
}

// ----------------------------------------
// Droppable Kanban column
// ----------------------------------------

interface ColumnProps {
  column: PipelineColumn;
  busyId: string | null;
  loadingMore: boolean;
  onMove: (lead: PipelineLead, status: LeadStatus) => void;
  onDetails: (lead: PipelineLead) => void;
  onLoadMore: (status: PipelineStatus) => void;
}

function KanbanColumn({
  column,
  busyId,
  loadingMore,
  onMove,
  onDetails,
  onLoadMore,
}: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column:${column.status}`,
  });

  return (
    <section
      ref={setNodeRef}
      aria-label={`${STATUS_LABELS[column.status]} leads`}
      className={`flex w-[290px] shrink-0 flex-col rounded-2xl border p-3 transition-colors ${
        isOver ? 'border-[#00528b] bg-blue-50' : 'border-slate-200 bg-slate-50'
      }`}
    >
      <div className="mb-4 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${STATUS_COLORS[column.status]}`}
          />

          <h2 className="text-sm font-bold text-[#002b49]">
            {STATUS_LABELS[column.status]}
          </h2>
        </div>

        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600">
          {column.total}
        </span>
      </div>

      <div className="flex min-h-[260px] flex-col gap-3">
        {column.items.map(lead => (
          <LeadCard
            key={lead._id}
            lead={lead}
            busy={busyId !== null}
            onMove={onMove}
            onDetails={onDetails}
          />
        ))}

        {column.items.length === 0 && (
          <div className="flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 p-4 text-center">
            <FiInbox size={22} className="text-slate-400" />

            <p className="mt-2 text-xs text-slate-500">Drop a lead here</p>
          </div>
        )}
      </div>

      {column.hasMore && (
        <button
          type="button"
          disabled={loadingMore || busyId !== null}
          onClick={() => onLoadMore(column.status)}
          className="mt-4 rounded-lg border border-[#00528b] bg-white px-3 py-2 text-xs font-semibold text-[#00528b] disabled:opacity-50"
        >
          {loadingMore ? 'Loading...' : 'Load more'}
        </button>
      )}
    </section>
  );
}

// ----------------------------------------
// Main Sales Pipeline board
// ----------------------------------------

export default function PipelineBoard() {
  const [board, setBoard] = useState<PipelineBoardResponse | null>(null);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [type, setType] = useState<LeadType | 'ALL'>('ALL');

  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [loadingMore, setLoadingMore] = useState<Record<string, boolean>>({});

  const [error, setError] = useState<string | null>(null);

  const [revision, setRevision] = useState(0);

  const [activeId, setActiveId] = useState<string | null>(null);

  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  // Prevent stale "Load more" results when
  // search or type filters change.
  const requestEpoch = useRef(0);

  const filters: PipelineFilters = useMemo(
    () => ({
      type,
      search: debouncedSearch,
      limit: COLUMN_LIMIT,
    }),
    [type, debouncedSearch]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 7,
      },
    }),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 350);

    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const controller = new AbortController();

    const epoch = ++requestEpoch.current;

    setLoading(true);
    setError(null);
    setLoadingMore({});

    getPipelineBoard(filters, controller.signal)
      .then(result => {
        if (controller.signal.aborted || epoch !== requestEpoch.current) {
          return;
        }

        setBoard(result);
      })
      .catch(err => {
        if (controller.signal.aborted || epoch !== requestEpoch.current) {
          return;
        }

        setBoard(null);

        setError(
          err instanceof Error ? err.message : 'Failed to load pipeline.'
        );
      })
      .finally(() => {
        if (!controller.signal.aborted && epoch === requestEpoch.current) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [filters, revision]);

  const allLoadedLeads = useMemo(
    () => board?.columns.flatMap(column => column.items) ?? [],
    [board]
  );

  const activeLead = allLoadedLeads.find(lead => lead._id === activeId);

  const selectedLead = allLoadedLeads.find(lead => lead._id === selectedLeadId);

  const refresh = useCallback(() => {
    setRevision(value => value + 1);
  }, []);

  async function moveLead(lead: PipelineLead, targetStatus: LeadStatus) {
    if (busyId !== null || lead.status === targetStatus) {
      return;
    }

    if (lead.version === null || !Number.isInteger(lead.version)) {
      setError('Cannot update lead: version is missing.');
      return;
    }

    setBusyId(lead._id);
    setError(null);

    try {
      await updatePipelineStatus(lead._id, targetStatus, lead.version);

      // Reload counts and positions from MongoDB.
      // Do not silently overwrite another
      // manager's changes.
      setSelectedLeadId(null);
      refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to update lead status.'
      );

      refresh();
    } finally {
      setBusyId(null);
    }
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);

    const leadId = String(event.active.id);

    const lead = allLoadedLeads.find(item => item._id === leadId);

    const target = event.over?.id ? String(event.over.id) : null;

    if (!lead || !target || !target.startsWith('column:')) {
      return;
    }

    const status = target.replace('column:', '');

    if (!isPipelineStatus(status)) {
      return;
    }

    void moveLead(lead, status);
  }

  async function loadMoreColumn(status: PipelineStatus) {
    if (!board || loadingMore[status] || busyId !== null) {
      return;
    }

    const column = board.columns.find(item => item.status === status);

    if (!column || !column.hasMore) return;

    const epoch = requestEpoch.current;

    setLoadingMore(previous => ({
      ...previous,
      [status]: true,
    }));

    setError(null);

    try {
      const result = await getPipelineColumn(
        status,
        filters,
        column.items.length
      );

      if (epoch !== requestEpoch.current) {
        return;
      }

      setBoard(previous => {
        if (!previous) return previous;

        return {
          ...previous,
          columns: previous.columns.map(item => {
            if (item.status !== status) {
              return item;
            }

            const existingIds = new Set(item.items.map(lead => lead._id));

            const newItems = result.items.filter(
              lead => !existingIds.has(lead._id)
            );

            return {
              ...item,
              total: result.total,
              items: [...item.items, ...newItems],
              hasMore: result.hasMore,
            };
          }),
        };
      });
    } catch (err) {
      if (epoch === requestEpoch.current) {
        setError(
          err instanceof Error ? err.message : 'Could not load more leads.'
        );
      }
    } finally {
      if (epoch === requestEpoch.current) {
        setLoadingMore(previous => ({
          ...previous,
          [status]: false,
        }));
      }
    }
  }

  const pipelineTotal = board?.total ?? 0;

  return (
    <div className="space-y-6">
      {/* Search and filters */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_240px_auto]">
          <label className="relative block">
            <FiSearch className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={event => setSearch(event.target.value)}
              maxLength={100}
              placeholder="Search customer, email, equipment..."
              aria-label="Search pipeline"
              className="w-full rounded-full border border-slate-200 py-3 pr-4 pl-11 text-sm outline-none focus:border-[#00528b]"
            />
          </label>

          <select
            value={type}
            aria-label="Filter request type"
            onChange={event => setType(event.target.value as LeadType | 'ALL')}
            className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
          >
            <option value="ALL">All request types</option>
            <option value="REQUEST_QUOTE">Request Quote</option>
            <option value="SELL_TO_US">Sell to Us</option>
            <option value="CONTACT_US">Contact Us</option>
          </select>

          <button
            type="button"
            onClick={refresh}
            disabled={loading || busyId !== null}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#002b49] px-5 py-3 text-sm font-semibold text-[#002b49] disabled:opacity-50"
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </section>

      {/* Summary */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: 'Total pipeline',
            count: pipelineTotal,
          },
          {
            label: 'New inquiries',
            count: board?.columns.find(c => c.status === 'NEW')?.total ?? 0,
          },
          {
            label: 'In progress',
            count:
              board?.columns.find(c => c.status === 'IN_PROGRESS')?.total ?? 0,
          },
          {
            label: 'Won',
            count: board?.columns.find(c => c.status === 'WON')?.total ?? 0,
          },
        ].map(item => (
          <div
            key={item.label}
            className="rounded-xl border border-slate-200 bg-white p-5"
          >
            <p className="text-sm text-slate-500">{item.label}</p>

            <p className="mt-2 text-3xl font-bold text-[#002b49]">
              {board ? item.count : '—'}
            </p>
          </div>
        ))}
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {busyId && (
        <p role="status" className="text-sm text-[#00528b]">
          Updating lead status...
        </p>
      )}

      {loading && (
        <p role="status" className="text-sm text-slate-500">
          Loading Sales Pipeline...
        </p>
      )}

      {/* Kanban */}
      {board && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={() => setActiveId(null)}
        >
          <div className="overflow-x-auto pb-5">
            <div className="flex min-w-max items-start gap-4">
              {board.columns.map(column => (
                <KanbanColumn
                  key={column.status}
                  column={column}
                  busyId={busyId}
                  loadingMore={loadingMore[column.status] ?? false}
                  onMove={(lead, status) => void moveLead(lead, status)}
                  onDetails={lead => setSelectedLeadId(lead._id)}
                  onLoadMore={status => void loadMoreColumn(status)}
                />
              ))}
            </div>
          </div>

          <DragOverlay>
            {activeLead ? (
              <div className="w-[270px]">
                <CardPreview lead={activeLead} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* Lead details */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button
            type="button"
            aria-label="Close lead details"
            onClick={() => setSelectedLeadId(null)}
            className="absolute inset-0 bg-slate-950/40"
          />

          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Lead details"
            className="relative flex h-full w-full max-w-[520px] flex-col bg-white shadow-2xl"
          >
            <header className="flex items-start justify-between border-b p-6">
              <div>
                <p className="text-xs text-slate-500">Sales Pipeline / Lead</p>

                <h2 className="mt-1 text-xl font-bold text-[#002b49]">
                  {selectedLead.customerName}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLeadId(null)}
                aria-label="Close"
                className="rounded-lg border p-2"
              >
                <FiX />
              </button>
            </header>

            <div className="space-y-5 overflow-y-auto p-6">
              <div className="rounded-xl border p-4">
                <p className="text-xs text-slate-500">Company</p>
                <p className="mt-1 font-semibold">
                  {selectedLead.companyName || '—'}
                </p>
              </div>

              <div className="rounded-xl border p-4">
                <p className="text-xs text-slate-500">Email</p>

                <a
                  href={`mailto:${selectedLead.email}`}
                  className="mt-1 flex items-center gap-2 text-sm break-all text-[#00528b]"
                >
                  <FiMail />
                  {selectedLead.email}
                </a>
              </div>

              <div className="rounded-xl border p-4">
                <p className="text-xs text-slate-500">Request</p>

                <p className="mt-1 font-medium">
                  {TYPE_LABELS[selectedLead.type]}
                </p>

                <p className="mt-3 text-sm break-words whitespace-pre-wrap text-slate-600">
                  {selectedLead.summary}
                </p>

                <p className="mt-3 text-xs text-slate-500">
                  Received: {formatDate(selectedLead.createdAt)}
                </p>
              </div>

              <p className="text-xs text-slate-500">
                This is a quick preview. Full customer details and internal
                notes are available in Customer Leads.
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
