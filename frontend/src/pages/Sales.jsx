import React, { useEffect, useMemo, useState } from 'react';
import {
  FiAlertCircle,
  FiCheckCircle,
  FiMinus,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiShoppingCart,
  FiTrash2,
  FiX,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

import productService from '../services/productService';
import salesService from '../services/salesService';

// ============================================================
// CONSTANTS
// ============================================================

const paymentMethods = [
  { value: 'cash', label: 'Cash' },
  { value: 'card', label: 'Card' },
  { value: 'bank_transfer', label: 'Bank transfer' },
  { value: 'other', label: 'Other' },
];

// ============================================================
// HELPERS
// ============================================================

const unwrap = (response) => response?.data ?? [];

const productId = (product) => product?._id || product?.id;

const amount = (value) => Number(value || 0);

const formatMoney = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'ETB',
    maximumFractionDigits: 2,
  }).format(amount(value));

const messageFromError = (
  error,
  fallback = 'Something went wrong. Please try again.'
) =>
  error?.response?.data?.message ||
  error?.message ||
  fallback;

// ============================================================
// MAIN COMPONENT
// ============================================================

const Sales = () => {
  // ----------------------------------------------------------
  // STATE
  // ----------------------------------------------------------

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  const [search, setSearch] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [createdSaleId, setCreatedSaleId] = useState('');

  // ----------------------------------------------------------
  // LOAD PRODUCTS
  // ----------------------------------------------------------

  const loadProducts = async ({ silent = false } = {}) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError('');

    try {
      const response = await productService.getProducts();
      const data = unwrap(response);

      const productList = Array.isArray(data) ? data : [];

      setProducts(productList);

      // Keep cart synchronized with the latest stock/prices.
      setCart((currentCart) =>
        currentCart
          .map((cartItem) => {
            const updatedProduct = productList.find(
              (product) =>
                productId(product) === cartItem.id
            );

            if (!updatedProduct) {
              return null;
            }

            const availableStock = amount(
              updatedProduct.quantity
            );

            if (availableStock <= 0) {
              return null;
            }

            return {
              ...cartItem,
              product: updatedProduct,
              quantity: Math.min(
                cartItem.quantity,
                availableStock
              ),
            };
          })
          .filter(Boolean)
      );
    } catch (loadError) {
      setError(
        messageFromError(
          loadError,
          'Unable to load products.'
        )
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // ----------------------------------------------------------
  // DERIVED DATA
  // ----------------------------------------------------------

  const availableProducts = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return products.filter((product) => {
      const stock = amount(product.quantity);

      if (stock <= 0) {
        return false;
      }

      if (!searchTerm) {
        return true;
      }

      const searchableText = `
        ${product.productName || ''}
        ${product.productCode || ''}
      `.toLowerCase();

      return searchableText.includes(searchTerm);
    });
  }, [products, search]);

  const total = useMemo(
    () =>
      cart.reduce(
        (sum, item) =>
          sum +
          amount(item.product.sellingPrice) *
            item.quantity,
        0
      ),
    [cart]
  );

  const itemCount = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + item.quantity,
        0
      ),
    [cart]
  );

  // ----------------------------------------------------------
  // CART ACTIONS
  // ----------------------------------------------------------

  const addProduct = (product) => {
    const id = productId(product);
    const stock = amount(product.quantity);

    if (!id || stock <= 0) {
      return;
    }

    setError('');
    setSuccess('');

    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.id === id
      );

      if (existingItem) {
        if (existingItem.quantity >= stock) {
          return currentCart;
        }

        return currentCart.map((item) =>
          item.id === id
            ? {
                ...item,
                product,
                quantity: Math.min(
                  item.quantity + 1,
                  stock
                ),
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          id,
          product,
          quantity: 1,
        },
      ];
    });
  };

  const updateQuantity = (id, quantity) => {
    const item = cart.find(
      (cartItem) => cartItem.id === id
    );

    if (!item) {
      return;
    }

    const stock = amount(item.product.quantity);

    if (stock <= 0) {
      removeProduct(id);
      return;
    }

    const numericQuantity = Number(quantity);

    if (!Number.isFinite(numericQuantity)) {
      return;
    }

    const nextQuantity = Math.max(
      1,
      Math.min(
        Math.floor(numericQuantity),
        stock
      )
    );

    setCart((currentCart) =>
      currentCart.map((cartItem) =>
        cartItem.id === id
          ? {
              ...cartItem,
              quantity: nextQuantity,
            }
          : cartItem
      )
    );
  };

  const removeProduct = (id) => {
    setCart((currentCart) =>
      currentCart.filter(
        (cartItem) => cartItem.id !== id
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // ----------------------------------------------------------
  // SUBMIT SALE
  // ----------------------------------------------------------

  const submitSale = async (event) => {
    event.preventDefault();

    setError('');
    setSuccess('');

    if (submitting) {
      return;
    }

    if (!cart.length) {
      setError(
        'Add at least one product before completing the sale.'
      );
      return;
    }

    const invalidItem = cart.find(
      (item) => {
        const stock = amount(
          item.product.quantity
        );

        return (
          item.quantity < 1 ||
          item.quantity > stock
        );
      }
    );

    if (invalidItem) {
      setError(
        `Insufficient stock for ${invalidItem.product.productName}. Please update the quantity.`
      );
      return;
    }

    setSubmitting(true);

    try {
      // IMPORTANT:
      // Backend expects productId + quantity.
      // Backend calculates prices and totalAmount.
      const data = {
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        paymentMethod,
      };

      if (customerName.trim()) {
        data.customerName =
          customerName.trim();
      }

      if (notes.trim()) {
        data.notes = notes.trim();
      }

      const response =
        await salesService.createSale(data);

      const createdSale = response?.data;
      setCreatedSaleId(createdSale?._id || createdSale?.id || '');

      setSuccess(
        response?.message ||
          'Sale completed successfully.'
      );

      // Reset sale form.
      setCart([]);
      setCustomerName('');
      setPaymentMethod('cash');
      setNotes('');

      // Refresh stock after sale.
      await loadProducts({ silent: true });
    } catch (submitError) {
      setError(
        messageFromError(
          submitError,
          'Unable to complete the sale.'
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------

  return (
    <main className="min-h-full bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* HEADER */}
        <header className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                Point of Sale
              </p>

              <h1 className="mt-1 text-3xl font-bold text-slate-900">
                Create Sale
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                Select products, review the order,
                and complete the sale.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm">
              <FiShoppingCart className="text-blue-600" />

              <span className="font-semibold text-slate-700">
                {itemCount}
              </span>

              <span className="text-slate-400">
                {itemCount === 1
                  ? 'item'
                  : 'items'}
              </span>
            </div>

            <Link
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              to="/sales/history"
            >
              View history
            </Link>
          </div>
        </header>

        {/* ALERTS */}
        {error && (
          <Notice
            type="error"
            message={error}
            onDismiss={() => setError('')}
          />
        )}

        {success && (
          <Notice
            type="success"
            message={success}
            onDismiss={() => setSuccess('')}
          >
            {createdSaleId && (
              <Link
                className="ml-2 font-semibold underline"
                to={`/sales/${createdSaleId}/invoice`}
              >
                Open invoice
              </Link>
            )}
          </Notice>
        )}

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">

          {/* ==================================================
              PRODUCTS
          ================================================== */}

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

            {/* SECTION HEADER */}
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-bold text-slate-900">
                  Products
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Only products with available stock
                  are shown.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  loadProducts({ silent: true })
                }
                disabled={refreshing}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FiRefreshCw
                  className={
                    refreshing
                      ? 'animate-spin'
                      : ''
                  }
                />

                {refreshing
                  ? 'Refreshing...'
                  : 'Refresh stock'}
              </button>
            </div>

            {/* SEARCH */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-3.5 text-slate-400" />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search by product name or code"
                className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* PRODUCTS */}
            {loading ? (
              <ProductSkeleton />
            ) : availableProducts.length > 0 ? (
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {availableProducts.map(
                  (product) => {
                    const id = productId(product);

                    const selectedItem =
                      cart.find(
                        (item) =>
                          item.id === id
                      );

                    const stock =
                      amount(
                        product.quantity
                      );

                    const selectedQuantity =
                      selectedItem?.quantity || 0;

                    const soldOutInCart =
                      selectedQuantity >=
                      stock;

                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() =>
                          addProduct(product)
                        }
                        disabled={
                          soldOutInCart
                        }
                        className="group flex items-center justify-between rounded-xl border border-slate-200 p-4 text-left transition hover:border-blue-400 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <span className="min-w-0">
                          <span className="block truncate font-semibold text-slate-800">
                            {product.productName ||
                              'Unnamed product'}
                          </span>

                          <span className="mt-1 block truncate text-xs text-slate-400">
                            {product.productCode ||
                              'No product code'}
                          </span>

                          <span className="mt-1 block text-xs font-medium text-slate-500">
                            {stock} available
                          </span>
                        </span>

                        <span className="ml-3 shrink-0 text-right">
                          <span className="block font-bold text-slate-900">
                            {formatMoney(
                              product.sellingPrice
                            )}
                          </span>

                          <span
                            className={`mt-2 inline-flex items-center gap-1 text-xs font-semibold ${
                              soldOutInCart
                                ? 'text-slate-400'
                                : 'text-blue-600'
                            }`}
                          >
                            <FiPlus />

                            {soldOutInCart
                              ? 'Max added'
                              : selectedItem
                              ? 'Add one'
                              : 'Add'}
                          </span>
                        </span>
                      </button>
                    );
                  }
                )}
              </div>
            ) : (
              <EmptyProducts
                hasProducts={
                  products.length > 0
                }
                hasSearch={
                  search.trim().length > 0
                }
              />
            )}
          </section>

          {/* ==================================================
              CURRENT SALE
          ================================================== */}

          <form
            onSubmit={submitSale}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            {/* SALE HEADER */}
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="font-bold text-slate-900">
                  Current Sale
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {itemCount}{' '}
                  {itemCount === 1
                    ? 'item'
                    : 'items'}
                </p>
              </div>

              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs font-semibold text-red-500 transition hover:text-red-700"
                >
                  Clear cart
                </button>
              )}
            </div>

            {/* CART */}
            {cart.length > 0 ? (
              <div className="space-y-3">
                {cart.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onQuantityChange={
                      updateQuantity
                    }
                    onRemove={
                      removeProduct
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 py-12 text-center">
                <FiShoppingCart className="mx-auto mb-3 text-3xl text-slate-300" />

                <p className="text-sm font-medium text-slate-500">
                  Your sale is empty.
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Add products from the list to
                  begin.
                </p>
              </div>
            )}

            {/* SALE DETAILS */}
            <div className="mt-6 space-y-4 border-t border-slate-100 pt-5">

              {/* CUSTOMER */}
              <Field label="Customer name">
                <input
                  type="text"
                  value={customerName}
                  onChange={(event) =>
                    setCustomerName(
                      event.target.value
                    )
                  }
                  maxLength={100}
                  placeholder="Optional"
                  className="input"
                />
              </Field>

              {/* PAYMENT */}
              <Field label="Payment method">
                <select
                  value={paymentMethod}
                  onChange={(event) =>
                    setPaymentMethod(
                      event.target.value
                    )
                  }
                  className="input"
                >
                  {paymentMethods.map(
                    (method) => (
                      <option
                        key={method.value}
                        value={
                          method.value
                        }
                      >
                        {method.label}
                      </option>
                    )
                  )}
                </select>
              </Field>

              {/* NOTES */}
              <Field label="Notes">
                <textarea
                  value={notes}
                  onChange={(event) =>
                    setNotes(
                      event.target.value
                    )
                  }
                  placeholder="Optional sale notes"
                  rows={3}
                  className="input resize-y"
                />
              </Field>

              {/* TOTAL */}
              <div className="border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">
                    Total
                  </span>

                  <span className="text-2xl font-bold text-slate-900">
                    {formatMoney(total)}
                  </span>
                </div>

                <p className="mt-1 text-right text-xs text-slate-400">
                  Final amount is calculated by the
                  server.
                </p>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={
                  !cart.length ||
                  submitting
                }
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <FiRefreshCw className="animate-spin" />
                    Completing sale...
                  </>
                ) : (
                  <>
                    <FiCheckCircle />
                    Complete sale
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

// ============================================================
// CART ITEM
// ============================================================

const CartItem = ({
  item,
  onQuantityChange,
  onRemove,
}) => {
  const stock = amount(
    item.product.quantity
  );

  const unitPrice = amount(
    item.product.sellingPrice
  );

  const subtotal =
    item.quantity * unitPrice;

  return (
    <div className="rounded-xl border border-slate-200 p-3">
      {/* PRODUCT INFO */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-800">
            {item.product.productName ||
              'Unnamed product'}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {formatMoney(unitPrice)} each
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {stock} in stock
          </p>
        </div>

        <button
          type="button"
          aria-label={`Remove ${
            item.product.productName
          }`}
          onClick={() =>
            onRemove(item.id)
          }
          className="rounded-md p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
        >
          <FiTrash2 />
        </button>
      </div>

      {/* QUANTITY + SUBTOTAL */}
      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="flex items-center rounded-lg border border-slate-200">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() =>
              onQuantityChange(
                item.id,
                item.quantity - 1
              )
            }
            disabled={
              item.quantity <= 1
            }
            className="p-2 text-slate-500 transition hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FiMinus />
          </button>

          <input
            type="number"
            min="1"
            max={stock}
            value={item.quantity}
            aria-label={`Quantity for ${item.product.productName}`}
            onChange={(event) =>
              onQuantityChange(
                item.id,
                event.target.value
              )
            }
            className="w-12 border-x border-slate-200 py-1.5 text-center text-sm font-semibold outline-none"
          />

          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() =>
              onQuantityChange(
                item.id,
                item.quantity + 1
              )
            }
            disabled={
              item.quantity >= stock
            }
            className="p-2 text-slate-500 transition hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FiPlus />
          </button>
        </div>

        <div className="text-right">
          <p className="text-xs text-slate-400">
            Subtotal
          </p>

          <p className="font-bold text-slate-800">
            {formatMoney(subtotal)}
          </p>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// FIELD
// ============================================================

const Field = ({
  label,
  children,
}) => (
  <label className="block">
    <span className="mb-1.5 block text-sm font-semibold text-slate-700">
      {label}
    </span>

    {children}
  </label>
);

// ============================================================
// NOTICE
// ============================================================

const Notice = ({
  type,
  message,
  onDismiss,
  children,
}) => {
  const isError = type === 'error';

  return (
    <div
      className={`mb-5 flex items-start gap-3 rounded-lg border p-3 text-sm ${
        isError
          ? 'border-red-200 bg-red-50 text-red-700'
          : 'border-emerald-200 bg-emerald-50 text-emerald-700'
      }`}
      role="alert"
    >
      <span className="mt-0.5">
        {isError ? (
          <FiAlertCircle />
        ) : (
          <FiCheckCircle />
        )}
      </span>

      <span className="flex-1">
        {message}
        {children}
      </span>

      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss message"
        className="rounded p-1 transition hover:bg-black/5"
      >
        <FiX />
      </button>
    </div>
  );
};

// ============================================================
// EMPTY PRODUCTS
// ============================================================

const EmptyProducts = ({
  hasProducts,
  hasSearch,
}) => (
  <div className="py-16 text-center">
    <FiShoppingCart className="mx-auto mb-3 text-3xl text-slate-300" />

    <p className="text-sm font-medium text-slate-500">
      {hasSearch
        ? 'No products match your search.'
        : hasProducts
        ? 'All products are currently out of stock.'
        : 'No products are available for sale.'}
    </p>

    <p className="mt-1 text-xs text-slate-400">
      {hasSearch
        ? 'Try a different product name or code.'
        : 'Add stock to products before creating a sale.'}
    </p>
  </div>
);

// ============================================================
// PRODUCT SKELETON
// ============================================================

const ProductSkeleton = () => (
  <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
    {[1, 2, 3, 4].map((item) => (
      <div
        key={item}
        className="h-24 animate-pulse rounded-xl bg-slate-100"
      />
    ))}
  </div>
);

export default Sales;