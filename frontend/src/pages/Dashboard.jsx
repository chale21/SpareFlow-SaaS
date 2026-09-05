import React, { useCallback, useEffect, useState } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Filler, Legend, LinearScale, LineElement, PointElement, Tooltip } from 'chart.js';
import { FiActivity, FiAlertTriangle, FiBox, FiCheckCircle, FiDollarSign, FiPackage, FiPlus, FiRefreshCw, FiShoppingCart, FiTruck } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import dashboardService from '../services/dashboardService';
import productService from '../services/productService';
import purchaseService from '../services/purchaseService';
import salesService from '../services/salesService';

ChartJS.register(ArcElement, BarElement, CategoryScale, Filler, Legend, LinearScale, LineElement, PointElement, Tooltip);

const unwrap = (response) => {
  if (Array.isArray(response)) {
    return response;
  }

  return response?.data ?? [];
};
const asArray = (value) => (Array.isArray(value) ? value : []);
const number = (value) => Number(value || 0);
const money = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'ETB', maximumFractionDigits: 0 }).format(number(value));
const dateText = (value) => value ? new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Unknown date';
const idText = (item) => item?._id || item?.id || '—';
const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: '#e2e8f0' } }, x: { grid: { display: false } } } };
let dashboardRequest;

const requestDashboardData = () => {
  if (!dashboardRequest) {
    dashboardRequest = Promise.allSettled([
      dashboardService.getStats(),
      dashboardService.getRecentActivities(),
      productService.getProducts(),
      salesService.getSales(),
      purchaseService.getPurchases(),
      dashboardService.getDailySales(),
      dashboardService.getMonthlySales(),
      dashboardService.getTopProducts(),
    ]).finally(() => { dashboardRequest = null; });
  }
  return dashboardRequest;
};

const Dashboard = () => {
  const [state, setState] = useState({ loading: true, refreshing: false, error: '', stats: {}, activities: [], products: [], sales: [], purchases: [], daily: [], monthly: [], topProducts: [] });
  const load = useCallback(async (refresh = false) => {
    setState((current) => ({ ...current, loading: !refresh, refreshing: refresh, error: refresh ? '' : current.error }));
    const requests = await requestDashboardData();
    const [stats, activities, products, sales, purchases, daily, monthly, topProducts] = requests.map((result) => result.status === 'fulfilled' ? unwrap(result.value) : null);
    setState({ loading: false, refreshing: false, error: requests.some((result) => result.status === 'rejected') ? 'Some dashboard data could not be loaded.' : '', stats: stats || {}, activities: asArray(activities), products: asArray(products), sales: asArray(sales), purchases: asArray(purchases), daily: asArray(daily), monthly: asArray(monthly), topProducts: asArray(topProducts) });
  }, []);
  useEffect(() => { load(); }, [load]);

  const { stats, products, sales, purchases } = state;
  const totalStock = products.reduce((total, product) => total + number(product.quantity), 0);
  const lowStock = products.filter((product) => number(product.quantity) > 0 && number(product.quantity) <= number(product.minimumStock));
  const outOfStock = products.filter((product) => number(product.quantity) === 0);
  const trend = (state.monthly.length ? state.monthly : state.daily).slice().reverse().slice(-6);
  const labels = trend.map((item) => item._id ? (item._id.day ? `${item._id.month}/${item._id.day}` : `${item._id.month}/${item._id.year}`) : dateText(item.date));
  const values = trend.map((item) => number(item.totalRevenue));
  if (state.loading) return <DashboardSkeleton />;

  return <main className="min-h-full bg-slate-50"><div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
    <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Business overview</p><h1 className="mt-1 text-3xl font-bold text-slate-900">Dashboard</h1><p className="mt-2 text-sm text-slate-500">Your company&apos;s current sales and inventory position.</p></div><div className="flex flex-wrap gap-2"><Link className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700" to="/purchases"><FiTruck /> New purchase</Link><Link className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white" to="/sales"><FiPlus /> New sale</Link><button className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700" type="button" onClick={() => load(true)} disabled={state.refreshing}><FiRefreshCw className={state.refreshing ? 'animate-spin' : ''} /> Refresh</button></div></header>
    {state.error && <div className="mb-5 flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"><span>{state.error}</span><button className="font-semibold underline" onClick={() => load(true)} type="button">Retry</button></div>}
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"><Kpi title="Total products" value={products.length || stats.totalProducts || 0} icon={<FiPackage />} tone="blue" /><Kpi title="Stock quantity" value={totalStock} icon={<FiBox />} tone="teal" /><Kpi title="Sales revenue" value={money(stats.totalRevenue)} icon={<FiDollarSign />} tone="green" /><Kpi title="Low stock" value={number(stats.lowStockProducts) || lowStock.length} icon={<FiAlertTriangle />} tone="amber" warning={lowStock.length > 0 || number(stats.lowStockProducts) > 0} /></section>
    <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3"><Panel title="Revenue over time" action={<Link to="/reports">View reports</Link>} className="xl:col-span-2"><div className="h-72">{trend.length ? <Line options={chartOptions} data={{ labels, datasets: [{ label: 'Revenue', data: values, borderColor: '#2563eb', backgroundColor: 'rgba(37,99,235,.1)', fill: true, tension: .35 }] }} /> : <Empty text="No completed sales yet" />}</div></Panel><Panel title="Inventory status"><div className="h-72">{products.length ? <Doughnut options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} data={{ labels: ['In stock', 'Low stock', 'Out of stock'], datasets: [{ data: [Math.max(products.length - lowStock.length - outOfStock.length, 0), lowStock.length, outOfStock.length], backgroundColor: ['#14b8a6', '#f59e0b', '#ef4444'], borderWidth: 0 }] }} /> : <Empty text="No products yet" />}</div></Panel></section>
    <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3"><Panel title="Sales and purchases" className="xl:col-span-2"><div className="h-64">{state.monthly.length ? <Bar options={chartOptions} data={{ labels: state.monthly.slice().reverse().slice(-6).map((item) => `${item._id.month}/${item._id.year}`), datasets: [{ label: 'Sales', data: state.monthly.slice().reverse().slice(-6).map((item) => number(item.totalRevenue)), backgroundColor: '#2563eb' }] }} /> : <Empty text="No monthly sales data yet" />}</div><p className="mt-2 text-xs text-slate-400">Purchase analytics are not exposed by the current backend.</p></Panel><Panel title="Top-selling products"><div className="space-y-3">{state.topProducts.length ? state.topProducts.slice(0, 5).map((item, index) => <div className="flex items-center justify-between border-b border-slate-100 pb-3" key={`${idText(item)}-${index}`}><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-800">{item.product?.productName || item.productName || 'Product'}</p><p className="text-xs text-slate-400">{item.product?.productCode || item.productCode || 'No SKU'}</p></div><span className="text-sm font-bold text-slate-700">{number(item.totalQuantitySold)} sold</span></div>) : <Empty text="No product sales yet" />}</div></Panel></section>
    <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3"><Panel title="Recent sales" action={<Link to="/sales">View all</Link>} className="xl:col-span-2"><DataTable headers={['Sale', 'Customer', 'Amount', 'Date']} rows={sales.slice(0, 5).map((sale) => [idText(sale).slice(-8), sale.customer?.name || sale.customerName || 'Walk-in', money(sale.totalAmount), dateText(sale.createdAt || sale.saleDate)])} empty="No sales yet" /></Panel><Panel title="Inventory alerts" action={<Link to="/inventory">View inventory</Link>}>{lowStock.length || outOfStock.length ? <div className="space-y-3">{[...outOfStock, ...lowStock].slice(0, 6).map((product, index) => <div className="flex items-start gap-3 rounded-lg bg-amber-50 p-3" key={`${idText(product)}-${index}`}><FiAlertTriangle className="mt-0.5 shrink-0 text-amber-600" /><div><p className="text-sm font-semibold text-slate-800">{product.productName}</p><p className="text-xs text-slate-600">Stock: {number(product.quantity)} · Minimum: {number(product.minimumStock)}</p></div></div>)}</div> : <div className="flex items-center gap-3 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-700"><FiCheckCircle /> Inventory looks healthy</div>}</Panel></section>
    <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2"><Panel title="Recent activity"><ActivityList activities={state.activities} /></Panel><Panel title="Recent purchases" action={<Link to="/purchases">View all</Link>}><DataTable headers={['Purchase', 'Supplier', 'Amount', 'Date']} rows={purchases.slice(0, 5).map((purchase) => [idText(purchase).slice(-8), purchase.supplierId?.supplierName || 'Supplier', money(purchase.totalAmount), dateText(purchase.createdAt)])} empty="No purchases yet" /></Panel></section>
  </div></main>;
};

