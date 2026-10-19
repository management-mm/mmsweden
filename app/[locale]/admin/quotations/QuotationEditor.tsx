'use client';

import {
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { FiCheck, FiPlus, FiSearch, FiTrash2, FiX } from 'react-icons/fi';

import DecimalInput from './DecimalInput';
import {
  type Quotation,
  type QuotationCurrency,
  type QuotationInput,
  type QuotationItem,
  createQuotation,
  formatMoney,
  updateQuotation,
} from './quotations-api';

import { type Deal, getDeal, getDeals } from '../deals/deals-api';

function emptyInput(): QuotationInput {
  return {
    dealId: null,
    title: '',
    customerName: '',
    customerEmail: '',
    companyName: '',
    country: '',
    currency: 'EUR',
    items: [
      {
        name: '',
        idNumber: '',
        quantity: 1,
        unitPrice: 0,
      },
    ],
    discountPercent: 0,
    shippingCost: 0,
    vatPercent: 0,
    validUntil: null,
    paymentTerms: '',
    deliveryTerms: '',
    notes: '',
  };
}

function fromQuotation(quotation: Quotation): QuotationInput {
  return {
    dealId: quotation.dealId,
    title: quotation.title,
    customerName: quotation.customerName,
    customerEmail: quotation.customerEmail,
    companyName: quotation.companyName,
    country: quotation.country,
    currency: quotation.currency,
    items: quotation.items.map(item => ({
      name: item.name,
      idNumber: item.idNumber,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })),
    discountPercent: quotation.discountPercent,
    shippingCost: quotation.shippingCost,
    vatPercent: quotation.vatPercent,
    validUntil: quotation.validUntil ? quotation.validUntil.slice(0, 10) : null,
    paymentTerms: quotation.paymentTerms,
    deliveryTerms: quotation.deliveryTerms,
    notes: quotation.notes,
  };
}

interface Props {
  quotation: Quotation | null;
  initialDealId?: string | null;
  onClose: () => void;
  onSaved: (quotation: Quotation) => void;
}

export default function QuotationEditor({
  quotation,
  initialDealId,
  onClose,
  onSaved,
}: Props) {
  const [form, setForm] = useState<QuotationInput>(() =>
    quotation ? fromQuotation(quotation) : emptyInput()
  );

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // Existing sales deal search
  const [dealSearch, setDealSearch] = useState('');

  const [deals, setDeals] = useState<Deal[]>([]);

  const [searchingDeals, setSearchingDeals] = useState(false);

  const [loadingDeal, setLoadingDeal] = useState(false);

  const [showDealResults, setShowDealResults] = useState(true);

  const [linkedDealName, setLinkedDealName] = useState<string | null>(null);

  function setField<K extends keyof QuotationInput>(
    key: K,
    value: QuotationInput[K]
  ) {
    setForm(previous => ({
      ...previous,
      [key]: value,
    }));
  }

  function updateItem(index: number, patch: Partial<QuotationItem>) {
    setForm(previous => ({
      ...previous,
      items: previous.items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item
      ),
    }));
  }

  function addItem() {
    setForm(previous => {
      if (previous.items.length >= 30) {
        return previous;
      }

      return {
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
      };
    });
  }

  function removeItem(index: number) {
    setForm(previous => ({
      ...previous,
      items:
        previous.items.length === 1
          ? previous.items
          : previous.items.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  // Search deals by name, company or customer.
  useEffect(() => {
    if (quotation) return;

    const controller = new AbortController();

    const timer = window.setTimeout(() => {
      setSearchingDeals(true);

      getDeals(
        {
          page: 1,
          limit: 10,
          direction: 'SALE',
          stage: 'ALL',
          search: dealSearch.trim(),
        },
        controller.signal
      )
        .then(response => {
          if (!controller.signal.aborted) {
            setDeals(response.items);
          }
        })
        .catch(err => {
          if (!controller.signal.aborted) {
            setDeals([]);

            setError(
              err instanceof Error ? err.message : 'Could not search deals.'
            );
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            setSearchingDeals(false);
          }
        });
    }, 300);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [dealSearch, quotation]);

  // Copy selected deal into a new quotation.
  const selectDeal = useCallback(async (id: string) => {
    setLoadingDeal(true);
    setError(null);

    try {
      const deal = await getDeal(id);

      if (deal.direction !== 'SALE') {
        throw new Error(
          'Only sales deals can be used for customer quotations.'
        );
      }

      setForm(previous => ({
        ...previous,
        dealId: deal._id,
        title: deal.title,
        customerName: deal.customerName,
        customerEmail: deal.customerEmail,
        companyName: deal.companyName,
        country: deal.country,
        currency: deal.currency,
        items: deal.items.map(item => ({
          name: item.name,
          idNumber: item.idNumber,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
        shippingCost: deal.shippingCost,
        notes: deal.description,
      }));

      setLinkedDealName(
        `${deal.title} — ${deal.companyName || deal.customerName}`
      );

      setShowDealResults(false);
      setDealSearch('');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load selected deal.'
      );
    } finally {
      setLoadingDeal(false);
    }
  }, []);

  // When opened via Deals -> Create Quotation,
  // load that deal automatically.
  useEffect(() => {
    if (initialDealId && !quotation) {
      void selectDeal(initialDealId);
    }
  }, [initialDealId, quotation, selectDeal]);

  const totals = useMemo(() => {
    const subtotalCents = form.items.reduce(
      (sum, item) => sum + Math.round(item.unitPrice * 100) * item.quantity,
      0
    );

    const discountCents = Math.round(
      (subtotalCents * form.discountPercent) / 100
    );

    const shippingCents = Math.round(form.shippingCost * 100);

    const taxableCents = subtotalCents - discountCents + shippingCents;

    const vatCents = Math.round((taxableCents * form.vatPercent) / 100);

    return {
      subtotal: subtotalCents / 100,
      discount: discountCents / 100,
      vat: vatCents / 100,
      total: (taxableCents + vatCents) / 100,
    };
  }, [form]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !form.title.trim() ||
      !form.customerName.trim() ||
      !form.customerEmail.trim()
    ) {
      setError('Please complete the required customer fields.');
      return;
    }

    if (
      form.items.some(
        item =>
          !item.name.trim() ||
          !Number.isInteger(item.quantity) ||
          item.quantity < 1 ||
          !Number.isFinite(item.unitPrice) ||
          item.unitPrice < 0
      )
    ) {
      setError('Check equipment names, quantities and prices.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload: QuotationInput = {
        ...form,
        dealId: form.dealId || null,
        validUntil: form.validUntil ? `${form.validUntil}T00:00:00.000Z` : null,
      };

      const saved = quotation
        ? await updateQuotation(quotation._id, payload, quotation.version)
        : await createQuotation(payload);

      onSaved(saved);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to save quotation.'
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6">
      <button
        type="button"
        aria-label="Close quotation editor"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/50"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="quotation-editor-title"
        className="relative flex max-h-[95vh] w-full max-w-[850px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <header className="flex items-center justify-between border-b p-5 sm:px-7">
          <div>
            <p className="text-xs text-slate-500">CRM / Quotations</p>

            <h2
              id="quotation-editor-title"
              className="mt-1 text-xl font-bold text-[#002b49]"
            >
              {quotation ? `Edit ${quotation.number}` : 'New Commercial Offer'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg border p-2"
          >
            <FiX size={20} />
          </button>
        </header>

        <form
          onSubmit={event => void handleSubmit(event)}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="space-y-6 overflow-y-auto p-5 sm:p-7">
            {error && (
              <div
                role="alert"
                className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            {/* DEAL SELECTOR */}
            {!quotation && (
              <section className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                <h3 className="font-bold text-[#002b49]">
                  Create from existing deal
                </h3>

                <p className="mt-1 text-xs text-slate-600">
                  Search by equipment, customer or company. No database ID
                  required.
                </p>

                {form.dealId && (
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-green-200 bg-green-50 p-3">
                    <div className="flex items-center gap-2 text-sm text-green-800">
                      <FiCheck />

                      <span>
                        <strong>Selected deal:</strong>{' '}
                        {linkedDealName || 'Existing deal'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setField('dealId', null);
                        setLinkedDealName(null);
                        setShowDealResults(true);
                      }}
                      className="text-xs font-semibold text-[#00528b] hover:underline"
                    >
                      Remove link
                    </button>
                  </div>
                )}

                <div className="relative mt-4">
                  <FiSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="search"
                    aria-label="Search existing deals"
                    value={dealSearch}
                    onFocus={() => setShowDealResults(true)}
                    onChange={event => {
                      setDealSearch(event.target.value);
                      setShowDealResults(true);
                    }}
                    placeholder="Search deals by name, company or customer..."
                    className="w-full rounded-lg border border-slate-300 bg-white py-3 pr-4 pl-11 text-sm outline-none focus:border-[#00528b]"
                  />
                </div>

                {showDealResults && (
                  <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <div className="border-b bg-slate-50 px-4 py-3">
                      <p className="text-xs font-semibold text-slate-600">
                        {dealSearch.trim()
                          ? 'Search results'
                          : 'Recent sales deals'}
                      </p>
                    </div>

                    {searchingDeals || loadingDeal ? (
                      <p className="p-4 text-sm text-slate-500">
                        {loadingDeal
                          ? 'Loading selected deal...'
                          : 'Searching deals...'}
                      </p>
                    ) : deals.length === 0 ? (
                      <p className="p-4 text-sm text-slate-500">
                        No matching deals. You can still create this quotation
                        manually.
                      </p>
                    ) : (
                      <div className="max-h-[240px] overflow-y-auto">
                        {deals.map(deal => (
                          <button
                            key={deal._id}
                            type="button"
                            disabled={loadingDeal}
                            onClick={() => void selectDeal(deal._id)}
                            className="flex w-full items-center justify-between gap-4 border-b border-slate-100 px-4 py-3 text-left last:border-b-0 hover:bg-blue-50 disabled:opacity-50"
                          >
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-[#002b49]">
                                {deal.title}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                {deal.companyName || deal.customerName}
                              </p>

                              <p className="mt-1 text-xs text-slate-400">
                                {deal.customerEmail}
                              </p>
                            </div>

                            <div className="shrink-0 text-right">
                              <p className="text-sm font-bold text-[#002b49]">
                                {formatMoney(deal.total, deal.currency)}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                {deal.stage}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </section>
            )}

            {/* QUOTATION TITLE */}
            <label className="block text-sm">
              <span className="mb-1 block font-medium">Quotation title *</span>

              <input
                required
                maxLength={200}
                value={form.title}
                onChange={event => setField('title', event.target.value)}
                placeholder="Industrial processing equipment"
                className="w-full rounded-lg border px-3 py-2.5"
              />
            </label>

            {/* CUSTOMER DETAILS */}
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
                  className="w-full rounded-lg border px-3 py-2.5"
                />
              </label>

              <label className="text-sm">
                <span className="mb-1 block">Customer email *</span>

                <input
                  required
                  type="email"
                  maxLength={254}
                  value={form.customerEmail}
                  onChange={event =>
                    setField('customerEmail', event.target.value)
                  }
                  className="w-full rounded-lg border px-3 py-2.5"
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
                  className="w-full rounded-lg border px-3 py-2.5"
                />
              </label>

              <label className="text-sm">
                <span className="mb-1 block">Country</span>

                <input
                  maxLength={100}
                  value={form.country}
                  onChange={event => setField('country', event.target.value)}
                  className="w-full rounded-lg border px-3 py-2.5"
                />
              </label>
            </div>

            {/* EQUIPMENT */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-bold text-[#002b49]">Equipment & Prices</h3>

              <label className="flex items-center gap-2 text-sm">
                Currency
                <select
                  value={form.currency}
                  onChange={event =>
                    setField(
                      'currency',
                      event.target.value as QuotationCurrency
                    )
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
                      aria-label="Remove equipment"
                      disabled={form.items.length === 1}
                      onClick={() => removeItem(index)}
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
                      Equipment ID number
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
                      <DecimalInput
                        value={item.unitPrice}
                        min={0}
                        max={1_000_000_000}
                        decimals={2}
                        ariaLabel="Equipment unit price"
                        onChange={value =>
                          updateItem(index, {
                            unitPrice: value,
                          })
                        }
                        className="mt-1 w-full rounded-lg border px-3 py-2.5 text-sm"
                      />
                    </label>
                  </div>

                  <p className="mt-3 text-right text-sm font-semibold">
                    {formatMoney(item.quantity * item.unitPrice, form.currency)}
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

            {/* PRICING */}
            <section className="rounded-xl bg-slate-50 p-5">
              <h3 className="mb-4 font-bold">Pricing Summary</h3>

              <div className="grid gap-4 sm:grid-cols-3">
                {/* DISCOUNT */}
                <label className="text-xs">
                  Discount (%)
                  <DecimalInput
                    value={form.discountPercent}
                    min={0}
                    max={100}
                    decimals={2}
                    ariaLabel="Discount percentage"
                    onChange={value => setField('discountPercent', value)}
                    className="mt-1 w-full rounded-lg border bg-white px-3 py-2.5 text-sm"
                  />
                  <span className="mt-1 block text-slate-500">
                    Enter 7 for 7%
                  </span>
                </label>

                {/* SHIPPING */}
                <label className="text-xs">
                  Shipping ({form.currency})
                  <DecimalInput
                    value={form.shippingCost}
                    min={0}
                    max={1_000_000_000}
                    decimals={2}
                    ariaLabel="Shipping cost"
                    onChange={value => setField('shippingCost', value)}
                    className="mt-1 w-full rounded-lg border bg-white px-3 py-2.5 text-sm"
                  />
                </label>

                {/* VAT */}
                <label className="text-xs">
                  VAT (%)
                  <DecimalInput
                    value={form.vatPercent}
                    min={0}
                    max={100}
                    decimals={2}
                    ariaLabel="VAT percentage"
                    onChange={value => setField('vatPercent', value)}
                    className="mt-1 w-full rounded-lg border bg-white px-3 py-2.5 text-sm"
                  />
                  <span className="mt-1 block text-slate-500">
                    Enter 17 for 17%
                  </span>
                </label>
              </div>

              <div className="mt-5 space-y-2 border-t pt-4 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>

                  <span>{formatMoney(totals.subtotal, form.currency)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Discount</span>

                  <span>−{formatMoney(totals.discount, form.currency)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>

                  <span>{formatMoney(form.shippingCost, form.currency)}</span>
                </div>

                <div className="flex justify-between">
                  <span>VAT</span>

                  <span>{formatMoney(totals.vat, form.currency)}</span>
                </div>

                <div className="flex justify-between border-t pt-3 text-lg font-bold">
                  <span>Total</span>

                  <span>{formatMoney(totals.total, form.currency)}</span>
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-500">
                Verify the VAT rate before issuing the quotation.
              </p>
            </section>

            {/* TERMS */}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm">
                Valid until
                <input
                  type="date"
                  value={form.validUntil ?? ''}
                  onChange={event =>
                    setField('validUntil', event.target.value || null)
                  }
                  className="mt-1 block w-full rounded-lg border px-3 py-2.5"
                />
              </label>

              <label className="text-sm">
                Payment terms
                <textarea
                  rows={3}
                  maxLength={1000}
                  value={form.paymentTerms}
                  onChange={event =>
                    setField('paymentTerms', event.target.value)
                  }
                  className="mt-1 block w-full rounded-lg border px-3 py-2.5"
                />
              </label>

              <label className="text-sm">
                Delivery terms
                <textarea
                  rows={3}
                  maxLength={1000}
                  value={form.deliveryTerms}
                  onChange={event =>
                    setField('deliveryTerms', event.target.value)
                  }
                  className="mt-1 block w-full rounded-lg border px-3 py-2.5"
                />
              </label>

              <label className="text-sm">
                Additional notes
                <textarea
                  rows={3}
                  maxLength={5000}
                  value={form.notes}
                  onChange={event => setField('notes', event.target.value)}
                  className="mt-1 block w-full rounded-lg border px-3 py-2.5"
                />
              </label>
            </div>
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
              disabled={saving || loadingDeal}
              className="rounded-full bg-[#002b49] px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              {saving
                ? 'Saving...'
                : quotation
                  ? 'Save draft'
                  : 'Create quotation'}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
