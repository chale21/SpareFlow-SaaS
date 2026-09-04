import React, { useEffect, useMemo, useState } from 'react';
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
  FiShoppingBag,
  FiChevronDown,
  FiCalendar,
} from 'react-icons/fi';

import supplierService from '../services/supplierService';

const Suppliers = () => {
  // ============================================================
  // STATE
  // ============================================================

  const [suppliers, setSuppliers] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [viewingSupplier, setViewingSupplier] = useState(null);
  const [supplierToDelete, setSupplierToDelete] = useState(null);

  const [openMenuId, setOpenMenuId] = useState(null);

  const [formData, setFormData] = useState({
    supplierName: '',
    phone: '',
    email: '',
    address: '',
    isActive: true,
  });

  const [errors, setErrors] = useState({});

  const [notification, setNotification] = useState(null);

  // Purchase history
  const [supplierPurchases, setSupplierPurchases] = useState([]);
  const [isLoadingPurchases, setIsLoadingPurchases] = useState(false);

  // ============================================================
  // LOAD SUPPLIERS
  // ============================================================

  const loadSuppliers = async () => {
    try {
      setIsLoading(true);
      setError('');

      const response = await supplierService.getSuppliers();

      /*
       * Backend response expected:
       *
       * {
       *   success: true,
       *   message: "...",
       *   data: [...]
       * }
       */

      if (response?.success) {
        setSuppliers(response.data || []);
      } else {
        setSuppliers([]);
        setError(
          response?.message || 'Failed to load suppliers.'
        );
      }
    } catch (err) {
      console.error('Error loading suppliers:', err);

      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to load suppliers.';

      setError(message);
      setSuppliers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    loadSuppliers();
  }, []);

  // ============================================================
  // NOTIFICATION
  // ============================================================

  const showNotification = (type, message) => {
    setNotification({
      type,
      message,
    });

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // ============================================================
  // FORM RESET
  // ============================================================

  const resetForm = () => {
    setFormData({
      supplierName: '',
      phone: '',
      email: '',
      address: '',
      isActive: true,
    });

    setErrors({});
  };

  // ============================================================
  // OPEN CREATE
  // ============================================================

  const handleOpenCreate = () => {
    setEditingSupplier(null);
    resetForm();
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  // ============================================================
  // OPEN EDIT
  // ============================================================

  const handleOpenEdit = (supplier) => {
    setEditingSupplier(supplier);

    setFormData({
      supplierName: supplier.supplierName || '',
      phone: supplier.phone || '',
      email: supplier.email || '',
      address: supplier.address || '',
      isActive: supplier.isActive !== false,
    });

    setErrors({});
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  // ============================================================
  // CLOSE MODAL
  // ============================================================

  const handleCloseModal = () => {
    if (isSaving) return;

    setIsModalOpen(false);
    setEditingSupplier(null);
    resetForm();
  };

  // ============================================================
  // FORM CHANGE
  // ============================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: '',
      }));
    }
  };

  // ============================================================
  // STATUS CHANGE
  // ============================================================

  const handleStatusChange = (event) => {
    const value = event.target.value;

    setFormData((previous) => ({
      ...previous,
      isActive: value === 'active',
    }));
  };

  // ============================================================
  // VALIDATION
  // ============================================================

  const validateForm = () => {
    const newErrors = {};

    const supplierName =
      formData.supplierName.trim();

    const phone =
      formData.phone.trim();

    const email =
      formData.email.trim();

    if (!supplierName) {
      newErrors.supplierName =
        'Supplier name is required.';
    } else if (supplierName.length < 2) {
      newErrors.supplierName =
        'Supplier name must contain at least 2 characters.';
    } else if (supplierName.length > 100) {
      newErrors.supplierName =
        'Supplier name cannot exceed 100 characters.';
    }

    if (!phone) {
      newErrors.phone =
        'Phone number is required.';
    } else if (phone.length > 30) {
      newErrors.phone =
        'Phone number cannot exceed 30 characters.';
    }

    if (email) {
      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        newErrors.email =
          'Please enter a valid email address.';
      }
    }

    if (formData.address.trim().length > 200) {
      newErrors.address =
        'Address cannot exceed 200 characters.';
    }

    /*
     * We intentionally do NOT perform duplicate validation
     * against the frontend state.
     *
     * The backend has:
     *
     * companyId + supplierName = unique
     *
     * so the backend should be the final authority.
     */

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ============================================================
  // CREATE / UPDATE
  // ============================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      const cleanData = {
        supplierName:
          formData.supplierName.trim(),

        phone:
          formData.phone.trim(),

        email:
          formData.email.trim(),

        address:
          formData.address.trim(),

        isActive:
          formData.isActive,
      };

      let response;

      // --------------------------------------------------------
      // UPDATE
      // --------------------------------------------------------

      if (editingSupplier) {
        response =
          await supplierService.updateSupplier(
            editingSupplier._id,
            cleanData
          );

        if (!response?.success) {
          throw new Error(
            response?.message ||
              'Failed to update supplier.'
          );
        }

        showNotification(
          'success',
          'Supplier updated successfully.'
        );
      }

      // --------------------------------------------------------
      // CREATE
      // --------------------------------------------------------

      else {
        response =
          await supplierService.createSupplier(
            cleanData
          );

        if (!response?.success) {
          throw new Error(
            response?.message ||
              'Failed to create supplier.'
          );
        }

        showNotification(
          'success',
          'Supplier created successfully.'
        );
      }

      /*
       * Reload from backend instead of manually modifying
       * frontend state.
       *
       * This guarantees the UI represents the database.
       */

      await loadSuppliers();

      handleCloseModal();
    } catch (err) {
      console.error(
        'Supplier save error:',
        err
      );

      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to save supplier.';

      showNotification(
        'error',
        message
      );
    } finally {
      setIsSaving(false);
    }
  };

  // ============================================================
  // VIEW DETAILS
  // ============================================================

  const handleViewDetails = async (supplier) => {
    setViewingSupplier(supplier);
    setOpenMenuId(null);

    /*
     * Load purchase history from backend.
     */

    try {
      setIsLoadingPurchases(true);
      setSupplierPurchases([]);

      const response =
        await supplierService.getSupplierPurchases(
          supplier._id
        );

      if (response?.success) {
        setSupplierPurchases(
          response.data || []
        );
      } else {
        showNotification(
          'error',
          response?.message ||
            'Failed to load purchase history.'
        );
      }
    } catch (err) {
      console.error(
        'Error loading supplier purchases:',
        err
      );

      showNotification(
        'error',
        err?.response?.data?.message ||
          'Failed to load purchase history.'
      );
    } finally {
      setIsLoadingPurchases(false);
    }
  };

  // ============================================================
  // TOGGLE STATUS
  // ============================================================

  const handleToggleStatus = async (supplier) => {
    const newStatus =
      !supplier.isActive;

    try {
      setOpenMenuId(null);

      const response =
        await supplierService.updateSupplier(
          supplier._id,
          {
            isActive: newStatus,
          }
        );

      if (!response?.success) {
        throw new Error(
          response?.message ||
            'Failed to update supplier status.'
        );
      }

      showNotification(
        'success',
        `${supplier.supplierName} has been ${
          newStatus
            ? 'activated'
            : 'deactivated'
        }.`
      );

      await loadSuppliers();
    } catch (err) {
      console.error(
        'Supplier status update error:',
        err
      );

      showNotification(
        'error',
        err?.response?.data?.message ||
          err?.message ||
          'Failed to update supplier status.'
      );
    }
  };

  // ============================================================
  // DELETE
  // ============================================================

  const handleDelete = (supplier) => {
    setSupplierToDelete(supplier);
    setOpenMenuId(null);
  };

  // ============================================================
  // CONFIRM DELETE
  // ============================================================

  const confirmDelete = async () => {
    if (!supplierToDelete) return;

    try {
      const response =
        await supplierService.deleteSupplier(
          supplierToDelete._id
        );

      if (!response?.success) {
        throw new Error(
          response?.message ||
            'Failed to delete supplier.'
        );
      }

      showNotification(
        'success',
        `${supplierToDelete.supplierName} deleted successfully.`
      );

      setSupplierToDelete(null);

      await loadSuppliers();
    } catch (err) {
      console.error(
        'Supplier delete error:',
        err
      );

      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to delete supplier.';

      showNotification(
        'error',
        message
      );

      /*
       * Keep confirmation modal open when deletion fails.
       * This allows the user to see the error.
       */
    }
  };

  // ============================================================
  // LOCATIONS
  // ============================================================

  /*
   * Your backend does NOT have a city field.
   *
   * Therefore location filtering is based on the address field.
   *
   * We collect unique addresses instead of pretending
   * there is a city field in the backend.
   */

  const locations = useMemo(() => {
    const uniqueAddresses = [
      ...new Set(
        suppliers
          .map((supplier) =>
            supplier.address?.trim()
          )
          .filter(Boolean)
      ),
    ];

    return uniqueAddresses.sort();
  }, [suppliers]);

  // ============================================================
  // FILTER SUPPLIERS
  // ============================================================

  const filteredSuppliers = useMemo(() => {
    const query =
      searchTerm.trim().toLowerCase();

    return suppliers.filter((supplier) => {
      const supplierName =
        supplier.supplierName?.toLowerCase() || '';

      const phone =
        supplier.phone?.toLowerCase() || '';

      const email =
        supplier.email?.toLowerCase() || '';

      const address =
        supplier.address?.toLowerCase() || '';

      const matchesSearch =
        !query ||
        supplierName.includes(query) ||
        phone.includes(query) ||
        email.includes(query) ||
        address.includes(query);

      const supplierStatus =
        supplier.isActive
          ? 'active'
          : 'inactive';

      const matchesStatus =
        statusFilter === 'all' ||
        supplierStatus === statusFilter;

      const matchesLocation =
        locationFilter === 'all' ||
        supplier.address === locationFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesLocation
      );
    });
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
      (supplier) => supplier.isActive
    ).length;

  const inactiveSuppliers =
    suppliers.filter(
      (supplier) => !supplier.isActive
    ).length;

  // ============================================================
  // FORMAT DATE
  // ============================================================

  const formatDate = (date) => {
    if (!date) {
      return '—';
    }

    const parsedDate =
      new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
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

  // ============================================================
  // STATUS BADGE
  // ============================================================

  const StatusBadge = ({ isActive }) => {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
          isActive
            ? 'bg-emerald-50 text-emerald-700'
            : 'bg-slate-100 text-slate-600'
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            isActive
              ? 'bg-emerald-500'
              : 'bg-slate-400'
          }`}
        />

        {isActive
          ? 'Active'
          : 'Inactive'}
      </span>
    );
  };

  // ============================================================
  // LOADING STATE
  // ============================================================

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

          <div className="flex min-h-[400px] items-center justify-center">

            <div className="text-center">

              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

              <p className="mt-4 text-sm font-medium text-slate-500">
                Loading suppliers...
              </p>

            </div>

          </div>

        </div>
      </div>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ========================================================
          NOTIFICATION
      ======================================================== */}

      {notification && (
        <div className="fixed right-4 top-4 z-[100] max-w-sm">
          <div
            className={`flex items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-xl ${
              notification.type === 'success'
                ? 'border-emerald-200 text-emerald-700'
                : 'border-red-200 text-red-700'
            }`}
          >

            {notification.type === 'success' ? (
              <FiCheckCircle size={18} />
            ) : (
              <FiAlertCircle size={18} />
            )}

            <span className="text-sm font-medium">
              {notification.message}
            </span>

            <button
              onClick={() =>
                setNotification(null)
              }
              className="ml-2 text-slate-400 hover:text-slate-700"
            >
              <FiX size={16} />
            </button>

          </div>
        </div>
      )}

      {/* ========================================================
          PAGE CONTAINER
      ======================================================== */}

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Suppliers
            </h1>

            <p className="mt-1 text-sm text-slate-500 sm:text-base">
              Manage your supplier relationships and contact information.
            </p>

          </div>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <FiPlus size={18} />
            Add Supplier
          </button>

        </div>

        {/* ======================================================
            ERROR
        ====================================================== */}

        {error && (
          <div className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">

            <div className="flex items-center gap-2">

              <FiAlertCircle size={18} />

              <p className="text-sm font-medium">
                {error}
              </p>

            </div>

            <button
              onClick={loadSuppliers}
              className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-red-700 shadow-sm hover:bg-red-100"
            >
              Retry
            </button>

          </div>
        )}

        {/* ======================================================
            STATISTICS
        ====================================================== */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

          {/* Total */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  Total Suppliers
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {totalSuppliers}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Registered suppliers
                </p>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FiTruck size={23} />
              </div>

            </div>

          </div>

          {/* Active */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  Active Suppliers
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {activeSuppliers}
                </p>

                <p className="mt-1 text-xs text-emerald-600">
                  Currently active
                </p>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <FiCheckCircle size={23} />
              </div>

            </div>

          </div>

          {/* Inactive */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  Inactive Suppliers
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {inactiveSuppliers}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Currently inactive
                </p>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                <FiPower size={23} />
              </div>

            </div>

          </div>

        </div>

        {/* ======================================================
            MAIN CARD
        ====================================================== */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Toolbar */}

          <div className="border-b border-slate-200 p-5">

            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

              <div>

                <h2 className="text-base font-bold text-slate-900">
                  Supplier Directory
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  View and manage your suppliers.
                </p>

              </div>

              <div className="flex flex-col gap-3 sm:flex-row">

                {/* Search */}

                <div className="relative w-full sm:w-72">

                  <FiSearch
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) =>
                      setSearchTerm(
                        event.target.value
                      )
                    }
                    placeholder="Search suppliers..."
                    className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />

                  {searchTerm && (
                    <button
                      onClick={() =>
                        setSearchTerm('')
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      <FiX size={17} />
                    </button>
                  )}

                </div>

                {/* Status */}

                <div className="relative">

                  <select
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(
                        event.target.value
                      )
                    }
                    className="w-full appearance-none rounded-xl border border-slate-300 bg-white py-2.5 pl-3 pr-9 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:w-36"
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

                  <FiChevronDown
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={15}
                  />

                </div>

                {/* Address */}

                <div className="relative">

                  <select
                    value={locationFilter}
                    onChange={(event) =>
                      setLocationFilter(
                        event.target.value
                      )
                    }
                    className="w-full appearance-none rounded-xl border border-slate-300 bg-white py-2.5 pl-3 pr-9 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:w-48"
                  >

                    <option value="all">
                      All Addresses
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

                  <FiChevronDown
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={15}
                  />

                </div>

              </div>

            </div>

          </div>

          {/* ====================================================
              DESKTOP TABLE
          ==================================================== */}

          <div className="hidden overflow-x-auto md:block">

            <table className="w-full min-w-[900px]">

              <thead>

                <tr className="border-b border-slate-200 bg-slate-50">

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Supplier
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Phone
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Email
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Address
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {filteredSuppliers.map(
                  (supplier) => (
                    <tr
                      key={supplier._id}
                      className="transition hover:bg-slate-50"
                    >

                      {/* Supplier */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <FiBriefcaseIcon />
                          </div>

                          <div className="min-w-0">

                            <p className="truncate font-semibold text-slate-900">
                              {supplier.supplierName}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-400">
                              Added{' '}
                              {formatDate(
                                supplier.createdAt
                              )}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* Phone */}

                      <td className="px-5 py-4">

                        <p className="flex items-center gap-2 text-sm text-slate-700">

                          <FiPhone
                            size={14}
                            className="text-slate-400"
                          />

                          {supplier.phone || '—'}

                        </p>

                      </td>

                      {/* Email */}

                      <td className="px-5 py-4">

                        <p className="flex max-w-[220px] items-center gap-2 truncate text-sm text-slate-600">

                          <FiMail
                            size={14}
                            className="shrink-0 text-slate-400"
                          />

                          <span className="truncate">
                            {supplier.email ||
                              'No email'}
                          </span>

                        </p>

                      </td>

                      {/* Address */}

                      <td className="px-5 py-4">

                        <div className="flex items-start gap-2">

                          <FiMapPin
                            size={15}
                            className="mt-0.5 shrink-0 text-slate-400"
                          />

                          <span className="max-w-[220px] text-sm text-slate-700">
                            {supplier.address ||
                              'No address'}
                          </span>

                        </div>

                      </td>

                      {/* Status */}

                      <td className="px-5 py-4">

                        <StatusBadge
                          isActive={
                            supplier.isActive
                          }
                        />

                      </td>

                      {/* Actions */}

                      <td className="relative px-5 py-4">

                        <div className="flex justify-end">

                          <button
                            onClick={() =>
                              setOpenMenuId(
                                openMenuId ===
                                  supplier._id
                                  ? null
                                  : supplier._id
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                            title="More actions"
                          >
                            <FiMoreVertical
                              size={18}
                            />
                          </button>

                          {openMenuId ===
                            supplier._id && (
                            <ActionMenu
                              supplier={
                                supplier
                              }
                              onView={
                                handleViewDetails
                              }
                              onEdit={
                                handleOpenEdit
                              }
                              onToggle={
                                handleToggleStatus
                              }
                              onDelete={
                                handleDelete
                              }
                            />
                          )}

                        </div>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

          {/* ====================================================
              MOBILE CARDS
          ==================================================== */}

          <div className="divide-y divide-slate-100 md:hidden">

            {filteredSuppliers.map(
              (supplier) => (
                <div
                  key={supplier._id}
                  className="p-4"
                >

                  <div className="flex items-start justify-between gap-3">

                    <div className="flex min-w-0 items-center gap-3">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <FiBriefcaseIcon />
                      </div>

                      <div className="min-w-0">

                        <h3 className="truncate font-semibold text-slate-900">
                          {supplier.supplierName}
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                          {supplier.phone}
                        </p>

                      </div>

                    </div>

                    <div className="relative">

                      <button
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId ===
                              supplier._id
                              ? null
                              : supplier._id
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                      >
                        <FiMoreVertical
                          size={18}
                        />
                      </button>

                      {openMenuId ===
                        supplier._id && (
                        <ActionMenu
                          supplier={
                            supplier
                          }
                          onView={
                            handleViewDetails
                          }
                          onEdit={
                            handleOpenEdit
                          }
                          onToggle={
                            handleToggleStatus
                          }
                          onDelete={
                            handleDelete
                          }
                        />
                      )}

                    </div>

                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3">

                    <div className="rounded-xl bg-slate-50 p-3">

                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <FiPhone size={13} />
                        Phone
                      </div>

                      <p className="mt-1 truncate text-sm font-medium text-slate-700">
                        {supplier.phone ||
                          '—'}
                      </p>

                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">

                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <FiMail size={13} />
                        Email
                      </div>

                      <p className="mt-1 truncate text-sm font-medium text-slate-700">
                        {supplier.email ||
                          'No email'}
                      </p>

                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">

                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <FiMapPin size={13} />
                        Address
                      </div>

                      <p className="mt-1 text-sm font-medium text-slate-700">
                        {supplier.address ||
                          'No address'}
                      </p>

                    </div>

                  </div>

                  <div className="mt-4 flex items-center justify-between">

                    <StatusBadge
                      isActive={
                        supplier.isActive
                      }
                    />

                    <span className="text-xs text-slate-400">
                      Added{' '}
                      {formatDate(
                        supplier.createdAt
                      )}
                    </span>

                  </div>

                </div>
              )
            )}

          </div>

          {/* ====================================================
              EMPTY STATE
          ==================================================== */}

          {filteredSuppliers.length === 0 && (
            <div className="px-6 py-16 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <FiTruck size={25} />
              </div>

              <h3 className="mt-4 text-base font-semibold text-slate-900">
                No suppliers found
              </h3>

              <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                {searchTerm ||
                statusFilter !== 'all' ||
                locationFilter !== 'all'
                  ? 'Try changing your search or filters.'
                  : 'Add your first supplier to start managing suppliers.'}
              </p>

              {!searchTerm &&
                statusFilter === 'all' &&
                locationFilter === 'all' && (
                  <button
                    onClick={
                      handleOpenCreate
                    }
                    className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    <FiPlus size={17} />
                    Add Supplier
                  </button>
                )}

            </div>
          )}

          {/* ====================================================
              FOOTER
          ==================================================== */}

          {filteredSuppliers.length > 0 && (
            <div className="border-t border-slate-200 bg-slate-50 px-5 py-4">

              <p className="text-sm text-slate-500">

                Showing{' '}

                <span className="font-semibold text-slate-700">
                  {filteredSuppliers.length}
                </span>{' '}

                of{' '}

                <span className="font-semibold text-slate-700">
                  {suppliers.length}
                </span>{' '}

                suppliers

              </p>

            </div>
          )}

        </div>
      </div>

      {/* ========================================================
          CREATE / EDIT MODAL
      ======================================================== */}

      {isModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-slate-900/50 px-4 py-6 backdrop-blur-sm">

          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* Header */}

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

              <div>

                <div className="flex items-center gap-2">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <FiTruck size={18} />
                  </div>

                  <h2 className="text-lg font-bold text-slate-900">
                    {editingSupplier
                      ? 'Edit Supplier'
                      : 'Add Supplier'}
                  </h2>

                </div>

                <p className="mt-2 text-sm text-slate-500">
                  {editingSupplier
                    ? 'Update supplier information.'
                    : 'Add a supplier to your SpareFlow supplier directory.'}
                </p>

              </div>

              <button
                onClick={
                  handleCloseModal
                }
                disabled={isSaving}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
              >
                <FiX size={20} />
              </button>

            </div>

            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="p-6"
            >

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                {/* Supplier Name */}

                <FormField
                  label="Supplier / Company Name"
                  required
                  error={
                    errors.supplierName
                  }
                  className="sm:col-span-2"
                >
                  <input
                    name="supplierName"
                    value={
                      formData.supplierName
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="e.g. Auto Parts Ethiopia"
                    maxLength={100}
                    className={inputClass(
                      errors.supplierName
                    )}
                  />
                </FormField>

                {/* Phone */}

                <FormField
                  label="Phone Number"
                  required
                  error={errors.phone}
                >
                  <div className="relative">

                    <FiPhone
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      size={16}
                    />

                    <input
                      name="phone"
                      value={
                        formData.phone
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="+251 9XX XXX XXX"
                      maxLength={30}
                      className={`${inputClass(
                        errors.phone
                      )} pl-10`}
                    />

                  </div>
                </FormField>

                {/* Email */}

                <FormField
                  label="Email Address"
                  error={errors.email}
                >
                  <div className="relative">

                    <FiMail
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      size={16}
                    />

                    <input
                      type="email"
                      name="email"
                      value={
                        formData.email
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="supplier@example.com"
                      maxLength={150}
                      className={`${inputClass(
                        errors.email
                      )} pl-10`}
                    />

                  </div>
                </FormField>

                {/* Address */}

                <FormField
                  label="Address"
                  error={errors.address}
                  className="sm:col-span-2"
                >
                  <div className="relative">

                    <FiMapPin
                      className="absolute left-3 top-3 text-slate-400"
                      size={16}
                    />

                    <textarea
                      name="address"
                      value={
                        formData.address
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Street, area, building..."
                      maxLength={200}
                      rows={3}
                      className={`${inputClass(
                        errors.address
                      )} resize-none pl-10`}
                    />

                  </div>
                </FormField>

                {/* Status */}

                <FormField
                  label="Supplier Status"
                >
                  <select
                    value={
                      formData.isActive
                        ? 'active'
                        : 'inactive'
                    }
                    onChange={
                      handleStatusChange
                    }
                    className={inputClass()}
                  >

                    <option value="active">
                      Active
                    </option>

                    <option value="inactive">
                      Inactive
                    </option>

                  </select>
                </FormField>

              </div>

              {/* Actions */}

              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={
                    handleCloseModal
                  }
                  disabled={isSaving}
                  className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {isSaving && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  )}

                  {editingSupplier
                    ? 'Update Supplier'
                    : 'Add Supplier'}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* ========================================================
          VIEW SUPPLIER DETAILS
      ======================================================== */}

      {viewingSupplier && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-slate-900/50 px-4 py-6 backdrop-blur-sm">

          <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* Header */}

            <div className="border-b border-slate-200 bg-white px-6 py-5">

              <div className="flex items-start justify-between gap-4">

                <div className="flex items-center gap-4">

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <FiTruck size={25} />
                  </div>

                  <div>

                    <div className="flex flex-wrap items-center gap-2">

                      <h2 className="text-xl font-bold text-slate-900">
                        {
                          viewingSupplier.supplierName
                        }
                      </h2>

                      <StatusBadge
                        isActive={
                          viewingSupplier.isActive
                        }
                      />

                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                      Supplier information
                    </p>

                  </div>

                </div>

                <button
                  onClick={() => {
                    setViewingSupplier(
                      null
                    );
                    setSupplierPurchases(
                      []
                    );
                  }}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <FiX size={20} />
                </button>

              </div>

            </div>

            {/* Details */}

            <div className="p-6">

              {/* Overview */}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

                <DetailStat
                  icon={<FiPhone />}
                  label="Phone"
                  value={
                    viewingSupplier.phone ||
                    '—'
                  }
                />

                <DetailStat
                  icon={<FiMail />}
                  label="Email"
                  value={
                    viewingSupplier.email ||
                    'No email'
                  }
                />

                <DetailStat
                  icon={<FiCalendar />}
                  label="Created"
                  value={formatDate(
                    viewingSupplier.createdAt
                  )}
                />

              </div>

              {/* Information */}

              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">

                <div className="rounded-2xl border border-slate-200 p-5">

                  <h3 className="font-semibold text-slate-900">
                    Contact Information
                  </h3>

                  <div className="mt-4 space-y-4">

                    <InfoRow
                      icon={<FiTruck />}
                      label="Supplier"
                      value={
                        viewingSupplier.supplierName
                      }
                    />

                    <InfoRow
                      icon={<FiPhone />}
                      label="Phone"
                      value={
                        viewingSupplier.phone ||
                        'No phone'
                      }
                    />

                    <InfoRow
                      icon={<FiMail />}
                      label="Email"
                      value={
                        viewingSupplier.email ||
                        'No email provided'
                      }
                    />

                  </div>

                </div>

                <div className="rounded-2xl border border-slate-200 p-5">

                  <h3 className="font-semibold text-slate-900">
                    Address
                  </h3>

                  <div className="mt-4 space-y-4">

                    <InfoRow
                      icon={<FiMapPin />}
                      label="Address"
                      value={
                        viewingSupplier.address ||
                        'No address provided'
                      }
                    />

                    <InfoRow
                      icon={<FiCheckCircle />}
                      label="Status"
                      value={
                        viewingSupplier.isActive
                          ? 'Active'
                          : 'Inactive'
                      }
                    />

                    <InfoRow
                      icon={<FiCalendar />}
                      label="Created"
                      value={formatDate(
                        viewingSupplier.createdAt
                      )}
                    />

                  </div>

                </div>

              </div>

              {/* Purchase History */}

              <div className="mt-6 rounded-2xl border border-slate-200 p-5">

                <div className="flex items-center justify-between">

                  <div>

                    <h3 className="font-semibold text-slate-900">
                      Purchase History
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Purchases recorded for this supplier.
                    </p>

                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <FiShoppingBag
                      size={17}
                    />
                  </div>

                </div>

                {isLoadingPurchases ? (
                  <div className="flex justify-center py-8">

                    <div className="h-7 w-7 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                  </div>
                ) : supplierPurchases.length === 0 ? (
                  <div className="py-8 text-center">

                    <FiShoppingBag
                      size={24}
                      className="mx-auto text-slate-300"
                    />

                    <p className="mt-2 text-sm text-slate-500">
                      No purchase history found.
                    </p>

                  </div>
                ) : (
                  <div className="mt-4 space-y-3">

                    {supplierPurchases.map(
                      (purchase) => (
                        <PurchaseRow
                          key={
                            purchase._id
                          }
                          purchase={
                            purchase
                          }
                        />
                      )
                    )}

                  </div>
                )}

              </div>

              {/* Footer */}

              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-between">

                <p className="text-xs text-slate-400">
                  Created{' '}
                  {formatDate(
                    viewingSupplier.createdAt
                  )}
                </p>

                <div className="flex gap-3">

                  <button
                    onClick={() => {
                      setViewingSupplier(
                        null
                      );

                      setSupplierPurchases(
                        []
                      );

                      handleOpenEdit(
                        viewingSupplier
                      );
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <FiEdit2 size={15} />
                    Edit Supplier
                  </button>

                  <button
                    onClick={() => {
                      setViewingSupplier(
                        null
                      );

                      setSupplierPurchases(
                        []
                      );
                    }}
                    className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Close
                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================
          DELETE CONFIRMATION
      ======================================================== */}

      {supplierToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              <FiAlertCircle size={24} />
            </div>

            <h2 className="mt-4 text-lg font-bold text-slate-900">
              Delete Supplier?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">

              Are you sure you want to delete{' '}

              <span className="font-semibold text-slate-700">
                {
                  supplierToDelete.supplierName
                }
              </span>
              ?

            </p>

            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3">

              <p className="text-sm leading-5 text-amber-800">

                The backend will prevent deletion if this
                supplier has products or purchase records.

              </p>

            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

              <button
                onClick={() =>
                  setSupplierToDelete(
                    null
                  )
                }
                className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
              >
                <FiTrash2 size={16} />
                Delete Supplier
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

// ============================================================
// ACTION MENU
// ============================================================

const ActionMenu = ({
  supplier,
  onView,
  onEdit,
  onToggle,
  onDelete,
}) => {
  return (
    <div className="absolute right-0 top-11 z-[70] w-48 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl">

      <button
        onClick={() =>
          onView(supplier)
        }
        className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50"
      >
        <FiEye size={16} />
        View Details
      </button>

      <button
        onClick={() =>
          onEdit(supplier)
        }
        className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50"
      >
        <FiEdit2 size={16} />
        Edit Supplier
      </button>

      <button
        onClick={() =>
          onToggle(supplier)
        }
        className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50"
      >
        <FiPower size={16} />

        {supplier.isActive
          ? 'Deactivate'
          : 'Activate'}
      </button>

      <div className="my-1 border-t border-slate-100" />

      <button
        onClick={() =>
          onDelete(supplier)
        }
        className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
      >
        <FiTrash2 size={16} />
        Delete Supplier
      </button>

    </div>
  );
};

// ============================================================
// FORM FIELD
// ============================================================

const FormField = ({
  label,
  required,
  error,
  children,
  className = '',
}) => {
  return (
    <div className={className}>

      <label className="mb-2 block text-sm font-semibold text-slate-700">

        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}

      </label>

      {children}

      {error && (
        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600">
          <FiAlertCircle size={13} />
          {error}
        </div>
      )}

    </div>
  );
};

// ============================================================
// INPUT CLASS
// ============================================================

const inputClass = (
  hasError = false
) => {
  return `w-full rounded-xl border px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
    hasError
      ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
      : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
  }`;
};

// ============================================================
// DETAIL STAT
// ============================================================

const DetailStat = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

      <div className="flex items-center gap-2 text-slate-400">

        {React.cloneElement(icon, {
          size: 15,
        })}

        <span className="text-xs font-medium">
          {label}
        </span>

      </div>

      <p className="mt-2 truncate text-sm font-bold text-slate-900">
        {value}
      </p>

    </div>
  );
};

// ============================================================
// INFO ROW
// ============================================================

const InfoRow = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="flex items-start gap-3">

      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">

        {React.cloneElement(icon, {
          size: 15,
        })}

      </div>

      <div className="min-w-0">

        <p className="text-xs text-slate-400">
          {label}
        </p>

        <p className="mt-0.5 break-words text-sm font-medium text-slate-700">
          {value}
        </p>

      </div>

    </div>
  );
};

// ============================================================
// PURCHASE ROW
// ============================================================

const PurchaseRow = ({
  purchase,
}) => {
  const items =
    purchase.items || [];

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <p className="text-sm font-semibold text-slate-900">
            Purchase
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {purchase.createdAt
              ? new Date(
                  purchase.createdAt
                ).toLocaleDateString(
                  'en-US',
                  {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  }
                )
              : 'No date'}
          </p>

        </div>

        <div className="text-left sm:text-right">

          <p className="text-sm font-semibold text-slate-800">
            {items.length}{' '}
            {items.length === 1
              ? 'item'
              : 'items'}
          </p>

          {purchase.totalAmount !==
            undefined && (
            <p className="mt-1 text-xs text-slate-500">
              Total:{' '}
              {Number(
                purchase.totalAmount
              ).toLocaleString(
                'en-US'
              )}{' '}
              ETB
            </p>
          )}

        </div>

      </div>

      {items.length > 0 && (
        <div className="mt-3 space-y-2 border-t border-slate-200 pt-3">

          {items.map(
            (item, index) => (
              <div
                key={
                  item._id ||
                  item.productId?._id ||
                  index
                }
                className="flex items-center justify-between gap-3 text-xs"
              >

                <span className="min-w-0 truncate text-slate-600">

                  {item.productId
                    ?.productName ||
                    'Product'}

                </span>

                <span className="shrink-0 font-medium text-slate-700">
                  Qty:{' '}
                  {item.quantity ??
                    0}
                </span>

              </div>
            )
          )}

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