const Kpi = ({ title, value, icon, tone, warning }) => <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-sm text-slate-500">{title}</p><p className={`mt-2 text-2xl font-bold ${warning ? 'text-amber-600' : 'text-slate-900'}`}>{value}</p></div><span className={`rounded-lg p-3 ${tone === 'amber' ? 'bg-amber-50 text-amber-600' : tone === 'green' ? 'bg-emerald-50 text-emerald-600' : tone === 'teal' ? 'bg-teal-50 text-teal-600' : 'bg-blue-50 text-blue-600'}`}>{icon}</span></div></div>;
const Panel = ({ title, action, children, className = '' }) => <div className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}><div className="mb-5 flex items-center justify-between"><h2 className="font-bold text-slate-900">{title}</h2><span className="text-sm font-semibold text-blue-600">{action}</span></div>{children}</div>;
const Empty = ({ text }) => <div className="flex h-full items-center justify-center text-sm text-slate-400">{text}</div>;
const DataTable = ({ headers, rows, empty }) => rows.length ? <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="text-xs uppercase text-slate-400"><tr>{headers.map((header) => <th className="pb-3 pr-4 font-semibold" key={header}>{header}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{rows.map((row, index) => <tr key={`${row[0]}-${index}`}>{row.map((cell, cellIndex) => <td className="whitespace-nowrap py-3 pr-4 text-slate-600" key={`${cell}-${cellIndex}`}>{cell}</td>)}</tr>)}</tbody></table></div> : <Empty text={empty} />;
const ActivityList = ({ activities }) => activities.length ? <div className="divide-y divide-slate-100">{activities.slice(0, 6).map((activity, index) => <div className="flex items-start gap-3 py-3" key={`${activity.referenceId || activity.type}-${index}`}><span className="mt-1 text-blue-600"><FiActivity /></span><div className="min-w-0 flex-1"><p className="text-sm font-semibold text-slate-800">{activity.type || 'Activity'}</p><p className="text-sm text-slate-500">{activity.description || 'Business activity recorded'}</p></div><time className="whitespace-nowrap text-xs text-slate-400">{dateText(activity.date)}</time></div>)}</div> : <Empty text="No recent activity" />;
const DashboardSkeleton = () => <main className="min-h-full bg-slate-50 p-6"><div className="mx-auto max-w-7xl animate-pulse"><div className="h-10 w-64 rounded bg-slate-200" /><div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{[1, 2, 3, 4].map((item) => <div className="h-28 rounded-xl bg-white" key={item} />)}</div><div className="mt-5 h-80 rounded-xl bg-white" /></div></main>;

export default Dashboard;
