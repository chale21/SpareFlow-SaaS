import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  FiShoppingCart,
  FiPlus,
  FiSearch,
  FiX,
  FiMoreVertical,
  FiEye,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiPackage,
  FiTruck,
  FiDollarSign,
  FiAlertCircle,
  FiTrash2,
  FiChevronDown,
  FiRefreshCw,
  FiCalendar,
} from 'react-icons/fi';

import api from '../services/api';
import supplierService from '../services/supplierService';
import purchaseService from '../services/purchaseService';


// ============================================================
// HELPERS
// ============================================================

const extractData = (response) => {
  if (!response) return null;

  // Axios response
  if (
    response.data &&
    typeof response.data === 'object' &&
    !Array.isArray(response.data) &&
    Object.prototype.hasOwnProperty.call(
      response.data,
      'data'
    )
  ) {
    return response.data.data;
  }

  // Axios response where data itself is an array
  if (Array.isArray(response.data)) {
    return response.data;
  }

  // Already extracted response
  if (
    Object.prototype.hasOwnProperty.call(
      response,
      'data'
    )
  ) {
    return response.data;
  }

  return response;
};


// ============================================================
// MAIN COMPONENT
// ============================================================

const Purchases = () => {
  // ==========================================================
  // DATA
  // ==========================================================

  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

  // ==========================================================
  // PAGE STATE
  // ==========================================================

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingOptions, setIsLoadingOptions] =
    useState(false);

  const [error, setError] = useState('');
  const [optionsError, setOptionsError] =
    useState('');

  const [searchTerm, setSearchTerm] =
    useState('');

  const [statusFilter, setStatusFilter] =
    useState('ALL');

  const [openMenuId, setOpenMenuId] =
    useState(null);

  // ==========================================================
  // CREATE PURCHASE
  // ==========================================================

  const [isCreateOpen, setIsCreateOpen] =
    useState(false);

  const [isSaving, setIsSaving] =
    useState(false);

  const [formErrors, setFormErrors] =
    useState({});

  const [formData, setFormData] =
    useState({
      supplierId: '',
      notes: '',
      items: [
        {
          productId: '',
          quantity: 1,
          costPrice: '',
        },
      ],
    });

  // ==========================================================
  // VIEW DETAILS
  // ==========================================================

  const [viewingPurchase, setViewingPurchase] =
    useState(null);

  // ==========================================================
  // RECEIVE
  // ==========================================================

  const [purchaseToReceive, setPurchaseToReceive] =
    useState(null);

  const [isReceiving, setIsReceiving] =
    useState(false);

  // ==========================================================
  // NOTIFICATION
  // ==========================================================

  const [notification, setNotification] =
    useState(null);


  // ==========================================================
  // NOTIFICATION
  // ==========================================================

  const showNotification = (
    type,
    message
  ) => {
    setNotification({
      type,
      message,
    });

    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };


  // ==========================================================
  // LOAD PURCHASE HISTORY
  // ==========================================================

  const loadPurchases = async () => {
    try {
      setIsLoading(true);
      setError('');

      const response =
        await purchaseService.getPurchases();

      const data = extractData(response);

      setPurchases(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(
        'Failed to load purchases:',
        err
      );

      setError(
        err?.response?.data?.message ||
          'Unable to load purchase history.'
      );
    } finally {
      setIsLoading(false);
    }
  };


  // ==========================================================
  // LOAD REAL SUPPLIERS
  // ==========================================================

  const loadSuppliers = async () => {
    try {
      const response =
        await supplierService.getSuppliers();

      const data = extractData(response);

      setSuppliers(
        Array.isArray(data)
          ? data
          : []
      );

      console.log(
        'Real suppliers loaded:',
        data
      );
    } catch (err) {
      console.error(
        'Failed to load suppliers:',
        err
      );

      setOptionsError(
        err?.response?.data?.message ||
          'Unable to load suppliers.'
      );

      setSuppliers([]);
    }
  };


  // ==========================================================
  // LOAD REAL PRODUCTS
  //
  // There is no productService in your project yet,
  // so we use api directly.
  // ==========================================================

  const loadProducts = async () => {
    try {
      const response =
        await api.get('/products');

      const data = extractData(response);

      setProducts(
        Array.isArray(data)
          ? data
          : []
      );

      console.log(
        'Real products loaded:',
        data
      );
    } catch (err) {
      console.error(
        'Failed to load products:',
        err
      );

      setOptionsError(
        (previous) =>
          previous ||
          err?.response?.data?.message ||
          'Unable to load products.'
      );

      setProducts([]);
    }
  };


  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    const loadAllData = async () => {
      setIsLoadingOptions(true);

      await Promise.all([
        loadPurchases(),
        loadSuppliers(),
        loadProducts(),
      ]);

      setIsLoadingOptions(false);
    };

    loadAllData();
  }, []);


  // ==========================================================
  // REFRESH EVERYTHING
  // ==========================================================

  const refreshAll = async () => {
    setOptionsError('');
    setError('');
    setIsLoadingOptions(true);

    await Promise.all([
      loadPurchases(),
      loadSuppliers(),
      loadProducts(),
    ]);

    setIsLoadingOptions(false);
  };


  // ==========================================================
  // STATISTICS
  // ==========================================================

  const totalPurchases =
    purchases.length;

  const pendingCount =
    purchases.filter(
      (purchase) =>
        purchase.status === 'PENDING'
    ).length;

  const receivedCount =
    purchases.filter(
      (purchase) =>
        purchase.status === 'RECEIVED'
    ).length;

  const cancelledCount =
    purchases.filter(
      (purchase) =>
        purchase.status === 'CANCELLED'
    ).length;

  const totalPurchaseValue =
    purchases.reduce(
      (total, purchase) =>
        total +
        Number(
          purchase.totalAmount || 0
        ),
      0
    );


  // ==========================================================
  // SEARCH + FILTER
  // ==========================================================

  const filteredPurchases = useMemo(() => {
    const query =
      searchTerm
        .trim()
        .toLowerCase();

    return purchases.filter(
      (purchase) => {
        const supplierName =
          purchase.supplierId
            ?.supplierName ||
          '';

        const id =
          purchase._id ||
          purchase.id ||
          '';

        const matchesSearch =
          !query ||
          supplierName
            .toLowerCase()
            .includes(query) ||
          id
            .toString()
            .toLowerCase()
            .includes(query);

        const matchesStatus =
          statusFilter === 'ALL' ||
          purchase.status ===
            statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );
  }, [
    purchases,
    searchTerm,
    statusFilter,
  ]);


  // ==========================================================
  // FORMATTERS
  // ==========================================================

  const formatCurrency = (value) => {
    return new Intl.NumberFormat(
      'en-US',
      {
        style: 'currency',
        currency: 'ETB',
        maximumFractionDigits: 2,
      }
    ).format(
      Number(value || 0)
    );
  };


  const formatDate = (date) => {
    if (!date) return '—';

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return '—';
    }

    return parsedDate.toLocaleDateString(
      'en-US',
      {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }
    );
  };


  const shortId = (id) => {
    if (!id) return '—';

    const value =
      id.toString();

    return `PUR-${value
      .slice(-6)
      .toUpperCase()}`;
  };


  // ==========================================================
  // STATUS BADGE
  // ==========================================================

  const StatusBadge = ({
    status,
  }) => {
    if (
      status === 'RECEIVED'
    ) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
          <FiCheckCircle
            size={13}
          />
          Received
        </span>
      );
    }

    if (
      status === 'CANCELLED'
    ) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
          <FiXCircle
            size={13}
          />
          Cancelled
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
        <FiClock
          size={13}
        />
        Pending
      </span>
    );
  };


  // ==========================================================
  // RESET FORM
  // ==========================================================

  const resetForm = () => {
    setFormData({
      supplierId: '',
      notes: '',
      items: [
        {
          productId: '',
          quantity: 1,
          costPrice: '',
        },
      ],
    });

    setFormErrors({});
  };


  const openCreateModal = async () => {
    resetForm();
    setOptionsError('');

    /*
     * Reload real suppliers/products when opening the modal.
     * This ensures newly registered records appear.
     */
    setIsLoadingOptions(true);

    await Promise.all([
      loadSuppliers(),
      loadProducts(),
    ]);

    setIsLoadingOptions(false);
    setIsCreateOpen(true);
  };


  const closeCreateModal = () => {
    if (isSaving) return;

    setIsCreateOpen(false);
    resetForm();
  };


  // ==========================================================
  // GENERAL FORM CHANGE
  // ==========================================================

  const handleFormChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );

    if (formErrors[name]) {
      setFormErrors(
        (previous) => ({
          ...previous,
          [name]: '',
        })
      );
    }
  };


  // ==========================================================
  // PRODUCT HELPERS
  // ==========================================================

  const getProductName = (
    product
  ) => {
    return (
      product.productName ||
      product.name ||
      'Unnamed Product'
    );
  };


  const getProductCode = (
    product
  ) => {
    return (
      product.productCode ||
      product.SKU ||
      product.sku ||
      ''
    );
  };


  const getProductPurchasePrice = (
    product
  ) => {
    return (
      product.purchasePrice ??
      product.costPrice ??
      product.cost ??
      ''
    );
  };


  // ==========================================================
  // ITEM CHANGE
  // ==========================================================

  const handleItemChange = (
    index,
    field,
    value
  ) => {
    setFormData(
      (previous) => {
        const items = [
          ...previous.items,
        ];

        const currentItem = {
          ...items[index],
          [field]: value,
        };

        /*
         * When selecting a real product,
         * automatically use its current purchase price.
         */
        if (
          field === 'productId'
        ) {
          const product =
            products.find(
              (item) =>
                item._id === value
            );

          currentItem.costPrice =
            product
              ? getProductPurchasePrice(
                  product
                )
              : '';
        }

        items[index] =
          currentItem;

        return {
          ...previous,
          items,
        };
      }
    );

    setFormErrors(
      (previous) => ({
        ...previous,
        items: '',
      })
    );
  };


  // ==========================================================
  // ADD ITEM
  // ==========================================================

  const addPurchaseItem = () => {
    setFormData(
      (previous) => ({
        ...previous,
        items: [
          ...previous.items,
          {
            productId: '',
            quantity: 1,
            costPrice: '',
          },
        ],
      })
    );
  };


  // ==========================================================
  // REMOVE ITEM
  // ==========================================================

  const removePurchaseItem = (
    index
  ) => {
    setFormData(
      (previous) => {
        if (
          previous.items.length ===
          1
        ) {
          return previous;
        }

        return {
          ...previous,
          items:
            previous.items.filter(
              (_, itemIndex) =>
                itemIndex !== index
            ),
        };
      }
    );
  };


  // ==========================================================
  // AVAILABLE PRODUCTS
  // ==========================================================

  const availableProductsForRow = (
    rowIndex
  ) => {
    const selectedIds =
      formData.items
        .filter(
          (_, index) =>
            index !== rowIndex
        )
        .map(
          (item) =>
            item.productId
        )
        .filter(Boolean);

    return products.filter(
      (product) => {
        const isActive =
          product.isActive !==
          false;

        const notAlreadySelected =
          !selectedIds.includes(
            product._id
          );

        return (
          isActive &&
          notAlreadySelected
        );
      }
    );
  };


  // ==========================================================
  // TOTALS
  // ==========================================================

  const calculateLineTotal = (
    item
  ) => {
    return (
      Number(
        item.quantity || 0
      ) *
      Number(
        item.costPrice || 0
      )
    );
  };


  const formTotal = useMemo(() => {
    return formData.items.reduce(
      (
        total,
        item
      ) =>
        total +
        calculateLineTotal(
          item
        ),
      0
    );
  }, [
    formData.items,
  ]);


  // ==========================================================
  // VALIDATE PURCHASE
  // ==========================================================

  const validatePurchaseForm = () => {
    const errors = {};

    if (
      !formData.supplierId
    ) {
      errors.supplierId =
        'Please select a supplier.';
    }

    if (
      !formData.items.length
    ) {
      errors.items =
        'At least one item is required.';
    }

    const selectedProducts =
      new Set();

    formData.items.forEach(
      (
        item,
        index
      ) => {
        if (
          !item.productId
        ) {
          errors.items =
            `Please select a product for item ${
              index + 1
            }.`;

          return;
        }

        if (
          selectedProducts.has(
            item.productId
          )
        ) {
          errors.items =
            'A product may appear only once per purchase.';
        }

        selectedProducts.add(
          item.productId
        );

        const quantity =
          Number(
            item.quantity
          );

        if (
          !Number.isInteger(
            quantity
          ) ||
          quantity < 1
        ) {
          errors.items =
            `Item ${
              index + 1
            } must have a quantity of at least 1.`;
        }

        const cost =
          Number(
            item.costPrice
          );

        if (
          item.costPrice ===
            '' ||
          Number.isNaN(cost) ||
          cost < 0
        ) {
          errors.items =
            `Item ${
              index + 1
            } must have a valid cost price.`;
        }
      }
    );

    if (
      formData.notes.length >
      500
    ) {
      errors.notes =
        'Notes cannot exceed 500 characters.';
    }

    setFormErrors(errors);

    return (
      Object.keys(errors)
        .length === 0
    );
  };


  // ==========================================================
  // CREATE PURCHASE
  // ==========================================================

  const handleCreatePurchase =
    async (event) => {
      event.preventDefault();

      if (
        !validatePurchaseForm()
      ) {
        return;
      }

      try {
        setIsSaving(true);

        const payload = {
          supplierId:
            formData.supplierId,

          items:
            formData.items.map(
              (item) => ({
                productId:
                  item.productId,

                quantity:
                  Number(
                    item.quantity
                  ),

                costPrice:
                  Number(
                    item.costPrice
                  ),
              })
            ),

          notes:
            formData.notes.trim(),
        };

        console.log(
          'Creating purchase:',
          payload
        );

        await purchaseService.createPurchase(
          payload
        );

        showNotification(
          'success',
          'Purchase created successfully.'
        );

        setIsCreateOpen(false);
        resetForm();

        await loadPurchases();
      } catch (err) {
        console.error(
          'Create purchase error:',
          err
        );

        const message =
          err?.response?.data
            ?.message ||
          'Failed to create purchase.';

        showNotification(
          'error',
          message
        );
      } finally {
        setIsSaving(false);
      }
    };


  // ==========================================================
  // RECEIVE PURCHASE
  // ==========================================================

  const openReceiveModal = (
    purchase
  ) => {
    setPurchaseToReceive(
      purchase
    );

    setOpenMenuId(null);
  };


  const confirmReceive =
    async () => {
      if (
        !purchaseToReceive
      ) {
        return;
      }

      const id =
        purchaseToReceive._id ||
        purchaseToReceive.id;

      if (!id) {
        showNotification(
          'error',
          'Purchase ID is missing.'
        );

        return;
      }

      try {
        setIsReceiving(true);

        await purchaseService.receivePurchase(
          id
        );

        showNotification(
          'success',
          'Purchase received and inventory updated successfully.'
        );

        setPurchaseToReceive(
          null
        );

        setViewingPurchase(
          null
        );

        await loadPurchases();
      } catch (err) {
        console.error(
          'Receive purchase error:',
          err
        );

        showNotification(
          'error',
          err?.response?.data
            ?.message ||
            'Failed to receive purchase.'
        );
      } finally {
        setIsReceiving(false);
      }
    };


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div
      className="min-h-screen bg-slate-50"
      onClick={() => {
        if (openMenuId) {
          setOpenMenuId(null);
        }
      }}
    >

      {/* ======================================================
          NOTIFICATION
      ====================================================== */}

      {notification && (
        <div className="fixed right-4 top-4 z-[120] max-w-sm">
          <div
            className={`flex items-start gap-3 rounded-xl border bg-white px-4 py-3 shadow-xl ${
              notification.type ===
              'success'
                ? 'border-emerald-200'
                : 'border-red-200'
            }`}
          >
            {notification.type ===
            'success' ? (
              <FiCheckCircle
                className="mt-0.5 shrink-0 text-emerald-600"
                size={18}
              />
            ) : (
              <FiAlertCircle
                className="mt-0.5 shrink-0 text-red-600"
                size={18}
              />
            )}

            <p
              className={`text-sm font-medium ${
                notification.type ===
                'success'
                  ? 'text-emerald-700'
                  : 'text-red-700'
              }`}
            >
              {
                notification.message
              }
            </p>

            <button
              type="button"
              onClick={() =>
                setNotification(null)
              }
              className="ml-auto text-slate-400 hover:text-slate-700"
            >
              <FiX size={16} />
            </button>
          </div>
        </div>
      )}


      {/* ======================================================
          PAGE
      ====================================================== */}

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-600">
              <FiShoppingCart
                size={16}
              />

              Purchasing
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Purchase Management
            </h1>

            <p className="mt-1 text-sm text-slate-500 sm:text-base">
              Record supplier
              purchases and receive
              stock into inventory.
            </p>
          </div>

          <button
            type="button"
            onClick={
              openCreateModal
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <FiPlus size={18} />

            New Purchase
          </button>
        </div>


        {/* ====================================================
            STATS
        ==================================================== */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            title="Total Purchases"
            value={
              totalPurchases
            }
            subtitle="Recorded purchases"
            icon={
              <FiShoppingCart />
            }
            iconClass="bg-blue-50 text-blue-600"
          />

          <StatCard
            title="Pending"
            value={
              pendingCount
            }
            subtitle="Waiting to be received"
            icon={
              <FiClock />
            }
            iconClass="bg-amber-50 text-amber-600"
          />

          <StatCard
            title="Received"
            value={
              receivedCount
            }
            subtitle="Stock already updated"
            icon={
              <FiCheckCircle />
            }
            iconClass="bg-emerald-50 text-emerald-600"
          />

          <StatCard
            title="Purchase Value"
            value={formatCurrency(
              totalPurchaseValue
            )}
            subtitle={`${cancelledCount} cancelled`}
            icon={
              <FiDollarSign />
            }
            iconClass="bg-violet-50 text-violet-600"
            compact
          />

        </div>


        {/* ====================================================
            OPTIONS ERROR
        ==================================================== */}

        {optionsError && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <FiAlertCircle
              className="mt-0.5 shrink-0 text-amber-600"
              size={18}
            />

            <div>
              <p className="text-sm font-semibold text-amber-800">
                Supplier or product data could not be loaded
              </p>

              <p className="mt-1 text-sm text-amber-700">
                {optionsError}
              </p>
            </div>

            <button
              type="button"
              onClick={
                refreshAll
              }
              className="ml-auto shrink-0 rounded-lg border border-amber-300 px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100"
            >
              Retry
            </button>
          </div>
        )}


        {/* ====================================================
            PURCHASE HISTORY
        ==================================================== */}

        <div className="overflow-visible rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* TOOLBAR */}

          <div className="rounded-t-2xl border-b border-slate-200 bg-white px-4 py-4 sm:px-5">

            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

              <div>
                <h2 className="font-bold text-slate-900">
                  Purchase History
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Review purchases
                  and receive pending
                  inventory.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">

                {/* SEARCH */}

                <div className="relative w-full sm:w-72">
                  <FiSearch
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={17}
                  />

                  <input
                    value={
                      searchTerm
                    }
                    onChange={(
                      event
                    ) =>
                      setSearchTerm(
                        event.target.value
                      )
                    }
                    placeholder="Search supplier or purchase ID..."
                    className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-10 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />

                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() =>
                        setSearchTerm(
                          ''
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      <FiX
                        size={16}
                      />
                    </button>
                  )}
                </div>


                {/* STATUS */}

                <div className="relative">
                  <select
                    value={
                      statusFilter
                    }
                    onChange={(
                      event
                    ) =>
                      setStatusFilter(
                        event.target.value
                      )
                    }
                    className="w-full appearance-none rounded-xl border border-slate-300 bg-white py-2.5 pl-4 pr-9 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 sm:w-40"
                  >
                    <option value="ALL">
                      All Status
                    </option>

                    <option value="PENDING">
                      Pending
                    </option>

                    <option value="RECEIVED">
                      Received
                    </option>

                    <option value="CANCELLED">
                      Cancelled
                    </option>
                  </select>

                  <FiChevronDown
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={15}
                  />
                </div>


                {/* REFRESH */}

                <button
                  type="button"
                  onClick={
                    refreshAll
                  }
                  disabled={
                    isLoadingOptions
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  <FiRefreshCw
                    size={16}
                    className={
                      isLoadingOptions
                        ? 'animate-spin'
                        : ''
                    }
                  />

                  <span className="sm:hidden">
                    Refresh
                  </span>
                </button>

              </div>
            </div>
          </div>


          {/* LOADING */}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">

              <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

              <p className="mt-4 text-sm text-slate-500">
                Loading purchase history...
              </p>

            </div>
          ) : error ? (

            /* ERROR */

            <div className="px-6 py-16 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
                <FiAlertCircle
                  size={24}
                />
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                Unable to load
                purchases
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {error}
              </p>

              <button
                type="button"
                onClick={
                  loadPurchases
                }
                className="mt-5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Try Again
              </button>

            </div>
          ) : filteredPurchases.length === 0 ? (

            /* EMPTY */

            <div className="px-6 py-16 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <FiShoppingCart
                  size={24}
                />
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                No purchases found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {searchTerm ||
                statusFilter !==
                  'ALL'
                  ? 'Try changing your search or filter.'
                  : 'Create your first purchase to begin.'}
              </p>

              {!searchTerm &&
                statusFilter ===
                  'ALL' && (
                  <button
                    type="button"
                    onClick={
                      openCreateModal
                    }
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    <FiPlus
                      size={16}
                    />
                    New Purchase
                  </button>
                )}

            </div>
          ) : (

            <>
              {/* ==================================================
                  DESKTOP TABLE
              ================================================== */}

              <div className="hidden overflow-x-auto md:block">

                <table className="w-full min-w-[900px]">

                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">

                      <TableHead>
                        Purchase
                      </TableHead>

                      <TableHead>
                        Supplier
                      </TableHead>

                      <TableHead>
                        Items
                      </TableHead>

                      <TableHead>
                        Amount
                      </TableHead>

                      <TableHead>
                        Date
                      </TableHead>

                      <TableHead>
                        Status
                      </TableHead>

                      <TableHead align="right">
                        Actions
                      </TableHead>

                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">

                    {filteredPurchases.map(
                      (
                        purchase
                      ) => {

                        const id =
                          purchase._id ||
                          purchase.id;

                        return (
                          <tr
                            key={id}
                            className="hover:bg-slate-50"
                          >

                            <td className="px-5 py-4">

                              <p className="font-semibold text-slate-900">
                                {shortId(
                                  id
                                )}
                              </p>

                              <p className="mt-0.5 text-xs text-slate-400">
                                {purchase.items?.length ||
                                  0}{' '}
                                line items
                              </p>

                            </td>


                            <td className="px-5 py-4">

                              <div className="flex items-center gap-2">

                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                  <FiTruck
                                    size={15}
                                  />
                                </div>

                                <span className="text-sm font-medium text-slate-700">
                                  {purchase
                                    .supplierId
                                    ?.supplierName ||
                                    'Unknown supplier'}
                                </span>

                              </div>

                            </td>


                            <td className="px-5 py-4">

                              <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-sm font-semibold text-slate-700">

                                <FiPackage
                                  size={14}
                                />

                                {purchase.items?.reduce(
                                  (
                                    total,
                                    item
                                  ) =>
                                    total +
                                    Number(
                                      item.quantity ||
                                        0
                                    ),
                                  0
                                ) || 0}

                              </span>

                            </td>


                            <td className="px-5 py-4">

                              <p className="text-sm font-semibold text-slate-900">
                                {formatCurrency(
                                  purchase.totalAmount
                                )}
                              </p>

                            </td>


                            <td className="px-5 py-4">

                              <div className="flex items-center gap-1.5 text-sm text-slate-500">

                                <FiCalendar
                                  size={14}
                                />

                                {formatDate(
                                  purchase.purchaseDate ||
                                  purchase.createdAt
                                )}

                              </div>

                            </td>


                            <td className="px-5 py-4">

                              <StatusBadge
                                status={
                                  purchase.status
                                }
                              />

                            </td>


                            <td className="relative px-5 py-4">

                              <div
                                className="flex justify-end"
                                onClick={(
                                  event
                                ) =>
                                  event.stopPropagation()
                                }
                              >

                                <button
                                  type="button"
                                  onClick={() =>
                                    setOpenMenuId(
                                      openMenuId ===
                                        id
                                        ? null
                                        : id
                                    )
                                  }
                                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                                >
                                  <FiMoreVertical
                                    size={18}
                                  />
                                </button>


                                {openMenuId ===
                                  id && (

                                  <div className="absolute right-5 top-12 z-50 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl">

                                    <button
                                      type="button"
                                      onClick={() => {
                                        setViewingPurchase(
                                          purchase
                                        );

                                        setOpenMenuId(
                                          null
                                        );
                                      }}
                                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50"
                                    >
                                      <FiEye
                                        size={16}
                                      />

                                      View
                                      Details
                                    </button>


                                    {purchase.status ===
                                      'PENDING' && (
                                      <>
                                        <div className="my-1 border-t border-slate-100" />

                                        <button
                                          type="button"
                                          onClick={() =>
                                            openReceiveModal(
                                              purchase
                                            )
                                          }
                                          className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-emerald-700 hover:bg-emerald-50"
                                        >
                                          <FiCheckCircle
                                            size={16}
                                          />

                                          Receive
                                          Purchase
                                        </button>
                                      </>
                                    )}

                                  </div>
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


              {/* ==================================================
                  MOBILE
              ================================================== */}

              <div className="divide-y divide-slate-100 md:hidden">

                {filteredPurchases.map(
                  (
                    purchase
                  ) => {

                    const id =
                      purchase._id ||
                      purchase.id;

                    return (
                      <div
                        key={id}
                        className="p-4"
                      >

                        <div className="flex items-start justify-between gap-3">

                          <div>

                            <p className="font-semibold text-slate-900">
                              {shortId(
                                id
                              )}
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                              {purchase
                                .supplierId
                                ?.supplierName ||
                                'Unknown supplier'}
                            </p>

                          </div>


                          <div
                            className="relative"
                            onClick={(
                              event
                            ) =>
                              event.stopPropagation()
                            }
                          >

                            <button
                              type="button"
                              onClick={() =>
                                setOpenMenuId(
                                  openMenuId ===
                                    id
                                    ? null
                                    : id
                                )
                              }
                              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                            >
                              <FiMoreVertical
                                size={18}
                              />
                            </button>


                            {openMenuId ===
                              id && (

                              <div className="absolute right-0 top-10 z-50 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl">

                                <button
                                  type="button"
                                  onClick={() => {
                                    setViewingPurchase(
                                      purchase
                                    );

                                    setOpenMenuId(
                                      null
                                    );
                                  }}
                                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                                >
                                  <FiEye
                                    size={16}
                                  />

                                  View
                                  Details
                                </button>


                                {purchase.status ===
                                  'PENDING' && (

                                  <button
                                    type="button"
                                    onClick={() =>
                                      openReceiveModal(
                                        purchase
                                      )
                                    }
                                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
                                  >
                                    <FiCheckCircle
                                      size={16}
                                    />

                                    Receive
                                  </button>

                                )}

                              </div>
                            )}

                          </div>

                        </div>


                        <div className="mt-4 grid grid-cols-2 gap-3">

                          <MobileInfo
                            label="Items"
                            value={
                              purchase.items?.reduce(
                                (
                                  total,
                                  item
                                ) =>
                                  total +
                                  Number(
                                    item.quantity ||
                                      0
                                  ),
                                0
                              ) || 0
                            }
                          />

                          <MobileInfo
                            label="Amount"
                            value={formatCurrency(
                              purchase.totalAmount
                            )}
                          />

                        </div>


                        <div className="mt-4 flex items-center justify-between">

                          <StatusBadge
                            status={
                              purchase.status
                            }
                          />

                          <span className="text-xs text-slate-400">
                            {formatDate(
                              purchase.purchaseDate ||
                              purchase.createdAt
                            )}
                          </span>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>


              {/* FOOTER */}

              <div className="rounded-b-2xl border-t border-slate-200 bg-slate-50 px-5 py-4">

                <p className="text-sm text-slate-500">

                  Showing{' '}

                  <strong className="text-slate-700">
                    {
                      filteredPurchases.length
                    }
                  </strong>{' '}

                  of{' '}

                  <strong className="text-slate-700">
                    {
                      purchases.length
                    }
                  </strong>{' '}

                  purchases

                </p>

              </div>

            </>
          )}

        </div>

      </div>


      {/* ======================================================
          CREATE PURCHASE MODAL
      ====================================================== */}

      {isCreateOpen && (

        <div className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-slate-950/50 px-4 py-6 backdrop-blur-sm">

          <div className="my-auto w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* HEADER */}

            <div className="flex items-start justify-between border-b border-slate-200 px-5 py-5 sm:px-6">

              <div>

                <h2 className="text-lg font-bold text-slate-900">
                  New Purchase
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Record products
                  ordered from a
                  supplier.
                </p>

              </div>

              <button
                type="button"
                onClick={
                  closeCreateModal
                }
                disabled={
                  isSaving
                }
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <FiX size={20} />
              </button>

            </div>


            <form
              onSubmit={
                handleCreatePurchase
              }
            >

              <div className="max-h-[70vh] overflow-y-auto p-5 sm:p-6">

                {/* ==================================================
                    REAL SUPPLIER
                ================================================== */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">

                    Supplier

                    <span className="ml-1 text-red-500">
                      *
                    </span>

                  </label>


                  <div className="relative">

                    <select
                      name="supplierId"
                      value={
                        formData.supplierId
                      }
                      onChange={
                        handleFormChange
                      }
                      disabled={
                        isLoadingOptions
                      }
                      className={`w-full appearance-none rounded-xl border bg-white px-4 py-3 pr-10 text-sm outline-none ${
                        formErrors.supplierId
                          ? 'border-red-400'
                          : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                      }`}
                    >

                      <option value="">
                        {isLoadingOptions
                          ? 'Loading suppliers...'
                          : suppliers.length ===
                            0
                          ? 'No suppliers found'
                          : 'Select supplier'}
                      </option>


                      {suppliers
                        .filter(
                          (
                            supplier
                          ) =>
                            supplier.isActive !==
                            false
                        )
                        .map(
                          (
                            supplier
                          ) => (

                            <option
                              key={
                                supplier._id
                              }
                              value={
                                supplier._id
                              }
                            >
                              {
                                supplier.supplierName
                              }
                            </option>

                          )
                        )}

                    </select>


                    <FiChevronDown
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={16}
                    />

                  </div>


                  {formErrors.supplierId && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {
                        formErrors.supplierId
                      }
                    </p>
                  )}

                </div>


                {/* ==================================================
                    PURCHASE ITEMS
                ================================================== */}

                <div className="mt-6">

                  <div className="mb-3 flex items-center justify-between gap-4">

                    <div>

                      <h3 className="font-semibold text-slate-900">
                        Purchase Items
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        Select products from your inventory.
                      </p>

                    </div>


                    <button
                      type="button"
                      onClick={
                        addPurchaseItem
                      }
                      disabled={
                        products.length ===
                        0
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >

                      <FiPlus
                        size={15}
                      />

                      Add Item

                    </button>

                  </div>


                  {formErrors.items && (

                    <div className="mb-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">

                      <FiAlertCircle
                        className="mt-0.5 shrink-0"
                        size={16}
                      />

                      {
                        formErrors.items
                      }

                    </div>

                  )}


                  {products.length ===
                    0 && (
                    <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4">

                      <p className="text-sm font-semibold text-amber-800">
                        No products found
                      </p>

                      <p className="mt-1 text-xs text-amber-700">
                        Create an active product first before creating a purchase.
                      </p>

                    </div>
                  )}


                  <div className="space-y-3">

                    {formData.items.map(
                      (
                        item,
                        index
                      ) => (

                        <div
                          key={
                            index
                          }
                          className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                        >

                          <div className="mb-3 flex items-center justify-between">

                            <p className="text-sm font-semibold text-slate-700">
                              Item{' '}
                              {index +
                                1}
                            </p>


                            <button
                              type="button"
                              disabled={
                                formData
                                  .items
                                  .length ===
                                1
                              }
                              onClick={() =>
                                removePurchaseItem(
                                  index
                                )
                              }
                              className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                            >

                              <FiTrash2
                                size={15}
                              />

                            </button>

                          </div>


                          <div className="grid grid-cols-1 gap-3 md:grid-cols-12">

                            {/* PRODUCT */}

                            <div className="md:col-span-5">

                              <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                                Product
                              </label>


                              <select
                                value={
                                  item.productId
                                }
                                onChange={(
                                  event
                                ) =>
                                  handleItemChange(
                                    index,
                                    'productId',
                                    event.target.value
                                  )
                                }
                                disabled={
                                  products.length ===
                                  0
                                }
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 disabled:bg-slate-100"
                              >

                                <option value="">
                                  {products.length ===
                                  0
                                    ? 'No products available'
                                    : 'Select product'}
                                </option>


                                {availableProductsForRow(
                                  index
                                ).map(
                                  (
                                    product
                                  ) => (

                                    <option
                                      key={
                                        product._id
                                      }
                                      value={
                                        product._id
                                      }
                                    >
                                      {
                                        getProductName(
                                          product
                                        )
                                      }

                                      {getProductCode(
                                        product
                                      ) && (
                                        <>
                                          {' '}
                                          —{' '}
                                          {
                                            getProductCode(
                                              product
                                            )
                                          }
                                        </>
                                      )}

                                    </option>

                                  )
                                )}

                              </select>

                            </div>


                            {/* QUANTITY */}

                            <div className="md:col-span-2">

                              <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                                Quantity
                              </label>

                              <input
                                type="number"
                                min="1"
                                step="1"
                                value={
                                  item.quantity
                                }
                                onChange={(
                                  event
                                ) =>
                                  handleItemChange(
                                    index,
                                    'quantity',
                                    event.target.value
                                  )
                                }
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                              />

                            </div>


                            {/* COST */}

                            <div className="md:col-span-2">

                              <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                                Cost Price
                              </label>

                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={
                                  item.costPrice
                                }
                                onChange={(
                                  event
                                ) =>
                                  handleItemChange(
                                    index,
                                    'costPrice',
                                    event.target.value
                                  )
                                }
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                              />

                            </div>


                            {/* TOTAL */}

                            <div className="md:col-span-3">

                              <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                                Line Total
                              </label>

                              <div className="flex h-[42px] items-center rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800">
                                {formatCurrency(
                                  calculateLineTotal(
                                    item
                                  )
                                )}
                              </div>

                            </div>

                          </div>

                        </div>

                      )
                    )}

                  </div>

                </div>


                {/* ==================================================
                    NOTES
                ================================================== */}

                <div className="mt-6">

                  <div className="mb-2 flex items-center justify-between">

                    <label className="text-sm font-semibold text-slate-700">
                      Notes
                    </label>

                    <span className="text-xs text-slate-400">
                      {
                        formData.notes.length
                      }
                      /500
                    </span>

                  </div>


                  <textarea
                    name="notes"
                    rows={3}
                    maxLength={500}
                    value={
                      formData.notes
                    }
                    onChange={
                      handleFormChange
                    }
                    placeholder="Optional purchase notes..."
                    className={`w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none ${
                      formErrors.notes
                        ? 'border-red-400'
                        : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    }`}
                  />


                  {formErrors.notes && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {
                        formErrors.notes
                      }
                    </p>
                  )}

                </div>


                {/* ==================================================
                    TOTAL
                ================================================== */}

                <div className="mt-6 flex justify-end">

                  <div className="w-full rounded-xl border border-blue-100 bg-blue-50 p-4 sm:max-w-sm">

                    <div className="flex items-center justify-between">

                      <span className="text-sm font-medium text-blue-700">
                        Purchase Total
                      </span>

                      <span className="text-xl font-bold text-blue-900">
                        {formatCurrency(
                          formTotal
                        )}
                      </span>

                    </div>

                    <p className="mt-1 text-xs text-blue-600">
                      The backend calculates the final total.
                    </p>

                  </div>

                </div>

              </div>


              {/* FOOTER */}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-6">

                <button
                  type="button"
                  disabled={
                    isSaving
                  }
                  onClick={
                    closeCreateModal
                  }
                  className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  disabled={
                    isSaving ||
                    suppliers.length ===
                      0 ||
                    products.length ===
                      0
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {isSaving && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  )}

                  Create Purchase

                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* ======================================================
          VIEW PURCHASE DETAILS
      ====================================================== */}

      {viewingPurchase && (

        <div className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-slate-950/50 px-4 py-6 backdrop-blur-sm">

          <div className="my-auto w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* HEADER */}

            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">

              <div>

                <div className="flex flex-wrap items-center gap-2">

                  <h2 className="text-lg font-bold text-slate-900">
                    {shortId(
                      viewingPurchase._id ||
                      viewingPurchase.id
                    )}
                  </h2>

                  <StatusBadge
                    status={
                      viewingPurchase.status
                    }
                  />

                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Purchase details
                </p>

              </div>


              <button
                type="button"
                onClick={() =>
                  setViewingPurchase(
                    null
                  )
                }
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <FiX size={20} />
              </button>

            </div>


            <div className="p-6">

              {/* OVERVIEW */}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

                <DetailCard
                  title="Supplier"
                  value={
                    viewingPurchase
                      .supplierId
                      ?.supplierName ||
                    'Unknown'
                  }
                  icon={
                    <FiTruck />
                  }
                />

                <DetailCard
                  title="Purchase Date"
                  value={formatDate(
                    viewingPurchase.purchaseDate ||
                    viewingPurchase.createdAt
                  )}
                  icon={
                    <FiCalendar />
                  }
                />

                <DetailCard
                  title="Total"
                  value={formatCurrency(
                    viewingPurchase.totalAmount
                  )}
                  icon={
                    <FiDollarSign />
                  }
                />

              </div>


              {/* ITEMS */}

              <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">

                <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">

                  <h3 className="text-sm font-semibold text-slate-800">
                    Purchase Items
                  </h3>

                </div>


                <div className="overflow-x-auto">

                  <table className="w-full min-w-[620px]">

                    <thead>

                      <tr className="border-b border-slate-100">

                        <TableHead>
                          Product
                        </TableHead>

                        <TableHead>
                          Quantity
                        </TableHead>

                        <TableHead>
                          Cost
                        </TableHead>

                        <TableHead align="right">
                          Total
                        </TableHead>

                      </tr>

                    </thead>


                    <tbody className="divide-y divide-slate-100">

                      {viewingPurchase.items?.map(
                        (
                          item,
                          index
                        ) => (

                          <tr
                            key={
                              index
                            }
                          >

                            <td className="px-4 py-3">

                              <p className="text-sm font-medium text-slate-800">
                                {item
                                  .productId
                                  ?.productName ||
                                  item
                                    .productId
                                    ?.name ||
                                  'Product'}
                              </p>

                              <p className="mt-0.5 text-xs text-slate-400">
                                {item
                                  .productId
                                  ?.productCode ||
                                  item
                                    .productId
                                    ?.SKU ||
                                  ''}
                              </p>

                            </td>


                            <td className="px-4 py-3 text-sm text-slate-600">
                              {
                                item.quantity
                              }
                            </td>


                            <td className="px-4 py-3 text-sm text-slate-600">
                              {formatCurrency(
                                item.costPrice
                              )}
                            </td>


                            <td className="px-4 py-3 text-right text-sm font-semibold text-slate-800">
                              {formatCurrency(
                                item.lineTotal ??
                                Number(
                                  item.quantity ||
                                    0
                                ) *
                                Number(
                                  item.costPrice ||
                                    0
                                )
                              )}
                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>


                <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-4 py-4">

                  <div className="text-right">

                    <p className="text-xs text-slate-500">
                      Grand Total
                    </p>

                    <p className="mt-1 text-xl font-bold text-slate-900">
                      {formatCurrency(
                        viewingPurchase.totalAmount
                      )}
                    </p>

                  </div>

                </div>

              </div>


              {/* NOTES */}

              <div className="mt-6">

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Notes
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {viewingPurchase.notes ||
                    'No notes provided.'}
                </p>

              </div>


              {/* RECEIVED */}

              {viewingPurchase.receivedAt && (

                <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">

                  <p className="flex items-center gap-2 text-sm font-semibold text-emerald-800">

                    <FiCheckCircle
                      size={16}
                    />

                    Received{' '}
                    {formatDate(
                      viewingPurchase.receivedAt
                    )}

                  </p>

                </div>

              )}


              {/* ACTIONS */}

              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={() =>
                    setViewingPurchase(
                      null
                    )
                  }
                  className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Close
                </button>


                {viewingPurchase.status ===
                  'PENDING' && (

                  <button
                    type="button"
                    onClick={() => {

                      const selected =
                        viewingPurchase;

                      setViewingPurchase(
                        null
                      );

                      openReceiveModal(
                        selected
                      );

                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                  >

                    <FiCheckCircle
                      size={16}
                    />

                    Receive Purchase

                  </button>

                )}

              </div>

            </div>

          </div>

        </div>

      )}


      {/* ======================================================
          RECEIVE CONFIRMATION
      ====================================================== */}

      {purchaseToReceive && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <FiPackage
                size={23}
              />
            </div>


            <h2 className="mt-4 text-lg font-bold text-slate-900">
              Receive Purchase?
            </h2>


            <p className="mt-2 text-sm leading-6 text-slate-500">

              Receiving{' '}

              <strong className="text-slate-700">
                {shortId(
                  purchaseToReceive._id ||
                  purchaseToReceive.id
                )}
              </strong>{' '}

              will increase
              product stock and
              create stock
              movement records.

            </p>


            <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm leading-5 text-blue-800">

              This operation can only
              be performed while the
              purchase is{' '}

              <strong>
                PENDING
              </strong>.

            </div>


            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

              <button
                type="button"
                disabled={
                  isReceiving
                }
                onClick={() =>
                  setPurchaseToReceive(
                    null
                  )
                }
                className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>


              <button
                type="button"
                disabled={
                  isReceiving
                }
                onClick={
                  confirmReceive
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
              >

                {isReceiving ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                ) : (
                  <FiCheckCircle
                    size={16}
                  />
                )}

                Confirm Receive

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};


// ============================================================
// REUSABLE COMPONENTS
// ============================================================

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  iconClass,
  compact = false,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between gap-3">

        <div className="min-w-0">

          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p
            className={`mt-2 truncate font-bold text-slate-900 ${
              compact
                ? 'text-xl'
                : 'text-3xl'
            }`}
          >
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {subtitle}
          </p>

        </div>


        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          {React.cloneElement(
            icon,
            {
              size: 22,
            }
          )}
        </div>

      </div>

    </div>
  );
};


const TableHead = ({
  children,
  align = 'left',
}) => {
  return (
    <th
      className={`px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500 ${
        align === 'right'
          ? 'text-right'
          : 'text-left'
      }`}
    >
      {children}
    </th>
  );
};


const MobileInfo = ({
  label,
  value,
}) => {
  return (
    <div className="rounded-xl bg-slate-50 p-3">

      <p className="text-xs text-slate-400">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-semibold text-slate-700">
        {value}
      </p>

    </div>
  );
};


const DetailCard = ({
  title,
  value,
  icon,
}) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

      <div className="flex items-center gap-2 text-slate-400">

        {React.cloneElement(
          icon,
          {
            size: 15,
          }
        )}

        <span className="text-xs font-medium">
          {title}
        </span>

      </div>

      <p className="mt-2 truncate text-sm font-bold text-slate-900">
        {value}
      </p>

    </div>
  );
};


export default Purchases;