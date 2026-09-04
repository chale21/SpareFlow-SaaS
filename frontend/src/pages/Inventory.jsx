import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  FiAlertTriangle,
  FiBox,
  FiEdit2,
  FiEye,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiTrash2,
  FiX,
  FiXCircle,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import useAuth from '../hooks/useAuth';

import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import ConfirmDialog from '../components/common/ConfirmDialog';

import ProductForm from '../components/products/ProductForm';
import StockStatus, {
  getStockStatus,
} from '../components/products/StockStatus';

import {
  categoryService,
  productService,
  supplierService,
} from '../services/productService';

// ============================================================
// HELPERS
// ============================================================

const money = (value) =>
  new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

const getId = (item) => {
  if (!item) return '';

  if (typeof item === 'string') {
    return item;
  }

  return String(
    item._id ||
      item.id ||
      item.categoryId ||
      item.supplierId ||
      ''
  );
};

const getName = (value, fallback = '-') => {
  if (!value) {
    return fallback;
  }

  if (typeof value === 'string') {
    return value;
  }

  return (
    value.categoryName ||
    value.supplierName ||
    value.name ||
    value.title ||
    fallback
  );
};

/**
 * Normalize list responses defensively.
 *
 * Normally productService already returns arrays, but this keeps
 * Inventory safe if an interceptor or another service changes
 * the response structure.
 */
const normalizeList = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (Array.isArray(value?.data)) {
    return value.data;
  }

  if (Array.isArray(value?.items)) {
    return value.items;
  }

  if (Array.isArray(value?.results)) {
    return value.results;
  }

  if (Array.isArray(value?.categories)) {
    return value.categories;
  }

  if (Array.isArray(value?.suppliers)) {
    return value.suppliers;
  }

  if (Array.isArray(value?.products)) {
    return value.products;
  }

  return [];
};

// ============================================================
// INVENTORY PAGE
// ============================================================

