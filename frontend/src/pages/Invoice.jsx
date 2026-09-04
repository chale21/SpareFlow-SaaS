import React, { useEffect, useState } from 'react';
import {
  FiAlertCircle,
  FiArrowLeft,
  FiPrinter,
  FiRefreshCw,
} from 'react-icons/fi';
import { Link, useParams } from 'react-router-dom';
import salesService from '../services/salesService';

// ============================================================
// HELPERS
// ============================================================

const formatMoney = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'ETB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

const formatDate = (value) => {
  if (!value) return 'Unknown date';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Unknown date';
  }

  return date.toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

const displayLabel = (value) =>
  String(value || 'unknown')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );

const errorMessage = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  'Unable to load this invoice.';

// ============================================================
// MAIN COMPONENT
// ============================================================

const Invoice = () => {
  const { id } = useParams();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ----------------------------------------------------------
  // LOAD INVOICE
  // ----------------------------------------------------------

  useEffect(() => {
    let active = true;

    const loadInvoice = async () => {
      if (!id) {
        setError('Invalid invoice ID.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const response =
          await salesService.getInvoice(id);

        if (!active) return;

        const invoiceData =
          response?.data || null;

        if (!invoiceData) {
          setError('Invoice not found.');
          setInvoice(null);
          return;
        }

        setInvoice(invoiceData);
      } catch (loadError) {
        if (!active) return;

        setInvoice(null);
        setError(
          errorMessage(loadError)
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadInvoice();

    return () => {
      active = false;
    };
  }, [id]);

  // ----------------------------------------------------------
  // LOADING
  // ----------------------------------------------------------

  if (loading) {
    return <InvoiceLoading />;
  }

  // ----------------------------------------------------------
  // ERROR
  // ----------------------------------------------------------

  if (error || !invoice) {
    return (
      <InvoiceError
        message={
          error || 'Invoice not found.'
        }
      />
    );
  }

  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------

  return (
    <main className="min-h-full bg-slate-50 px-4 py-4 sm:px-6 lg:px-8 print:bg-white print:p-0">
      <div className="mx-auto max-w-4xl">

        {/* ==================================================
            ACTION BAR
        ================================================== */}

        <div className="print-hidden mb-5 flex items-center justify-between gap-3">
          <Link
            to="/sales"
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-blue-600"
          >
            <FiArrowLeft />
            Back to Sales
          </Link>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <FiPrinter />
            Print Invoice
          </button>
        </div>

        {/* ==================================================
            INVOICE PAPER
        ================================================== */}

        <article className="invoice-paper rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10 print:rounded-none print:border-0 print:p-0 print:shadow-none">

          {/* ==================================================
              HEADER
          ================================================== */}

          <header className="flex flex-col justify-between gap-7 border-b border-slate-200 pb-7 sm:flex-row">

            {/* COMPANY */}
            <div className="min-w-0">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                Invoice
              </p>

              <h1 className="mt-3 text-2xl font-bold text-slate-900">
                {invoice.company?.name ||
                  'Company'}
              </h1>

              <div className="mt-3 space-y-1 text-sm text-slate-500">
                {invoice.company?.email && (
                  <p>
                    {invoice.company.email}
                  </p>
                )}

                {invoice.company?.phone && (
                  <p>
                    {invoice.company.phone}
                  </p>
                )}

                {invoice.company?.address && (
                  <p className="whitespace-pre-wrap">
                    {invoice.company.address}
                  </p>
                )}
              </div>
            </div>

            {/* INVOICE DETAILS */}
            <div className="sm:min-w-[190px] sm:text-right">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Invoice Number
              </p>

              <p className="mt-1 text-lg font-bold text-slate-900">
                {invoice.invoiceNumber ||
                  '—'}
              </p>

              <p className="mt-4 text-xs font-bold uppercase tracking-wide text-slate-400">
                Sale Date
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {formatDate(
                  invoice.saleDate
                )}
              </p>

              <StatusBadge
                status={invoice.status}
              />
            </div>
          </header>

          {/* ==================================================
              CUSTOMER + PAYMENT
          ================================================== */}

          <section className="grid grid-cols-1 gap-6 border-b border-slate-200 py-6 sm:grid-cols-2">

            {/* CUSTOMER */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Bill To
              </p>

              <p className="mt-2 font-semibold text-slate-800">
                {invoice.customerName ||
                  'Walk-in Customer'}
              </p>
            </div>

            {/* PAYMENT */}
            <div className="sm:text-right">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Payment Method
              </p>

              <p className="mt-2 font-semibold text-slate-800">
                {displayLabel(
                  invoice.paymentMethod
                )}
              </p>
            </div>
          </section>

          {/* ==================================================
              ITEMS
          ================================================== */}

          <section className="mt-7">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="pb-3 pr-4 font-semibold">
                      Product
                    </th>

                    <th className="pb-3 pr-4 font-semibold">
                      Code
                    </th>

                    <th className="pb-3 pr-4 text-right font-semibold">
                      Qty
                    </th>

                    <th className="pb-3 pr-4 text-right font-semibold">
                      Unit Price
                    </th>

                    <th className="pb-3 text-right font-semibold">
                      Total
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {Array.isArray(
                    invoice.items
                  ) &&
                  invoice.items.length > 0 ? (
                    invoice.items.map(
                      (item, index) => (
                        <tr
                          key={`${item.productCode || item.product || 'item'}-${index}`}
                        >
                          <td className="py-4 pr-4">
                            <p className="font-semibold text-slate-800">
                              {item.product ||
                                'Unknown product'}
                            </p>
                          </td>

                          <td className="py-4 pr-4 text-slate-500">
                            {item.productCode ||
                              '—'}
                          </td>

                          <td className="py-4 pr-4 text-right text-slate-600">
                            {item.quantity ??
                              0}
                          </td>

                          <td className="py-4 pr-4 text-right text-slate-600">
                            {formatMoney(
                              item.unitPrice
                            )}
                          </td>

                          <td className="py-4 text-right font-semibold text-slate-800">
                            {formatMoney(
                              item.total
                            )}
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="py-10 text-center text-sm text-slate-400"
                      >
                        No invoice items found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* ==================================================
              TOTAL
          ================================================== */}

          <section className="mt-7 flex justify-end border-t border-slate-200 pt-5">
            <div className="w-full sm:w-72">
              <div className="flex items-center justify-between gap-4">
                <span className="font-bold text-slate-700">
                  Total Amount
                </span>

                <span className="text-2xl font-bold text-slate-900">
                  {formatMoney(
                    invoice.totalAmount
                  )}
                </span>
              </div>
            </div>
          </section>

          {/* ==================================================
              NOTES
          ================================================== */}

          {invoice.notes && (
            <section className="mt-8 border-t border-slate-200 pt-5">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Notes
              </p>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                {invoice.notes}
              </p>
            </section>
          )}

          {/* ==================================================
              CREATED BY
          ================================================== */}

          {invoice.createdBy && (
            <footer className="mt-8 border-t border-slate-200 pt-5 text-sm text-slate-500">
              <p>
                Created by{' '}
                <span className="font-semibold text-slate-700">
                  {invoice.createdBy.name ||
                    'Unknown user'}
                </span>

                {invoice.createdBy.email && (
                  <span>
                    {' '}
                    ({invoice.createdBy.email})
                  </span>
                )}
              </p>
            </footer>
          )}

          {/* ==================================================
              FOOTER
          ================================================== */}

          <div className="mt-8 border-t border-slate-100 pt-5 text-center">
            <p className="text-xs text-slate-400">
              Thank you for your business.
            </p>
          </div>
        </article>
      </div>
    </main>
  );
};

// ============================================================
// STATUS BADGE
// ============================================================

const StatusBadge = ({ status }) => {
  const normalizedStatus =
    String(status || 'unknown').toLowerCase();

  const styles = {
    completed:
      'bg-emerald-50 text-emerald-700 ring-emerald-600/20',

    pending:
      'bg-amber-50 text-amber-700 ring-amber-600/20',

    cancelled:
      'bg-red-50 text-red-700 ring-red-600/20',

    unknown:
      'bg-slate-100 text-slate-600 ring-slate-500/20',
  };

  return (
    <span
      className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase ring-1 ring-inset ${
        styles[normalizedStatus] ||
        styles.unknown
      }`}
    >
      {displayLabel(status)}
    </span>
  );
};

// ============================================================
// LOADING
// ============================================================

const InvoiceLoading = () => (
  <main className="min-h-full bg-slate-50 px-4 py-4 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-4xl">

      <div className="mb-5 flex justify-between">
        <div className="h-9 w-32 animate-pulse rounded-lg bg-slate-200" />

        <div className="h-10 w-36 animate-pulse rounded-lg bg-slate-200" />
      </div>

      <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">

        <div className="flex justify-between gap-6 border-b border-slate-200 pb-7">
          <div>
            <div className="h-4 w-20 rounded bg-slate-200" />
            <div className="mt-4 h-7 w-52 rounded bg-slate-200" />
            <div className="mt-3 h-4 w-44 rounded bg-slate-100" />
            <div className="mt-2 h-4 w-36 rounded bg-slate-100" />
          </div>

          <div className="hidden sm:block">
            <div className="h-4 w-28 rounded bg-slate-100" />
            <div className="mt-2 h-6 w-36 rounded bg-slate-200" />
            <div className="mt-5 h-4 w-20 rounded bg-slate-100" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 border-b border-slate-200 py-6">
          <div>
            <div className="h-3 w-16 rounded bg-slate-100" />
            <div className="mt-3 h-5 w-32 rounded bg-slate-200" />
          </div>

          <div>
            <div className="ml-auto h-3 w-24 rounded bg-slate-100" />
            <div className="ml-auto mt-3 h-5 w-28 rounded bg-slate-200" />
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <div className="h-5 rounded bg-slate-100" />
          <div className="h-12 rounded bg-slate-100" />
          <div className="h-12 rounded bg-slate-100" />
          <div className="h-12 rounded bg-slate-100" />
        </div>

        <div className="mt-8 flex justify-end border-t border-slate-200 pt-5">
          <div className="h-8 w-48 rounded bg-slate-200" />
        </div>
      </div>
    </div>
  </main>
);

// ============================================================
// ERROR
// ============================================================

const InvoiceError = ({ message }) => (
  <main className="min-h-full bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-lg rounded-xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">

      <FiAlertCircle className="mx-auto text-4xl text-red-600" />

      <h1 className="mt-4 text-xl font-bold text-red-900">
        Invoice Unavailable
      </h1>

      <p className="mt-2 text-sm leading-6 text-red-700">
        {message}
      </p>

      <Link
        to="/sales"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-red-700 shadow-sm transition hover:bg-red-100"
      >
        <FiArrowLeft />
        Back to Sales
      </Link>
    </div>
  </main>
);

export default Invoice;