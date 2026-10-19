'use client';

import { useEffect, useState } from 'react';
import { FiArrowLeft, FiPrinter } from 'react-icons/fi';

import { useParams } from 'next/navigation';

import {
  type Quotation,
  formatMoney,
  getQuotation,
} from '../../quotations-api';

function formatDate(value?: string | null) {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
  }).format(date);
}

const SELLER_NAME = 'MM Sweden';

const SELLER_ADDRESS = process.env.NEXT_PUBLIC_QUOTATION_SELLER_ADDRESS ?? '';

const SELLER_EMAIL = process.env.NEXT_PUBLIC_QUOTATION_SELLER_EMAIL ?? '';

const SELLER_REGISTRATION =
  process.env.NEXT_PUBLIC_QUOTATION_SELLER_REGISTRATION ?? '';

const SELLER_VAT = process.env.NEXT_PUBLIC_QUOTATION_SELLER_VAT ?? '';

export default function QuotationPrintPage() {
  const params = useParams<{
    id: string;
  }>();

  const [quotation, setQuotation] = useState<Quotation | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    getQuotation(params.id, controller.signal)
      .then(result => {
        if (!controller.signal.aborted) {
          setQuotation(result);
        }
      })
      .catch(err => {
        if (!controller.signal.aborted) {
          setError(
            err instanceof Error ? err.message : 'Could not load quotation.'
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [params.id]);

  const sellerReady = Boolean(
    SELLER_ADDRESS && SELLER_EMAIL && SELLER_REGISTRATION
  );

  return (
    <div className="min-h-screen bg-slate-100 p-4 text-slate-900 sm:p-8">
      <style>{`
        @page {
          size: A4;
          margin: 14mm;
        }

        @media print {
          body * {
            visibility: hidden !important;
          }

          #quotation-print-sheet,
          #quotation-print-sheet * {
            visibility: visible !important;
          }

          #quotation-print-sheet {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            min-height: 0;
            margin: 0;
            padding: 0;
            border: 0;
            box-shadow: none;
            background: white;
          }

          .quotation-no-break {
            break-inside: avoid;
          }
        }
      `}</style>

      <div className="mx-auto mb-5 flex max-w-[210mm] flex-wrap justify-between gap-3 print:hidden">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2.5 text-sm font-semibold"
        >
          <FiArrowLeft />
          Back
        </button>

        <button
          type="button"
          disabled={!quotation}
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full bg-[#002b49] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          <FiPrinter />
          Print / Save as PDF
        </button>
      </div>

      {loading && (
        <p className="py-10 text-center text-sm">Loading document...</p>
      )}

      {error && (
        <p
          role="alert"
          className="mx-auto max-w-[210mm] rounded-lg bg-red-50 p-4 text-red-700"
        >
          {error}
        </p>
      )}

      {quotation && (
        <article
          id="quotation-print-sheet"
          className="mx-auto min-h-[297mm] w-full max-w-[210mm] bg-white p-8 shadow-lg sm:p-12"
        >
          {/* Seller */}
          <header className="flex flex-wrap items-start justify-between gap-6 border-b-2 border-[#002b49] pb-7">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#002b49]">
                {SELLER_NAME}
              </h1>

              <p className="mt-2 text-xs tracking-widest text-slate-500 uppercase">
                Industrial equipment
              </p>

              <div className="mt-5 text-xs leading-6 whitespace-pre-line text-slate-600">
                {SELLER_ADDRESS && <p>{SELLER_ADDRESS}</p>}

                {SELLER_EMAIL && <p>{SELLER_EMAIL}</p>}

                {SELLER_REGISTRATION && (
                  <p>Registration: {SELLER_REGISTRATION}</p>
                )}

                {SELLER_VAT && <p>VAT ID: {SELLER_VAT}</p>}
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase">
                Commercial Quotation
              </p>

              <p className="mt-2 text-xl font-bold text-[#002b49]">
                {quotation.number}
              </p>

              <p className="mt-3 text-xs text-slate-600">
                Date: {formatDate(quotation.issuedAt || quotation.createdAt)}
              </p>

              <p className="mt-1 text-xs text-slate-600">
                Valid until: {formatDate(quotation.validUntil)}
              </p>
            </div>
          </header>

          {!sellerReady && (
            <div className="quotation-no-break mt-6 rounded-lg border border-red-300 bg-red-50 p-4 text-sm font-semibold text-red-700">
              Seller legal/contact details are incomplete. Do not send this
              document until they are configured.
            </div>
          )}

          {quotation.status !== 'ISSUED' && quotation.status !== 'ACCEPTED' && (
            <div className="quotation-no-break mt-6 rounded-lg border border-amber-300 bg-amber-50 p-3 text-center text-sm font-bold text-amber-800">
              {quotation.status} — NOT FOR CUSTOMER DISTRIBUTION
            </div>
          )}

          {/* Customer */}
          <section className="quotation-no-break mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                Prepared for
              </p>

              <p className="mt-3 font-bold text-[#002b49]">
                {quotation.companyName || quotation.customerName}
              </p>

              {quotation.companyName && (
                <p className="mt-1 text-sm">Attn: {quotation.customerName}</p>
              )}

              <p className="mt-2 text-sm break-all">
                {quotation.customerEmail}
              </p>

              {quotation.country && (
                <p className="mt-1 text-sm">{quotation.country}</p>
              )}
            </div>

            <div>
              <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                Subject
              </p>

              <p className="mt-3 text-sm font-semibold">{quotation.title}</p>
            </div>
          </section>

          {/* Equipment */}
          <section className="mt-10">
            <h2 className="mb-4 text-lg font-bold text-[#002b49]">
              Equipment & Pricing
            </h2>

            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="bg-[#002b49] text-white">
                  <th className="p-3">Equipment</th>

                  <th className="p-3 text-center">Qty</th>

                  <th className="p-3 text-right">Unit price</th>

                  <th className="p-3 text-right">Total</th>
                </tr>
              </thead>

              <tbody>
                {quotation.items.map((item, index) => (
                  <tr
                    key={index}
                    className="quotation-no-break border-b border-slate-200"
                  >
                    <td className="p-3">
                      <p className="font-semibold">{item.name}</p>

                      {item.idNumber && (
                        <p className="mt-1 text-slate-500">
                          ID: {item.idNumber}
                        </p>
                      )}
                    </td>

                    <td className="p-3 text-center">{item.quantity}</td>

                    <td className="p-3 text-right">
                      {formatMoney(item.unitPrice, quotation.currency)}
                    </td>

                    <td className="p-3 text-right font-semibold">
                      {formatMoney(
                        item.unitPrice * item.quantity,
                        quotation.currency
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Totals */}
          <section className="quotation-no-break mt-8 ml-auto max-w-[300px] space-y-3 text-sm">
            <div className="flex justify-between gap-6">
              <span>Subtotal</span>
              <span>{formatMoney(quotation.subtotal, quotation.currency)}</span>
            </div>

            <div className="flex justify-between gap-6">
              <span>Discount ({quotation.discountPercent}%)</span>
              <span>
                −{formatMoney(quotation.discountAmount, quotation.currency)}
              </span>
            </div>

            <div className="flex justify-between gap-6">
              <span>Shipping</span>
              <span>
                {formatMoney(quotation.shippingCost, quotation.currency)}
              </span>
            </div>

            <div className="flex justify-between gap-6">
              <span>VAT ({quotation.vatPercent}%)</span>
              <span>
                {formatMoney(quotation.vatAmount, quotation.currency)}
              </span>
            </div>

            <div className="flex justify-between gap-6 border-t-2 border-[#002b49] pt-4 text-lg font-bold text-[#002b49]">
              <span>Total</span>
              <span>{formatMoney(quotation.total, quotation.currency)}</span>
            </div>
          </section>

          {/* Terms */}
          <section className="mt-10 space-y-5 border-t border-slate-200 pt-6">
            {quotation.paymentTerms && (
              <div className="quotation-no-break">
                <h3 className="text-sm font-bold text-[#002b49]">
                  Payment Terms
                </h3>

                <p className="mt-2 text-xs leading-6 whitespace-pre-wrap text-slate-600">
                  {quotation.paymentTerms}
                </p>
              </div>
            )}

            {quotation.deliveryTerms && (
              <div className="quotation-no-break">
                <h3 className="text-sm font-bold text-[#002b49]">
                  Delivery Terms
                </h3>

                <p className="mt-2 text-xs leading-6 whitespace-pre-wrap text-slate-600">
                  {quotation.deliveryTerms}
                </p>
              </div>
            )}

            {quotation.notes && (
              <div className="quotation-no-break">
                <h3 className="text-sm font-bold text-[#002b49]">
                  Additional Information
                </h3>

                <p className="mt-2 text-xs leading-6 whitespace-pre-wrap text-slate-600">
                  {quotation.notes}
                </p>
              </div>
            )}
          </section>

          <footer className="mt-12 border-t border-slate-200 pt-5 text-center text-xs text-slate-400">
            {SELLER_NAME} · Commercial Quotation {quotation.number}
          </footer>
        </article>
      )}
    </div>
  );
}
