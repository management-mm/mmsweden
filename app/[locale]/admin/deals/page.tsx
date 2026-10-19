'use client';

import {
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  FiArrowRight,
  FiBriefcase,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiEdit2,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiTrash2,
  FiX,
} from 'react-icons/fi';

import SourceLeadPicker from './SourceLeadPicker';
import {
  DEAL_STAGES,
  DEAL_STAGE_LABELS,
  type Deal,
  type DealCurrency,
  type DealDirection,
  type DealInput,
  type DealItem,
  type DealStage,
  type DealStats,
  createDeal,
  getDeal,
  getDealStats,
  getDeals,
  saveDeal,
  updateDealStage,
} from './deals-api';

const PAGE_SIZE = 12;

const STAGE_COLORS: Record<DealStage, string> = {
  NEW: 'bg-blue-50 text-blue-700',
  QUALIFIED: 'bg-cyan-50 text-cyan-700',
  PROPOSAL: 'bg-violet-50 text-violet-700',
  NEGOTIATION: 'bg-amber-50 text-amber-700',
  WON: 'bg-green-50 text-green-700',
  LOST: 'bg-red-50 text-red-700',
};

function money(amount: number, currency: DealCurrency) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

function moneyByCurrency(values: Record<string, number>) {
  const entries = Object.entries(values).filter(([, value]) => value !== 0);

  if (!entries.length) return '—';

  return entries
    .map(([currency, value]) => money(value, currency as DealCurrency))
    .join(' · ');
}

function formatDate(value: string | null | undefined) {
  if (!value) return '—';

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? '—'
    : new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(date);
}

function emptyInput(): DealInput {
  return {
    title: '',
    direction: 'SALE',
    customerName: '',
    customerEmail: '',
    companyName: '',
    country: '',
    sourceLeadId: null,
    currency: 'EUR',
    items: [
      {
        name: '',
        idNumber: '',
        quantity: 1,
        unitPrice: 0,
      },
    ],
    shippingCost: 0,
    description: '',
    expectedCloseAt: null,
  };
}

function inputFromDeal(deal: Deal): DealInput {
  return {
    title: deal.title,
    direction: deal.direction,
    customerName: deal.customerName,
    customerEmail: deal.customerEmail,
    companyName: deal.companyName,
    country: deal.country,
    sourceLeadId: deal.sourceLeadId,
    currency: deal.currency,
    items: deal.items.map(item => ({
      name: item.name,
      idNumber: item.idNumber,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })),
    shippingCost: deal.shippingCost,
    description: deal.description,
    expectedCloseAt: deal.expectedCloseAt
      ? deal.expectedCloseAt.slice(0, 10)
      : null,
  };
}

// ======================================
// Create / Edit Deal Form
// ======================================

