import React, { useCallback, useEffect, useState } from 'react';
import { FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import { productService } from '../services/productService';

const StockMovements = () => {
  const [movements, setMovements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadMovements = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      setMovements(await productService.getStockMovements());
    } catch (loadError) {
      setError(loadError?.response?.data?.message || 'Unable to load stock movements.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMovements();
  }, [loadMovements]);

  return (
    <section className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Stock Movements</h1>
          <p className="mt-1 text-sm text-slate-500">
            Track stock receipts, sales, and authorized manual adjustments.
          </p>
        </div>
        <button
          type="button"
          onClick={loadMovements}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <FiRefreshCw className={isLoading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <FiAlertCircle />
          <span>{error}</span>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {['Date', 'Type', 'Product', 'Quantity', 'Previous stock', 'New stock', 'Reference'].map((label) => (
                <th key={label} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr><td colSpan="7" className="px-4 py-12 text-center text-sm text-slate-500">Loading stock movements...</td></tr>
            ) : movements.length === 0 ? (
              <tr><td colSpan="7" className="px-4 py-12 text-center text-sm text-slate-500">No stock movements recorded yet.</td></tr>
            ) : movements.map((movement) => {
              const product = movement.productId;
              const quantity = Number(movement.quantity || 0);
              return (
                <tr key={movement._id || movement.id} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                    {new Date(movement.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-700">
                    {String(movement.type || 'unknown').replace(/_/g, ' ')}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {product && typeof product === 'object'
                      ? `${product.productName || 'Product'}${product.productCode ? ` (${product.productCode})` : ''}`
                      : 'Product'}
                  </td>
                  <td className={`px-4 py-3 text-sm font-semibold ${quantity >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                    {quantity > 0 ? '+' : ''}{quantity}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{movement.previousQuantity}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{movement.newQuantity}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">
                    {movement.notes || movement.referenceId || '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default StockMovements;
