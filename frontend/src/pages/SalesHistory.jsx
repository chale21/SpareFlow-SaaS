import React, { useEffect, useMemo, useState } from 'react';
import { FiAlertCircle, FiArrowLeft, FiChevronDown, FiChevronUp, FiClock, FiFileText, FiRefreshCw, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import salesService from '../services/salesService';

const paymentOptions = [{ value: '', label: 'All payment methods' }, { value: 'cash', label: 'Cash' }, { value: 'card', label: 'Card' }, { value: 'bank_transfer', label: 'Bank Transfer' }, { value: 'other', label: 'Other' }];
const unwrap = (response) => response?.data ?? [];
const formatMoney = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'ETB', minimumFractionDigits: 2 }).format(Number(value || 0));
const formatDate = (value) => { const date = new Date(value); return Number.isNaN(date.getTime()) ? 'Unknown date' : date.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }); };
const displayLabel = (value) => String(value || 'unknown').replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const saleId = (sale) => sale?._id || sale?.id || '';
const errorMessage = (error) => error?.response?.data?.message || 'Unable to load sales history.';

const SalesHistory = () => {
  const [sales, setSales] = useState([]);
  const [search, setSearch] = useState('');
  const [payment, setPayment] = useState('');
  const [expanded, setExpanded] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await salesService.getSalesHistory();
      const data = unwrap(response);
      setSales(Array.isArray(data) ? data : []);
    } catch (loadError) {
      setError(errorMessage(loadError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadHistory(); }, []);

  const filteredSales = useMemo(() => {
    const term = search.trim().toLowerCase();
    return sales.filter((sale) => {
      const searchable = `${saleId(sale)} ${sale.customerName || 'walk-in customer'} ${sale.invoiceNumber || ''}`.toLowerCase();
      return (!term || searchable.includes(term)) && (!payment || sale.paymentMethod === payment);
    });
  }, [sales, search, payment]);

  const revenue = sales.reduce((total, sale) => total + Number(sale.totalAmount || 0), 0);
  return <main className="min-h-full bg-slate-50"><div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"><header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Transactions</p><h1 className="mt-1 text-3xl font-bold text-slate-900">Sales History</h1><p className="mt-2 text-sm text-slate-500">Review completed sales and their transaction details.</p></div><Link className="inline-flex items-center gap-2 self-start rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 sm:self-auto" to="/sales"><FiArrowLeft /> New sale</Link></header>
    {!loading && !error && sales.length > 0 && <section className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2"><Summary title="Completed sales" value={sales.length} /><Summary title="Total revenue" value={formatMoney(revenue)} /></section>}
    {!loading && !error && <div className="mb-5 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row"><label className="relative flex-1"><FiSearch className="absolute left-3 top-3.5 text-slate-400" /><input className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by sale ID or customer" /></label><select className="rounded-lg border border-slate-300 px-3 py-3 text-sm text-slate-700 outline-none focus:border-blue-500" value={payment} onChange={(event) => setPayment(event.target.value)}>{paymentOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</select></div>}
    {loading ? <HistorySkeleton /> : error ? <ErrorState message={error} onRetry={loadHistory} /> : !filteredSales.length ? <EmptyState hasSales={sales.length > 0} /> : <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-400"><tr><th className="px-5 py-4">Sale ID</th><th className="px-5 py-4">Customer</th><th className="px-5 py-4">Items</th><th className="px-5 py-4">Total</th><th className="px-5 py-4">Payment</th><th className="px-5 py-4">Date</th><th className="px-5 py-4">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{filteredSales.map((sale) => { const id = saleId(sale); const isOpen = expanded === id; return <React.Fragment key={id}><tr className="hover:bg-slate-50"><td className="px-5 py-4 font-semibold text-slate-800">SALE-{id.slice(-8).toUpperCase()}</td><td className="px-5 py-4 text-slate-600">{sale.customerName || 'Walk-in Customer'}</td><td className="px-5 py-4 text-slate-600">{(sale.items || []).length}</td><td className="px-5 py-4 font-semibold text-slate-800">{formatMoney(sale.totalAmount)}</td><td className="px-5 py-4 text-slate-600">{displayLabel(sale.paymentMethod)}</td><td className="whitespace-nowrap px-5 py-4 text-slate-500">{formatDate(sale.saleDate)}</td><td className="px-5 py-4"><div className="flex items-center gap-3"><button className="inline-flex items-center gap-1 font-semibold text-slate-600 hover:text-blue-600" type="button" onClick={() => setExpanded(isOpen ? '' : id)}>{isOpen ? <FiChevronUp /> : <FiChevronDown />} Details</button><Link className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700" to={`/sales/${id}/invoice`}><FiFileText /> Invoice</Link></div></td></tr>{isOpen && <tr><td className="bg-slate-50 px-5 py-4" colSpan="7"><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{(sale.items || []).map((item, index) => <div className="rounded-lg border border-slate-200 bg-white p-3" key={`${item.productCode || item.product}-${index}`}><p className="font-semibold text-slate-800">{item.product || 'Product'}</p><p className="mt-1 text-xs text-slate-500">{item.productCode || 'No code'} · Qty {item.quantity}</p><p className="mt-2 text-sm text-slate-600">{formatMoney(item.unitPrice)} each · <span className="font-semibold">{formatMoney(item.total)}</span></p></div>)}</div>{sale.createdBy && <p className="mt-3 text-xs text-slate-500">Created by {sale.createdBy.name || sale.createdBy.email || 'User'}</p>}</td></tr>}</React.Fragment>; })}</tbody></table></div></div>}
  </div></main>;
};

const Summary = ({ title, value }) => <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{title}</p><p className="mt-2 text-2xl font-bold text-slate-900">{value}</p></div>;
const HistorySkeleton = () => <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div className="animate-pulse space-y-4">{[1, 2, 3, 4, 5].map((item) => <div className="h-12 rounded bg-slate-100" key={item} />)}</div></div>;
const EmptyState = ({ hasSales }) => <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm"><FiClock className="mx-auto text-3xl text-slate-300" /><h2 className="mt-4 font-bold text-slate-900">{hasSales ? 'No sales found' : 'No completed sales yet'}</h2><p className="mt-2 text-sm text-slate-500">{hasSales ? 'Try a different search or payment filter.' : 'Completed sales will appear here after transactions are made.'}</p><Link className="mt-5 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white" to="/sales">Create a sale</Link></div>;
const ErrorState = ({ message, onRetry }) => <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center"><FiAlertCircle className="mx-auto text-3xl text-red-600" /><p className="mt-3 text-sm text-red-700">{message}</p><button className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-red-700" type="button" onClick={onRetry}><FiRefreshCw /> Try again</button></div>;

export default SalesHistory;
