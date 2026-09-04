import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiX,
  FiMoreVertical,
  FiTruck,
  FiPhone,
  FiMail,
  FiMapPin,
  FiCheckCircle,
  FiAlertCircle,
  FiEye,
  FiPower,
  FiRefreshCw,
} from 'react-icons/fi';

import { supplierService } from '../services/productService';

const Suppliers = () => {
  // ============================================================
  // STATE
  // ============================================================

  const [suppliers, setSuppliers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] =
    useState('all');

  const [locationFilter, setLocationFilter] =
    useState('all');

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [editingSupplier, setEditingSupplier] =
    useState(null);

  const [viewingSupplier, setViewingSupplier] =
    useState(null);

  const [supplierToDelete, setSupplierToDelete] =
    useState(null);

  const [supplierToToggle, setSupplierToToggle] =
    useState(null);

  const [openMenuId, setOpenMenuId] =
    useState(null);

  const [notification, setNotification] =
    useState(null);

  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    country: 'Ethiopia',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  const menuRef = useRef(null);

  // ============================================================
  // NORMALIZE SUPPLIER
  // ============================================================

  const normalizeSupplier = useCallback(
    (supplier) => {
      return {
        ...supplier,

        id:
          supplier?._id ??
          supplier?.id ??
          '',

        name:
          supplier?.supplierName ??
          supplier?.name ??
          '',

        phone:
          supplier?.phone ??
          '',

        email:
          supplier?.email ??
          '',

        address:
          supplier?.address ??
          '',

        city:
          supplier?.city ??
          '',

        country:
          supplier?.country ??
          'Ethiopia',

        contactPerson:
          supplier?.contactPerson ??
          '',

        notes:
          supplier?.notes ??
          '',

        status:
          supplier?.isActive === false
            ? 'inactive'
            : supplier?.status === 'inactive'
            ? 'inactive'
            : 'active',

        productsSupplied:
          Number(
            supplier?.productsSupplied ??
            supplier?.productCount ??
            0
          ),

        purchaseCount:
          Number(
            supplier?.purchaseCount ??
            0
          ),

        totalPurchaseValue:
          Number(
            supplier?.totalPurchaseValue ??
            0
          ),

        lastPurchase:
          supplier?.lastPurchase ??
          null,
      };
    },
    []
  );

  // ============================================================
  // LOAD SUPPLIERS
  // ============================================================

  const loadSuppliers = useCallback(
    async () => {
      setLoading(true);
      setError('');

      try {
        const data =
          await supplierService.list();

        const normalized =
          Array.isArray(data)
            ? data.map(
                normalizeSupplier
              )
            : [];

        setSuppliers(normalized);
      } catch (err) {
        console.error(
          'Failed to load suppliers:',
          err
        );

        setError(
          err?.response?.data?.message ||
            err?.message ||
            'Failed to load suppliers.'
        );

        setSuppliers([]);
      } finally {
        setLoading(false);
      }
    },
    [normalizeSupplier]
  );

  useEffect(() => {
    loadSuppliers();
  }, [loadSuppliers]);

  // ============================================================
  // CLOSE MENU
  // ============================================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target
        )
      ) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener(
      'mousedown',
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
    };
  }, []);

  // ============================================================
  // NOTIFICATION
  // ============================================================

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

  // ============================================================
  // LOCATIONS
  // ============================================================

  const locations = useMemo(() => {
    return [
      ...new Set(
        suppliers
          .map(
            (supplier) =>
              supplier.city
          )
          .filter(Boolean)
      ),
    ].sort();
  }, [suppliers]);

  // ============================================================
  // FILTER
  // ============================================================

  const filteredSuppliers =
    useMemo(() => {
      const query =
        searchTerm
          .trim()
          .toLowerCase();

      return suppliers.filter(
        (supplier) => {
          const name =
            supplier.name
              ?.toLowerCase() ||
            '';

          const contact =
            supplier.contactPerson
              ?.toLowerCase() ||
            '';

          const phone =
            supplier.phone
              ?.toLowerCase() ||
            '';

          const email =
            supplier.email
              ?.toLowerCase() ||
            '';

          const city =
            supplier.city
              ?.toLowerCase() ||
            '';

          const matchesSearch =
            !query ||
            name.includes(query) ||
            contact.includes(query) ||
            phone.includes(query) ||
            email.includes(query) ||
            city.includes(query);

          const matchesStatus =
            statusFilter === 'all' ||
            supplier.status ===
              statusFilter;

          const matchesLocation =
            locationFilter === 'all' ||
            supplier.city ===
              locationFilter;

          return (
            matchesSearch &&
            matchesStatus &&
            matchesLocation
          );
        }
      );
    }, [
      suppliers,
      searchTerm,
      statusFilter,
      locationFilter,
    ]);

  // ============================================================
  // STATISTICS
  // ============================================================

  const totalSuppliers =
    suppliers.length;

  const activeSuppliers =
    suppliers.filter(
      (supplier) =>
        supplier.status === 'active'
    ).length;

  const inactiveSuppliers =
    suppliers.filter(
      (supplier) =>
        supplier.status === 'inactive'
    ).length;

  const totalPurchaseValue =
    suppliers.reduce(
      (total, supplier) =>
        total +
        Number(
          supplier.totalPurchaseValue ||
            0
        ),
      0
    );

  // ============================================================
  // FORM RESET
  // ============================================================

  const resetForm = () => {
    setFormData({
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      country: 'Ethiopia',
      notes: '',
    });

    setErrors({});
  };

  // ============================================================
  // CREATE
  // ============================================================

  const handleOpenCreate = () => {
    setEditingSupplier(null);
    resetForm();
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  // ============================================================
  // EDIT
  // ============================================================

  const handleOpenEdit = (
    supplier
  ) => {
    setEditingSupplier(supplier);

    setFormData({
      name: supplier.name || '',
      contactPerson:
        supplier.contactPerson ||
        '',
      phone: supplier.phone || '',
      email: supplier.email || '',
      address:
        supplier.address || '',
      city: supplier.city || '',
      country:
        supplier.country ||
        'Ethiopia',
      notes: supplier.notes || '',
    });

    setErrors({});
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  // ============================================================
  // VIEW
  // ============================================================

  const handleView = (supplier) => {
    setViewingSupplier(supplier);
    setOpenMenuId(null);
  };

  // ============================================================
  // VALIDATION
  // ============================================================

  const validateForm = () => {
    const newErrors = {};

    const name =
      formData.name.trim();

    const phone =
      formData.phone.trim();

    const email =
      formData.email.trim();

    if (!name) {
      newErrors.name =
        'Supplier name is required.';
    } else if (name.length < 2) {
      newErrors.name =
        'Supplier name must contain at least 2 characters.';
    }

    if (!phone) {
      newErrors.phone =
        'Phone number is required.';
    }

    if (
      email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
      )
    ) {
      newErrors.email =
        'Please enter a valid email address.';
    }

    const duplicate =
      suppliers.some((supplier) => {
        return (
          supplier.name
            ?.trim()
            .toLowerCase() ===
            name.toLowerCase() &&
          supplier.id !==
            editingSupplier?.id
        );
      });

    if (duplicate) {
      newErrors.name =
        'A supplier with this name already exists.';
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  // ============================================================
  // CREATE / UPDATE
  // ============================================================

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        supplierName:
          formData.name.trim(),

        phone:
          formData.phone.trim(),

        email:
          formData.email.trim(),

        address:
          formData.address.trim(),
      };

      if (editingSupplier) {
        await supplierService.update(
          editingSupplier.id,
          payload
        );

        showNotification(
          'success',
          'Supplier updated successfully.'
        );
      } else {
        await supplierService.create(
          payload
        );

        showNotification(
          'success',
          'Supplier created successfully.'
        );
      }

      setIsModalOpen(false);
      setEditingSupplier(null);
      resetForm();

      await loadSuppliers();
    } catch (err) {
      console.error(
        'Failed to save supplier:',
        err
      );

      showNotification(
        'error',
        err?.response?.data?.message ||
          err?.message ||
          'Failed to save supplier.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  // ============================================================
  // TOGGLE
  // ============================================================

  const handleToggleStatus = (
    supplier
  ) => {
    setSupplierToToggle(supplier);
    setOpenMenuId(null);
  };

  const confirmToggleStatus =
    async () => {
      if (!supplierToToggle) {
        return;
      }

      const isActive =
        supplierToToggle.status ===
        'active';

      setIsSaving(true);

      try {
        await supplierService.update(
          supplierToToggle.id,
          {
            supplierName:
              supplierToToggle.name,

            phone:
              supplierToToggle.phone ||
              '',

            email:
              supplierToToggle.email ||
              '',

            address:
              supplierToToggle.address ||
              '',

            isActive:
              !isActive,
          }
        );

        showNotification(
          'success',
          `${supplierToToggle.name} has been ${
            isActive
              ? 'deactivated'
              : 'activated'
          }.`
        );

        setSupplierToToggle(null);

        await loadSuppliers();
      } catch (err) {
        console.error(
          'Failed to update supplier:',
          err
        );

        showNotification(
          'error',
          err?.response?.data?.message ||
            err?.message ||
            'Failed to update supplier.'
        );
      } finally {
        setIsSaving(false);
      }
    };

  // ============================================================
  // DELETE
  // ============================================================

  const handleDelete = (
    supplier
  ) => {
    setSupplierToDelete(supplier);
    setOpenMenuId(null);
  };

  const confirmDelete =
    async () => {
      if (!supplierToDelete) {
        return;
      }

      setIsSaving(true);

      try {
        await supplierService.remove(
          supplierToDelete.id
        );

        showNotification(
          'success',
          `${supplierToDelete.name} deleted successfully.`
        );

        setSupplierToDelete(null);

        await loadSuppliers();
      } catch (err) {
        console.error(
          'Failed to delete supplier:',
          err
        );

        showNotification(
          'error',
          err?.response?.data?.message ||
            err?.message ||
            'Failed to delete supplier.'
        );
      } finally {
        setIsSaving(false);
      }
    };

  // ============================================================
  // FORMAT CURRENCY
  // ============================================================

  const formatCurrency = (
    value
  ) => {
    return new Intl.NumberFormat(
      'en-US',
      {
        style: 'currency',
        currency: 'ETB',
        maximumFractionDigits: 0,
      }
    ).format(value || 0);
  };

  // ============================================================
  // FORMAT DATE
  // ============================================================

  const formatDate = (
    date
  ) => {
    if (!date) {
      return '-';
    }

    const parsed =
      new Date(date);

    if (
      Number.isNaN(
        parsed.getTime()
      )
    ) {
      return '-';
    }

    return parsed.toLocaleDateString(
      'en-US',
      {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }
    );
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-slate-50">

      {/* NOTIFICATION */}

      {notification && (
        <div className="fixed right-4 top-4 z-[100] max-w-sm">
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
                className="mt-0.5 text-emerald-600"
                size={18}
              />
            ) : (
              <FiAlertCircle
                className="mt-0.5 text-red-600"
                size={18}
              />
            )}

            <span
              className={`text-sm font-medium ${
                notification.type ===
                'success'
                  ? 'text-emerald-700'
                  : 'text-red-700'
              }`}
            >
              {notification.message}
            </span>

            <button
              onClick={() =>
                setNotification(null)
              }
              className="ml-auto"
            >
              <FiX size={16} />
            </button>

          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* HEADER */}

        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Supplier Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your supplier relationships and contact information.
            </p>
          </div>

          <div className="flex gap-2">

            <button
              onClick={
                loadSuppliers
              }
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
            >
              <FiRefreshCw
                size={17}
                className={
                  loading
                    ? 'animate-spin'
                    : ''
                }
              />
              Refresh
            </button>

            <button
              onClick={
                handleOpenCreate
              }
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <FiPlus size={18} />
              Add Supplier
            </button>

          </div>

        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <div className="flex items-center gap-3">
              <FiAlertCircle />

              <div className="flex-1">
                <p className="font-semibold">
                  Could not load suppliers
                </p>

                <p className="text-sm">
                  {error}
                </p>
              </div>

              <button
                onClick={
                  loadSuppliers
                }
                className="text-sm font-semibold underline"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* STATISTICS */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Total Suppliers
            </p>

            <p className="mt-2 text-3xl font-bold">
              {totalSuppliers}
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Active Suppliers
            </p>

            <p className="mt-2 text-3xl font-bold text-emerald-600">
              {activeSuppliers}
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Inactive Suppliers
            </p>

            <p className="mt-2 text-3xl font-bold text-amber-600">
              {inactiveSuppliers}
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Purchase Value
            </p>

            <p className="mt-2 text-2xl font-bold">
              {formatCurrency(
                totalPurchaseValue
              )}
            </p>
          </div>

        </div>

        {/* MAIN */}

        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">

          {/* TOOLBAR */}

          <div className="flex flex-col gap-3 border-b p-4 lg:flex-row lg:items-center lg:justify-between">

            <div className="relative w-full lg:w-80">

              <FiSearch
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
                placeholder="Search suppliers..."
                className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
              />

            </div>

            <div className="flex flex-col gap-3 sm:flex-row">

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
                className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
              >
                <option value="all">
                  All Status
                </option>

                <option value="active">
                  Active
                </option>

                <option value="inactive">
                  Inactive
                </option>
              </select>

              <select
                value={locationFilter}
                onChange={(event) =>
                  setLocationFilter(
                    event.target.value
                  )
                }
                className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
              >
                <option value="all">
                  All Locations
                </option>

                {locations.map(
                  (location) => (
                    <option
                      key={location}
                      value={location}
                    >
                      {location}
                    </option>
                  )
                )}

              </select>

            </div>

          </div>

          {/* CONTENT */}

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="text-center">
                <FiRefreshCw
                  size={28}
                  className="mx-auto animate-spin text-blue-600"
                />

                <p className="mt-3 text-sm text-slate-500">
                  Loading suppliers...
                </p>
              </div>
            </div>
          ) : filteredSuppliers.length ===
            0 ? (

            <div className="flex min-h-[300px] flex-col items-center justify-center text-center">

              <FiTruck
                size={42}
                className="text-slate-300"
              />

              <h3 className="mt-4 text-lg font-semibold">
                {suppliers.length === 0
                  ? 'No suppliers found'
                  : 'No matching suppliers'}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {suppliers.length === 0
                  ? 'Create your first supplier to make it available in the Product form.'
                  : 'Try changing your search or filters.'}
              </p>

              {suppliers.length ===
                0 && (
                <button
                  onClick={
                    handleOpenCreate
                  }
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white"
                >
                  <FiPlus />
                  Add Supplier
                </button>
              )}

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px]">

                <thead>
                  <tr className="border-b bg-slate-50">

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                      Supplier
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                      Contact
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                      Location
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                      Products
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase text-slate-500">
                      Actions
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y">

                  {filteredSuppliers.map(
                    (supplier) => (

                      <tr
                        key={supplier.id}
                        className="hover:bg-slate-50"
                      >

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                              <FiTruck />
                            </div>

                            <div>
                              <p className="font-semibold">
                                {supplier.name}
                              </p>

                              {supplier.contactPerson && (
                                <p className="text-xs text-slate-500">
                                  {supplier.contactPerson}
                                </p>
                              )}
                            </div>

                          </div>

                        </td>

                        <td className="px-5 py-4">

                          <p className="flex items-center gap-2 text-sm">
                            <FiPhone size={13} />
                            {supplier.phone ||
                              '-'}
                          </p>

                          <p className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                            <FiMail size={13} />
                            {supplier.email ||
                              'No email'}
                          </p>

                        </td>

                        <td className="px-5 py-4">

                          <p className="flex items-center gap-2 text-sm">
                            <FiMapPin size={14} />

                            {supplier.city ||
                              supplier.address ||
                              '-'}
                          </p>

                        </td>

                        <td className="px-5 py-4">

                          <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-sm font-semibold">
                            {supplier.productsSupplied}
                          </span>

                        </td>

                        <td className="px-5 py-4">

                          {supplier.status ===
                          'active' ? (
                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                              Active
                            </span>
                          ) : (
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                              Inactive
                            </span>
                          )}

                        </td>

                        <td className="px-5 py-4 text-right">

                          <div
                            className="relative inline-block"
                            ref={
                              openMenuId ===
                              supplier.id
                                ? menuRef
                                : null
                            }
                          >

                            <button
                              onClick={() =>
                                setOpenMenuId(
                                  openMenuId ===
                                    supplier.id
                                    ? null
                                    : supplier.id
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-slate-100"
                            >
                              <FiMoreVertical />
                            </button>

                            {openMenuId ===
                              supplier.id && (
                              <div className="absolute right-0 top-10 z-30 w-48 rounded-xl border bg-white py-1 text-left shadow-xl">

                                <button
                                  onClick={() =>
                                    handleView(
                                      supplier
                                    )
                                  }
                                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm hover:bg-slate-50"
                                >
                                  <FiEye />
                                  View Details
                                </button>

                                <button
                                  onClick={() =>
                                    handleOpenEdit(
                                      supplier
                                    )
                                  }
                                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm hover:bg-slate-50"
                                >
                                  <FiEdit2 />
                                  Edit Supplier
                                </button>

                                <button
                                  onClick={() =>
                                    handleToggleStatus(
                                      supplier
                                    )
                                  }
                                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm hover:bg-slate-50"
                                >
                                  <FiPower />

                                  {supplier.status ===
                                  'active'
                                    ? 'Deactivate'
                                    : 'Activate'}
                                </button>

                                <div className="my-1 border-t" />

                                <button
                                  onClick={() =>
                                    handleDelete(
                                      supplier
                                    )
                                  }
                                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                                >
                                  <FiTrash2 />
                                  Delete Supplier
                                </button>

                              </div>
                            )}

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

      {/* ========================================================
          CREATE / EDIT MODAL
      ======================================================== */}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">

          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b p-5">

              <div>
                <h2 className="text-lg font-bold">
                  {editingSupplier
                    ? 'Edit Supplier'
                    : 'Add Supplier'}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {editingSupplier
                    ? 'Update supplier information.'
                    : 'Create a new supplier.'}
                </p>
              </div>

              <button
                onClick={() =>
                  !isSaving &&
                  setIsModalOpen(false)
                }
                className="rounded-lg p-2 hover:bg-slate-100"
              >
                <FiX size={20} />
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-5"
            >

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                {/* NAME */}

                <div>
                  <label className="mb-1.5 block text-sm font-semibold">
                    Supplier Name *
                  </label>

                  <input
                    value={formData.name}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        name:
                          event.target
                            .value,
                      })
                    }
                    placeholder="Supplier name"
                    className={`w-full rounded-xl border px-4 py-3 outline-none ${
                      errors.name
                        ? 'border-red-400'
                        : 'border-slate-300'
                    }`}
                  />

                  {errors.name && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* CONTACT */}

                <div>
                  <label className="mb-1.5 block text-sm font-semibold">
                    Contact Person
                  </label>

                  <input
                    value={
                      formData.contactPerson
                    }
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        contactPerson:
                          event.target
                            .value,
                      })
                    }
                    placeholder="Contact person"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
                  />
                </div>

                {/* PHONE */}

                <div>
                  <label className="mb-1.5 block text-sm font-semibold">
                    Phone *
                  </label>

                  <input
                    value={
                      formData.phone
                    }
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        phone:
                          event.target
                            .value,
                      })
                    }
                    placeholder="+251..."
                    className={`w-full rounded-xl border px-4 py-3 outline-none ${
                      errors.phone
                        ? 'border-red-400'
                        : 'border-slate-300'
                    }`}
                  />

                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* EMAIL */}

                <div>
                  <label className="mb-1.5 block text-sm font-semibold">
                    Email
                  </label>

                  <input
                    type="email"
                    value={
                      formData.email
                    }
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        email:
                          event.target
                            .value,
                      })
                    }
                    placeholder="supplier@example.com"
                    className={`w-full rounded-xl border px-4 py-3 outline-none ${
                      errors.email
                        ? 'border-red-400'
                        : 'border-slate-300'
                    }`}
                  />

                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* CITY */}

                <div>
                  <label className="mb-1.5 block text-sm font-semibold">
                    City
                  </label>

                  <input
                    value={
                      formData.city
                    }
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        city:
                          event.target
                            .value,
                      })
                    }
                    placeholder="Bahir Dar"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
                  />
                </div>

                {/* COUNTRY */}

                <div>
                  <label className="mb-1.5 block text-sm font-semibold">
                    Country
                  </label>

                  <input
                    value={
                      formData.country
                    }
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        country:
                          event.target
                            .value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
                  />
                </div>

              </div>

              {/* ADDRESS */}

              <div>
                <label className="mb-1.5 block text-sm font-semibold">
                  Address
                </label>

                <textarea
                  rows={3}
                  value={
                    formData.address
                  }
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      address:
                        event.target
                          .value,
                    })
                  }
                  placeholder="Supplier address"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
                />
              </div>

              {/* NOTES */}

              <div>
                <label className="mb-1.5 block text-sm font-semibold">
                  Notes
                </label>

                <textarea
                  rows={3}
                  value={
                    formData.notes
                  }
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      notes:
                        event.target
                          .value,
                    })
                  }
                  placeholder="Additional notes"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 border-t pt-5">

                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() =>
                    setIsModalOpen(false)
                  }
                  className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {isSaving && (
                    <FiRefreshCw
                      size={16}
                      className="animate-spin"
                    />
                  )}

                  {editingSupplier
                    ? 'Update Supplier'
                    : 'Create Supplier'}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* ========================================================
          VIEW
      ======================================================== */}

      {viewingSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">

          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b p-5">

              <h2 className="text-lg font-bold">
                Supplier Details
              </h2>

              <button
                onClick={() =>
                  setViewingSupplier(null)
                }
                className="rounded-lg p-2 hover:bg-slate-100"
              >
                <FiX />
              </button>

            </div>

            <div className="space-y-5 p-5">

              <div>
                <p className="text-xs uppercase text-slate-400">
                  Supplier
                </p>

                <p className="mt-1 text-lg font-bold">
                  {viewingSupplier.name}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>
                  <p className="text-xs text-slate-400">
                    Phone
                  </p>

                  <p className="mt-1 text-sm">
                    {viewingSupplier.phone ||
                      '-'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Email
                  </p>

                  <p className="mt-1 text-sm">
                    {viewingSupplier.email ||
                      '-'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Address
                  </p>

                  <p className="mt-1 text-sm">
                    {viewingSupplier.address ||
                      '-'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Status
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {viewingSupplier.status ===
                    'active'
                      ? 'Active'
                      : 'Inactive'}
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================
          DELETE
      ======================================================== */}

      {supplierToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

            <FiTrash2
              size={24}
              className="text-red-600"
            />

            <h2 className="mt-4 text-lg font-bold">
              Delete Supplier?
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Are you sure you want to delete
              <strong className="mx-1">
                {supplierToDelete.name}
              </strong>
              ?
            </p>

            <div className="mt-6 flex justify-end gap-3">

              <button
                disabled={isSaving}
                onClick={() =>
                  setSupplierToDelete(
                    null
                  )
                }
                className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold"
              >
                Cancel
              </button>

              <button
                disabled={isSaving}
                onClick={confirmDelete}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white"
              >
                {isSaving
                  ? 'Deleting...'
                  : 'Delete'}
              </button>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================
          TOGGLE
      ======================================================== */}

      {supplierToToggle && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

            <FiPower
              size={24}
              className="text-blue-600"
            />

            <h2 className="mt-4 text-lg font-bold">
              {supplierToToggle.status ===
              'active'
                ? 'Deactivate Supplier?'
                : 'Activate Supplier?'}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {supplierToToggle.status ===
              'active'
                ? 'This supplier will no longer be available for new products.'
                : 'This supplier will become available again.'}
            </p>

            <div className="mt-6 flex justify-end gap-3">

              <button
                disabled={isSaving}
                onClick={() =>
                  setSupplierToToggle(
                    null
                  )
                }
                className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold"
              >
                Cancel
              </button>

              <button
                disabled={isSaving}
                onClick={
                  confirmToggleStatus
                }
                className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white"
              >
                {isSaving
                  ? 'Saving...'
                  : 'Confirm'}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

// ============================================================
// ICON HELPER
// ============================================================

const FiBriefcaseIcon = () => {
  return (
    <FiTruck size={19} />
  );
};

export default Suppliers;