function DealFormModal({
  initialDeal,
  onClose,
  onSaved,
}: {
  initialDeal: Deal | null;
  onClose: () => void;
  onSaved: (deal: Deal) => void;
}) {
  const [form, setForm] = useState<DealInput>(() =>
    initialDeal ? inputFromDeal(initialDeal) : emptyInput()
  );

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const estimatedTotal = useMemo(
    () =>
      Math.round(
        (form.items.reduce(
          (sum, item) => sum + item.quantity * item.unitPrice,
          0
        ) +
          form.shippingCost) *
          100
      ) / 100,
    [form.items, form.shippingCost]
  );

  function setField<K extends keyof DealInput>(key: K, value: DealInput[K]) {
    setForm(previous => ({
      ...previous,
      [key]: value,
    }));
  }

  function updateItem(index: number, patch: Partial<DealItem>) {
    setForm(previous => ({
      ...previous,
      items: previous.items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item
      ),
    }));
  }

  function addItem() {
    if (form.items.length >= 30) return;

    setForm(previous => ({
      ...previous,
      items: [
        ...previous.items,
        {
          name: '',
          idNumber: '',
          quantity: 1,
          unitPrice: 0,
        },
      ],
    }));
  }

  function removeItem(index: number) {
    if (form.items.length === 1) return;

    setForm(previous => ({
      ...previous,
      items: previous.items.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !form.title.trim() ||
      !form.customerName.trim() ||
      !form.customerEmail.trim()
    ) {
      setError('Fill in the title, customer name and email.');
      return;
    }

    if (
      form.items.some(
        item => !item.name.trim() || item.quantity < 1 || item.unitPrice < 0
      )
    ) {
      setError('Check equipment names, quantities and prices.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload: DealInput = {
        ...form,
        title: form.title.trim(),
        customerName: form.customerName.trim(),
        customerEmail: form.customerEmail.trim(),
        sourceLeadId: form.sourceLeadId?.trim() || null,
        expectedCloseAt: form.expectedCloseAt
          ? `${form.expectedCloseAt}T00:00:00.000Z`
          : null,
      };

      const saved = initialDeal
        ? await saveDeal(initialDeal._id, payload, initialDeal.version)
        : await createDeal(payload);

      onSaved(saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save deal.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6">
      <button
        type="button"
        aria-label="Close deal form"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/50"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="deal-form-title"
        className="relative flex max-h-[95vh] w-full max-w-[820px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <header className="flex items-center justify-between border-b px-5 py-4 sm:px-7">
          <div>
            <p className="text-xs text-slate-500">CRM / Equipment Deals</p>

            <h2
              id="deal-form-title"
              className="mt-1 text-xl font-bold text-[#002b49]"
            >
              {initialDeal ? 'Edit deal' : 'Create new deal'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg border p-2"
          >
            <FiX />
          </button>
        </header>

        <form
          onSubmit={event => void submit(event)}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="space-y-6 overflow-y-auto p-5 sm:p-7">
            {error && (
              <p
                role="alert"
                className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm">
                <span className="mb-1 block font-medium">Deal title *</span>

                <input
                  required
                  maxLength={200}
                  value={form.title}
                  onChange={event => setField('title', event.target.value)}
                  placeholder="Used industrial mixer"
                  className="w-full rounded-lg border px-3 py-2.5"
                />
              </label>

              <label className="text-sm">
                <span className="mb-1 block font-medium">Deal type</span>

                <select
                  value={form.direction}
                  onChange={event =>
                    setField('direction', event.target.value as DealDirection)
                  }
                  className="w-full rounded-lg border bg-white px-3 py-2.5"
                >
                  <option value="SALE">Selling equipment</option>
                  <option value="PURCHASE">Buying equipment</option>
                </select>
              </label>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <h3 className="mb-4 font-bold">Customer information</h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm">
                  <span className="mb-1 block">Customer name *</span>

                  <input
                    required
                    maxLength={150}
                    value={form.customerName}
                    onChange={event =>
                      setField('customerName', event.target.value)
                    }
                    className="w-full rounded-lg border bg-white px-3 py-2.5"
                  />
                </label>

                <label className="text-sm">
                  <span className="mb-1 block">Email *</span>

                  <input
                    required
                    type="email"
                    maxLength={254}
                    value={form.customerEmail}
                    onChange={event =>
                      setField('customerEmail', event.target.value)
                    }
                    className="w-full rounded-lg border bg-white px-3 py-2.5"
                  />
                </label>

                <label className="text-sm">
                  <span className="mb-1 block">Company</span>

                  <input
                    maxLength={200}
                    value={form.companyName}
                    onChange={event =>
                      setField('companyName', event.target.value)
                    }
                    className="w-full rounded-lg border bg-white px-3 py-2.5"
                  />
                </label>

                <label className="text-sm">
                  <span className="mb-1 block">Country</span>

                  <input
                    maxLength={100}
                    value={form.country}
                    onChange={event => setField('country', event.target.value)}
                    className="w-full rounded-lg border bg-white px-3 py-2.5"
                  />
                </label>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-bold">Equipment & pricing</h3>

              <label className="flex items-center gap-2 text-sm">
                Currency
                <select
                  value={form.currency}
                  onChange={event =>
                    setField('currency', event.target.value as DealCurrency)
                  }
                  className="rounded-lg border bg-white px-3 py-2"
                >
                  <option value="EUR">EUR</option>
                  <option value="SEK">SEK</option>
                  <option value="USD">USD</option>
                </select>
              </label>
            </div>

            <div className="space-y-3">
              {form.items.map((item, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-semibold">
                      Equipment #{index + 1}
                    </span>

                    <button
                      type="button"
                      disabled={form.items.length === 1}
                      onClick={() => removeItem(index)}
                      aria-label="Remove equipment"
                      className="rounded-lg p-2 text-red-500 disabled:opacity-30"
                    >
                      <FiTrash2 />
                    </button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="text-xs">
                      Equipment name *
                      <input
                        required
                        maxLength={200}
                        value={item.name}
                        onChange={event =>
                          updateItem(index, {
                            name: event.target.value,
                          })
                        }
                        className="mt-1 w-full rounded-lg border px-3 py-2.5 text-sm"
                      />
                    </label>

                    <label className="text-xs">
                      MM Sweden ID number
                      <input
                        maxLength={100}
                        value={item.idNumber}
                        onChange={event =>
                          updateItem(index, {
                            idNumber: event.target.value,
                          })
                        }
                        className="mt-1 w-full rounded-lg border px-3 py-2.5 text-sm"
                      />
                    </label>

                    <label className="text-xs">
                      Quantity
                      <input
                        required
                        type="number"
                        min={1}
                        max={100000}
                        step={1}
                        value={item.quantity}
                        onChange={event =>
                          updateItem(index, {
                            quantity: Number(event.target.value),
                          })
                        }
                        className="mt-1 w-full rounded-lg border px-3 py-2.5 text-sm"
                      />
                    </label>

                    <label className="text-xs">
                      Unit price
                      <input
                        required
                        type="number"
                        min={0}
                        step="0.01"
                        value={item.unitPrice}
                        onChange={event =>
                          updateItem(index, {
                            unitPrice: Number(event.target.value),
                          })
                        }
                        className="mt-1 w-full rounded-lg border px-3 py-2.5 text-sm"
                      />
                    </label>
                  </div>

                  <p className="mt-3 text-right text-sm font-semibold">
                    {money(item.quantity * item.unitPrice, form.currency)}
                  </p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addItem}
              disabled={form.items.length >= 30}
              className="inline-flex items-center gap-2 rounded-full border border-[#00528b] px-4 py-2 text-sm font-semibold text-[#00528b] disabled:opacity-40"
            >
              <FiPlus />
              Add equipment
            </button>

            <div className="rounded-xl bg-[#002b49] p-5 text-white">
              <label className="block text-sm">
                Shipping / additional costs
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.shippingCost}
                  onChange={event =>
                    setField('shippingCost', Number(event.target.value))
                  }
                  className="mt-2 w-full rounded-lg border border-white/30 bg-white px-3 py-2.5 text-[#002b49]"
                />
              </label>

              <p className="mt-4 text-xs text-white/70">Estimated deal value</p>

              <p className="mt-1 text-3xl font-bold">
                {money(estimatedTotal, form.currency)}
              </p>

              <p className="mt-2 text-xs text-white/70">
                Final value is recalculated by the server.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm">
                <span className="mb-1 block">Expected closing date</span>

                <input
                  type="date"
                  value={form.expectedCloseAt ?? ''}
                  onChange={event =>
                    setField('expectedCloseAt', event.target.value || null)
                  }
                  className="w-full rounded-lg border px-3 py-2.5"
                />
              </label>

              <SourceLeadPicker
                value={form.sourceLeadId}
                onSelect={selectedLead => {
                  if (!selectedLead) {
                    setField('sourceLeadId', null);
                    return;
                  }

                  setForm(previous => ({
                    ...previous,

                    // Internal relationship.
                    // Never displayed as an ID.
                    sourceLeadId: selectedLead._id,

                    // Populate customer details.
                    customerName: selectedLead.customerName,

                    customerEmail: selectedLead.email,

                    companyName: selectedLead.companyName ?? '',

                    country: selectedLead.country ?? '',
                  }));
                }}
              />
            </div>

            <label className="block text-sm">
              <span className="mb-1 block">Internal deal notes</span>

              <textarea
                rows={4}
                maxLength={5000}
                value={form.description}
                onChange={event => setField('description', event.target.value)}
                className="w-full rounded-lg border px-3 py-2.5"
                placeholder="Customer requirements, transport details, negotiation notes..."
              />
            </label>
          </div>

          <footer className="flex justify-end gap-3 border-t bg-white p-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border px-5 py-2.5 text-sm font-semibold"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-[#002b49] px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              {saving
                ? 'Saving...'
                : initialDeal
                  ? 'Save changes'
                  : 'Create deal'}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

// ======================================
// Deal Details
// ======================================

function DealDetails({
  deal,
  busy,
  onClose,
  onEdit,
  onStageChange,
}: {
  deal: Deal;
  busy: boolean;
  onClose: () => void;
  onEdit: () => void;
  onStageChange: (stage: DealStage) => void;
}) {
  const itemsTotal = deal.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close deal details"
        className="absolute inset-0 bg-slate-950/40"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="deal-details-title"
        className="relative flex h-full w-full max-w-[640px] flex-col bg-white shadow-2xl"
      >
        <header className="flex items-start justify-between gap-3 border-b p-5 sm:p-7">
          <div>
            <p className="text-xs text-slate-500">CRM / Deals</p>

            <h2
              id="deal-details-title"
              className="mt-1 text-xl font-bold text-[#002b49]"
            >
              {deal.title}
            </h2>

            <p className="mt-2 text-sm text-slate-500">{deal.customerName}</p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onEdit}
              aria-label="Edit deal"
              className="rounded-lg border p-2"
            >
              <FiEdit2 />
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-lg border p-2"
            >
              <FiX />
            </button>
          </div>
        </header>

        <div className="space-y-5 overflow-y-auto p-5 sm:p-7">
          <div className="rounded-xl bg-[#002b49] p-5 text-white">
            <p className="text-xs tracking-wide text-white/70 uppercase">
              {deal.direction === 'SALE' ? 'Sales deal' : 'Purchase deal'}
            </p>

            <p className="mt-2 text-3xl font-bold">
              {money(deal.total, deal.currency)}
            </p>

            <p className="mt-2 text-xs text-white/70">
              Created {formatDate(deal.createdAt)}
            </p>
          </div>

          <section className="rounded-xl border p-4">
            <h3 className="mb-3 font-bold">Deal stage</h3>

            <select
              value={deal.stage}
              disabled={busy}
              onChange={event => onStageChange(event.target.value as DealStage)}
              className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm disabled:opacity-50"
            >
              {DEAL_STAGES.map(stage => (
                <option key={stage} value={stage}>
                  {DEAL_STAGE_LABELS[stage]}
                </option>
              ))}
            </select>
          </section>

          <section className="rounded-xl border p-4">
            <h3 className="mb-3 font-bold">Customer</h3>

            <p className="text-sm font-semibold">{deal.customerName}</p>

            <p className="mt-1 text-sm text-slate-500">
              {deal.companyName || '—'}
            </p>

            <a
              href={`mailto:${deal.customerEmail}`}
              className="mt-3 block text-sm break-all text-[#00528b] hover:underline"
            >
              {deal.customerEmail}
            </a>

            <p className="mt-2 text-sm text-slate-500">{deal.country || '—'}</p>

            {deal.sourceLeadId && (
              <p className="mt-3 text-xs break-all text-slate-500">
                Source Lead ID: {deal.sourceLeadId}
              </p>
            )}
          </section>

          <section className="rounded-xl border p-4">
            <h3 className="mb-4 font-bold">Equipment & pricing</h3>

            <div className="space-y-3">
              {deal.items.map((item, index) => (
                <div key={index} className="border-b pb-3 last:border-b-0">
                  <div className="flex justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold break-words">
                        {item.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        ID: {item.idNumber || '—'}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {item.quantity} × {money(item.unitPrice, deal.currency)}
                      </p>
                    </div>

                    <p className="shrink-0 text-sm font-semibold">
                      {money(item.quantity * item.unitPrice, deal.currency)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2 border-t pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Equipment</span>

                <span>{money(itemsTotal, deal.currency)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Shipping / other costs</span>

                <span>{money(deal.shippingCost, deal.currency)}</span>
              </div>

              <div className="flex justify-between border-t pt-3 font-bold">
                <span>Deal total</span>

                <span>{money(deal.total, deal.currency)}</span>
              </div>
            </div>
          </section>

          <section className="rounded-xl border p-4">
            <h3 className="mb-3 font-bold">Planning & notes</h3>

            <p className="text-sm">
              Expected close:{' '}
              <strong>{formatDate(deal.expectedCloseAt)}</strong>
            </p>

            {deal.description && (
              <p className="mt-4 text-sm leading-6 break-words whitespace-pre-wrap text-slate-600">
                {deal.description}
              </p>
            )}
          </section>

          <section className="rounded-xl border p-4">
            <h3 className="mb-4 font-bold">Stage history</h3>

            {deal.stageHistory.length === 0 ? (
              <p className="text-sm text-slate-500">No stage changes yet.</p>
            ) : (
              <div className="space-y-3">
                {[...deal.stageHistory].reverse().map((event, index) => (
                  <div
                    key={`${event.at}-${index}`}
                    className="border-l-2 border-[#00528b] pl-3"
                  >
                    <p className="text-sm font-semibold">
                      {DEAL_STAGE_LABELS[event.from]} →{' '}
                      {DEAL_STAGE_LABELS[event.to]}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {formatDate(event.at)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </aside>
    </div>
  );
}

// ======================================
// Deals Main Page
// ======================================

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);

  const [stats, setStats] = useState<DealStats | null>(null);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [direction, setDirection] = useState<DealDirection | 'ALL'>('ALL');

  const [stage, setStage] = useState<DealStage | 'ALL'>('ALL');

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [revision, setRevision] = useState(0);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  const [formOpen, setFormOpen] = useState(false);

  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 350);

    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    Promise.all([
      getDeals(
        {
          page,
          limit: PAGE_SIZE,
          direction,
          stage,
          search: debouncedSearch,
        },
        controller.signal
      ),
      getDealStats(controller.signal),
    ])
      .then(([result, statistics]) => {
        if (controller.signal.aborted) {
          return;
        }

        setDeals(result.items);
        setTotal(result.total);
        setStats(statistics);
      })
      .catch(err => {
        if (controller.signal.aborted) {
          return;
        }

        setDeals([]);
        setTotal(0);
        setStats(null);

        setError(err instanceof Error ? err.message : 'Failed to load deals.');
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [page, direction, stage, debouncedSearch, revision]);

  const refresh = useCallback(() => {
    setRevision(value => value + 1);
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setSelectedDeal(null);
      return;
    }

    const controller = new AbortController();

    getDeal(selectedId, controller.signal)
      .then(result => {
        if (!controller.signal.aborted) {
          setSelectedDeal(result);
        }
      })
      .catch(err => {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Failed to load deal.');
        }
      });

    return () => controller.abort();
  }, [selectedId, revision]);

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  async function changeStage(next: DealStage) {
    if (!selectedDeal || saving) return;

    setSaving(true);
    setError(null);

    try {
      const updated = await updateDealStage(
        selectedDeal._id,
        next,
        selectedDeal.version
      );

      setSelectedDeal(updated);
      refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to change deal stage.'
      );

      refresh();
    } finally {
      setSaving(false);
    }
  }

  function onSaved(deal: Deal) {
    setFormOpen(false);
    setEditingDeal(null);

    setSelectedId(deal._id);
    setSelectedDeal(deal);

    refresh();
  }

  const cards = [
    {
      label: 'Total deals',
      value: stats?.totalDeals ?? '—',
      icon: <FiBriefcase />,
    },
    {
      label: 'Open deals',
      value: stats?.openDeals ?? '—',
      icon: <FiClock />,
    },
    {
      label: 'Won deals',
      value: stats?.wonDeals ?? '—',
      icon: <FiCheckCircle />,
    },
    {
      label: 'Open sales value',
      value: stats ? moneyByCurrency(stats.openSaleValue) : '—',
      icon: <FiBriefcase />,
    },
  ];

  return (
    <main className="min-h-full bg-[#fcfcfd] text-[#002b49]">
      <header className="border-b border-slate-200 bg-white px-5 py-7 sm:px-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Equipment Deals</h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage equipment sales, purchases, prices and negotiations
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={refresh}
              disabled={loading}
              className="flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm disabled:opacity-50"
            >
              <FiRefreshCw className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>

            <button
              type="button"
              onClick={() => {
                setEditingDeal(null);
                setFormOpen(true);
              }}
              className="flex items-center gap-2 rounded-full bg-[#002b49] px-5 py-2.5 text-sm font-semibold text-white"
            >
              <FiPlus />
              New Deal
            </button>
          </div>
        </div>
      </header>

      <div className="space-y-6 p-4 sm:p-7">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map(card => (
            <div
              key={card.label}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>{card.label}</span>
                {card.icon}
              </div>

              <p className="mt-3 text-2xl font-bold break-words">
                {card.value}
              </p>
            </div>
          ))}
        </div>

        {/* Search and filters */}
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_190px_190px]">
            <label className="relative">
              <FiSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={event => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search deals, customers, equipment..."
                className="w-full rounded-full border px-11 py-3 text-sm"
              />
            </label>

            <select
              value={direction}
              aria-label="Deal direction"
              onChange={event => {
                setDirection(event.target.value as DealDirection | 'ALL');
                setPage(1);
              }}
              className="rounded-full border bg-white px-4 py-3 text-sm"
            >
              <option value="ALL">Sales & Purchases</option>
              <option value="SALE">Sales</option>
              <option value="PURCHASE">Purchases</option>
            </select>

            <select
              value={stage}
              aria-label="Deal stage"
              onChange={event => {
                setStage(event.target.value as DealStage | 'ALL');
                setPage(1);
              }}
              className="rounded-full border bg-white px-4 py-3 text-sm"
            >
              <option value="ALL">All stages</option>

              {DEAL_STAGES.map(item => (
                <option key={item} value={item}>
                  {DEAL_STAGE_LABELS[item]}
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

        {/* Deal cards */}
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold">Deal Register</h2>

          <span className="text-sm text-slate-500">{total} deals found</span>
        </div>

        {loading ? (
          <p role="status" className="py-10 text-center text-sm text-slate-500">
            Loading deals...
          </p>
        ) : deals.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-white p-12 text-center">
            <FiBriefcase size={30} className="mx-auto text-slate-400" />

            <p className="mt-4 font-semibold">No deals found</p>

            <p className="mt-1 text-sm text-slate-500">
              Create your first equipment sale or purchase.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {deals.map(deal => (
              <article
                key={deal._id}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                      deal.direction === 'SALE'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-orange-50 text-orange-700'
                    }`}
                  >
                    {deal.direction === 'SALE' ? 'SALE' : 'PURCHASE'}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${STAGE_COLORS[deal.stage]}`}
                  >
                    {DEAL_STAGE_LABELS[deal.stage]}
                  </span>
                </div>

                <h3 className="mt-4 line-clamp-2 text-lg font-bold">
                  {deal.title}
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  {deal.companyName || deal.customerName}
                </p>

                <p className="mt-5 text-3xl font-bold break-words">
                  {money(deal.total, deal.currency)}
                </p>

                <div className="mt-4 flex items-center justify-between gap-2 text-xs text-slate-500">
                  <span>{deal.items.length} equipment items</span>

                  <span>{formatDate(deal.expectedCloseAt)}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedId(deal._id)}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-[#002b49] px-4 py-2.5 text-sm font-semibold hover:bg-[#002b49] hover:text-white"
                >
                  Open Deal
                  <FiArrowRight />
                </button>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between rounded-xl border bg-white px-5 py-3">
          <p className="text-sm text-slate-500">
            Page {page} of {pageCount}
          </p>

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
      </div>

      {selectedDeal && (
        <DealDetails
          deal={selectedDeal}
          busy={saving}
          onClose={() => {
            setSelectedId(null);
            setSelectedDeal(null);
          }}
          onEdit={() => {
            setEditingDeal(selectedDeal);
            setFormOpen(true);
          }}
          onStageChange={next => void changeStage(next)}
        />
      )}

      {formOpen && (
        <DealFormModal
          initialDeal={editingDeal}
          onClose={() => {
            setFormOpen(false);
            setEditingDeal(null);
          }}
          onSaved={onSaved}
        />
      )}
    </main>
  );
}