const Inventory = () => {
  const navigate = useNavigate();

  const { isShopOwner } = useAuth();

  // ============================================================
  // STATE
  // ============================================================

  const [products, setProducts] = useState([]);

  const [categories, setCategories] = useState([]);

  const [suppliers, setSuppliers] = useState([]);

  const [search, setSearch] = useState('');

  const [categoryId, setCategoryId] = useState('');

  const [status, setStatus] = useState('all');

  const [loading, setLoading] = useState(true);

  const [referencesLoading, setReferencesLoading] =
    useState(true);

  const [formLoading, setFormLoading] = useState(false);

  const [error, setError] = useState('');

  const [referenceError, setReferenceError] =
    useState('');

  const [modal, setModal] = useState(null);

  const [deleteTarget, setDeleteTarget] =
    useState(null);

  // ============================================================
  // LOAD PRODUCTS
  // ============================================================

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const params = {};

      if (search.trim()) {
        params.q = search.trim();
      }

      if (categoryId) {
        params.categoryId = categoryId;
      }

      if (status === 'low') {
        params.lowStock = 'true';
      }

      if (status === 'out') {
        params.outOfStock = 'true';
      }

      const data =
        await productService.searchProducts(params);

      setProducts(normalizeList(data));
    } catch (err) {
      console.error(
        'Failed to load products:',
        err
      );

      setError(
        err?.response?.data?.message ||
          'Unable to load products.'
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search, categoryId, status]);

  // ============================================================
  // LOAD CATEGORIES + SUPPLIERS
  // ============================================================

  const loadReferences = useCallback(async () => {
    setReferencesLoading(true);
    setReferenceError('');

    try {
      /**
       * Both requests use the authenticated API instance.
       *
       * Backend:
       * GET /api/v1/categories
       * GET /api/v1/suppliers
       */
      const [categoryResult, supplierResult] =
        await Promise.all([
          categoryService.list(),
          supplierService.list(),
        ]);

      const categoryList =
        normalizeList(categoryResult);

      const supplierList =
        normalizeList(supplierResult);

      console.log(
        'Inventory categories:',
        categoryList
      );

      console.log(
        'Inventory suppliers:',
        supplierList
      );

      setCategories(categoryList);

      setSuppliers(supplierList);

      if (
        categoryList.length === 0 ||
        supplierList.length === 0
      ) {
        const missing = [];

        if (categoryList.length === 0) {
          missing.push('categories');
        }

        if (supplierList.length === 0) {
          missing.push('suppliers');
        }

        setReferenceError(
          `No ${missing.join(
            ' or '
          )} found. Please create them before adding a product.`
        );
      }
    } catch (err) {
      console.error(
        'Failed to load product references:',
        err
      );

      setCategories([]);
      setSuppliers([]);

      setReferenceError(
        err?.response?.data?.message ||
          'Unable to load categories and suppliers.'
      );
    } finally {
      setReferencesLoading(false);
    }
  }, []);

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    loadReferences();
  }, [loadReferences]);

  // ============================================================
  // PRODUCT SEARCH / FILTER
  // ============================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts();
    }, 250);

    return () => clearTimeout(timer);
  }, [loadProducts]);

  // ============================================================
  // STATS
  // ============================================================

  const stats = useMemo(() => {
    let low = 0;

    let out = 0;

    let stockUnits = 0;

    products.forEach((product) => {
      const quantity = Number(
        product.quantity || 0
      );

      stockUnits += quantity;

      const currentStatus = getStockStatus(
        quantity,
        product.minimumStock
      );

      if (currentStatus === 'low') {
        low += 1;
      }

      if (currentStatus === 'out') {
        out += 1;
      }
    });

    return {
      total: products.length,

      low,

      out,

      inStock:
        products.length - low - out,

      stockUnits,
    };
  }, [products]);

  // ============================================================
  // CREATE
  // ============================================================

  const openCreate = async () => {
    /**
     * Refresh references immediately before opening the form.
     *
     * This is useful if the user created a category/supplier
     * from another page and then came back to Inventory.
     */
    await loadReferences();

    setModal({
      type: 'create',
    });
  };

  // ============================================================
  // EDIT
  // ============================================================

  const openEdit = async (product) => {
    /**
     * Refresh references before editing too.
     */
    await loadReferences();

    setModal({
      type: 'edit',

      product: {
        productName:
          product.productName || '',

        categoryId:
          getId(product.categoryId) || '',

        productCode:
          product.productCode || '',

        quantity:
          product.quantity ?? 0,

        purchasePrice:
          product.purchasePrice ?? '',

        sellingPrice:
          product.sellingPrice ?? '',

        minimumStock:
          product.minimumStock ?? 0,

        maximumStock:
          product.maximumStock ?? '',

        supplierId:
          getId(product.supplierId) || '',
      },

      id: getId(product),
    });
  };

  // ============================================================
  // SUBMIT PRODUCT
  // ============================================================

  const submitProduct = async (payload) => {
    setFormLoading(true);
    setError('');

    try {
      if (modal?.type === 'create') {
        await productService.createProduct(
          payload
        );
      } else if (modal?.type === 'edit') {
        await productService.updateProduct(
          modal.id,
          payload
        );
      }

      setModal(null);

      await loadProducts();
    } catch (err) {
      console.error(
        'Failed to save product:',
        err
      );

      const message =
        err?.response?.data?.message ||
        'Could not save the product.';

      setError(message);
    } finally {
      setFormLoading(false);
    }
  };

  // ============================================================
  // DELETE PRODUCT
  // ============================================================

  const deleteProduct = async () => {
    if (!deleteTarget) {
      return;
    }

    const productId =
      getId(deleteTarget);

    if (!productId) {
      setError(
        'Unable to determine the product ID.'
      );

      return;
    }

    setFormLoading(true);
    setError('');

    try {
      await productService.deleteProduct(
        productId
      );

      setDeleteTarget(null);

      await loadProducts();
    } catch (err) {
      console.error(
        'Failed to delete product:',
        err
      );

      setError(
        err?.response?.data?.message ||
          'Could not delete product.'
      );

      setDeleteTarget(null);
    } finally {
      setFormLoading(false);
    }
  };

  // ============================================================
  // REFRESH EVERYTHING
  // ============================================================

  const refreshInventory = async () => {
    await Promise.all([
      loadReferences(),
      loadProducts(),
    ]);
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="space-y-6">

      {/* ======================================================
          HEADER
      ======================================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Inventory
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage products, stock levels, pricing,
            and inventory status.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={refreshInventory}
            disabled={
              loading ||
              referencesLoading
            }
          >
            <FiRefreshCw className="mr-2" />

            Refresh
          </Button>

          {isShopOwner && (
            <Button onClick={openCreate}>
              <FiPlus className="mr-2" />

              Add Product
            </Button>
          )}
        </div>
      </div>

      {/* ======================================================
          GENERAL ERROR
      ======================================================= */}

      {error && (
        <ErrorMessage
          message={error}
          onClose={() => setError('')}
        />
      )}

      {/* ======================================================
          REFERENCE DATA WARNING
      ======================================================= */}

      {referenceError && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <FiAlertTriangle className="mt-0.5 shrink-0 text-amber-600" />

            <div className="flex-1">
              <h3 className="text-sm font-semibold text-amber-800">
                Category / Supplier information
              </h3>

              <p className="mt-1 text-sm text-amber-700">
                {referenceError}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setReferenceError('')
              }
              className="text-amber-600 hover:text-amber-800"
            >
              <FiX />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================
          STATS
      ======================================================= */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<FiBox />}
          label="Total Products"
          value={stats.total}
        />

        <StatCard
          icon={<FiBox />}
          label="In Stock"
          value={stats.inStock}
        />

        <StatCard
          icon={<FiAlertTriangle />}
          label="Low Stock"
          value={stats.low}
        />

        <StatCard
          icon={<FiXCircle />}
          label="Out of Stock"
          value={stats.out}
        />
      </div>

      {/* ======================================================
          INVENTORY TABLE
      ======================================================= */}

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm">

        {/* FILTERS */}

        <div className="p-4 border-b border-slate-200">
          <div className="flex flex-col lg:flex-row gap-3">

            {/* SEARCH */}

            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search product name or product code..."
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              />
            </div>

            {/* CATEGORY FILTER */}

            <select
              value={categoryId}
              onChange={(e) =>
                setCategoryId(e.target.value)
              }
              disabled={referencesLoading}
              className="px-3 py-2.5 border border-slate-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:cursor-not-allowed"
            >
              <option value="">
                {referencesLoading
                  ? 'Loading categories...'
                  : 'All categories'}
              </option>

              {categories.map(
                (category) => {
                  const id =
                    getId(category);

                  if (!id) {
                    return null;
                  }

                  return (
                    <option
                      key={id}
                      value={id}
                    >
                      {getName(category)}
                    </option>
                  );
                }
              )}
            </select>

            {/* STATUS FILTER */}

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              className="px-3 py-2.5 border border-slate-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">
                All stock status
              </option>

              <option value="in">
                In Stock
              </option>

              <option value="low">
                Low Stock
              </option>

              <option value="out">
                Out of Stock
              </option>
            </select>
          </div>
        </div>

        {/* ====================================================
            LOADING
        ===================================================== */}

        {loading ? (
          <div className="p-12 flex justify-center">
            <Loading />
          </div>
        ) : products.length === 0 ? (
          /* ==================================================
             EMPTY
          =================================================== */

          <div className="p-12 text-center">
            <FiBox className="mx-auto text-4xl text-slate-300" />

            <h3 className="mt-3 font-semibold text-slate-800">
              No products found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try another search/filter or add your
              first product.
            </p>

            {isShopOwner && (
              <Button
                className="mt-5"
                onClick={openCreate}
              >
                <FiPlus className="mr-2" />

                Add Product
              </Button>
            )}
          </div>
        ) : (
          /* ==================================================
             TABLE
          =================================================== */

          <div className="overflow-x-auto">
            <table className="min-w-[1000px] w-full">

              <thead className="bg-slate-50">
                <tr className="text-left text-xs uppercase tracking-wide text-slate-500">

                  <th className="px-5 py-3 font-semibold">
                    Product
                  </th>

                  <th className="px-5 py-3 font-semibold">
                    Category
                  </th>

                  <th className="px-5 py-3 font-semibold">
                    Supplier
                  </th>

                  <th className="px-5 py-3 font-semibold">
                    Quantity
                  </th>

                  <th className="px-5 py-3 font-semibold">
                    Selling Price
                  </th>

                  <th className="px-5 py-3 font-semibold">
                    Status
                  </th>

                  <th className="px-5 py-3 font-semibold text-right">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">

                {products.map(
                  (product) => {
                    const productId =
                      getId(product);

                    return (
                      <tr
                        key={productId}
                        className="hover:bg-slate-50/70"
                      >

                        {/* PRODUCT */}

                        <td className="px-5 py-4">
                          <div className="font-semibold text-slate-900">
                            {product.productName}
                          </div>

                          <div className="text-xs text-slate-500 mt-0.5">
                            {product.productCode}
                          </div>
                        </td>

                        {/* CATEGORY */}

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {getName(
                            product.categoryId
                          )}
                        </td>

                        {/* SUPPLIER */}

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {getName(
                            product.supplierId
                          )}
                        </td>

                        {/* QUANTITY */}

                        <td className="px-5 py-4">
                          <span className="font-bold text-slate-900">
                            {product.quantity}
                          </span>

                          <span className="text-xs text-slate-400 ml-1">
                            / min{' '}
                            {product.minimumStock}
                          </span>
                        </td>

                        {/* PRICE */}

                        <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                          {money(
                            product.sellingPrice
                          )}
                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-4">
                          <StockStatus
                            quantity={
                              product.quantity
                            }
                            minimumStock={
                              product.minimumStock
                            }
                          />
                        </td>

                        {/* ACTIONS */}

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-1">

                            <IconButton
                              title="View details"
                              onClick={() =>
                                navigate(
                                  `/inventory/${productId}`
                                )
                              }
                            >
                              <FiEye />
                            </IconButton>

                            <IconButton
                              title="Edit product"
                              onClick={() =>
                                openEdit(
                                  product
                                )
                              }
                            >
                              <FiEdit2 />
                            </IconButton>

                            {isShopOwner && (
                              <IconButton
                                title="Delete product"
                                danger
                                onClick={() =>
                                  setDeleteTarget(
                                    product
                                  )
                                }
                              >
                                <FiTrash2 />
                              </IconButton>
                            )}

                          </div>
                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>
            </table>
          </div>
        )}

        {/* ====================================================
            FOOTER
        ===================================================== */}

        <div className="px-5 py-3 border-t border-slate-200 text-xs text-slate-500">
          Showing {products.length}{' '}
          product
          {products.length === 1
            ? ''
            : 's'}{' '}
          • {stats.stockUnits} total units
        </div>
      </div>

      {/* ======================================================
          ADD / EDIT PRODUCT MODAL
      ======================================================= */}

      {modal && (
        <Modal
          title={
            modal.type === 'create'
              ? 'Add Product'
              : 'Edit Product'
          }
          onClose={() =>
            !formLoading &&
            setModal(null)
          }
        >
          <ProductForm
            initialValues={
              modal.product
            }
            categories={categories}
            suppliers={suppliers}
            onSubmit={submitProduct}
            onCancel={() =>
              !formLoading &&
              setModal(null)
            }
            isLoading={
              formLoading ||
              referencesLoading
            }
          />
        </Modal>
      )}

      {/* ======================================================
          DELETE CONFIRMATION
      ======================================================= */}

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Product"
        message={
          deleteTarget
            ? `Are you sure you want to remove "${deleteTarget.productName}" from inventory?`
            : ''
        }
        onConfirm={deleteProduct}
        onCancel={() =>
          !formLoading &&
          setDeleteTarget(null)
        }
        isLoading={formLoading}
      />
    </div>
  );
};

// ============================================================
// STAT CARD
// ============================================================

const StatCard = ({
  icon,
  label,
  value,
}) => (
  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
    <div className="flex items-center justify-between">

      <span className="text-sm font-medium text-slate-500">
        {label}
      </span>

      <span className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
        {icon}
      </span>

    </div>

    <div className="mt-3 text-2xl font-bold text-slate-900">
      {value}
    </div>
  </div>
);

// ============================================================
// ICON BUTTON
// ============================================================

const IconButton = ({
  children,
  title,
  onClick,
  danger = false,
}) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    className={`p-2 rounded-lg transition-colors ${
      danger
        ? 'text-red-500 hover:bg-red-50'
        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
    }`}
  >
    {children}
  </button>
);

// ============================================================
// MODAL
// ============================================================

const Modal = ({
  title,
  onClose,
  children,
}) => (
  <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">

    <div className="bg-white w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl">

      <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-slate-200 flex items-center justify-between">

        <h2 className="text-xl font-bold text-slate-900">
          {title}
        </h2>

        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
        >
          <FiX />
        </button>

      </div>

      <div className="p-6">
        {children}
      </div>

    </div>
  </div>
);

export default Inventory;