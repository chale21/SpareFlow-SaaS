import React, { useMemo, useState } from 'react';
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
  FiBriefcase,
  FiCheckCircle,
  FiAlertCircle,
  FiEye,
  FiPower,
  FiShoppingBag,
  FiDollarSign,
  FiCalendar,
  FiUser,
  FiChevronDown,
} from 'react-icons/fi';

const Suppliers = () => {
  // ============================================================
  // TEMPORARY DATA
  // Replace with supplierService.getSuppliers()
  // when the backend Supplier API is ready.
  // ============================================================

  const [suppliers, setSuppliers] = useState([
    {
      id: '1',
      name: 'Auto Parts Ethiopia',
      contactPerson: 'Abebe Kebede',
      phone: '+251 912 345 678',
      email: 'info@autoparts.et',
      address: 'Bole, Addis Ababa',
      city: 'Addis Ababa',
      country: 'Ethiopia',
      productsSupplied: 35,
      purchaseCount: 18,
      totalPurchaseValue: 125450,
      lastPurchase: '2026-08-18',
      createdAt: '2026-07-15',
      status: 'active',
      notes: 'Main engine and brake parts supplier.',
    },
    {
      id: '2',
      name: 'Mekelle Auto Supplies',
      contactPerson: 'Hana Tesfaye',
      phone: '+251 922 456 789',
      email: 'sales@mekelleauto.et',
      address: 'Hawelti, Mekelle',
      city: 'Mekelle',
      country: 'Ethiopia',
      productsSupplied: 18,
      purchaseCount: 11,
      totalPurchaseValue: 78400,
      lastPurchase: '2026-08-15',
      createdAt: '2026-07-20',
      status: 'active',
      notes: 'Electrical and suspension components.',
    },
    {
      id: '3',
      name: 'Bahir Dar Motor Parts',
      contactPerson: 'Dawit Alemu',
      phone: '+251 933 567 890',
      email: 'contact@bdmotor.et',
      address: 'Piazza, Bahir Dar',
      city: 'Bahir Dar',
      country: 'Ethiopia',
      productsSupplied: 27,
      purchaseCount: 14,
      totalPurchaseValue: 96300,
      lastPurchase: '2026-08-10',
      createdAt: '2026-07-25',
      status: 'active',
      notes: 'Filters, lubricants and engine components.',
    },
    {
      id: '4',
      name: 'Prime Automotive',
      contactPerson: 'Samuel Bekele',
      phone: '+251 911 678 901',
      email: 'primeauto@example.com',
      address: 'Kazanchis, Addis Ababa',
      city: 'Addis Ababa',
      country: 'Ethiopia',
      productsSupplied: 12,
      purchaseCount: 6,
      totalPurchaseValue: 41200,
      lastPurchase: '2026-07-28',
      createdAt: '2026-06-30',
      status: 'inactive',
      notes: 'Currently inactive supplier.',
    },
    {
      id: '5',
      name: 'National Spare Parts',
      contactPerson: 'Meron Girma',
      phone: '+251 944 789 012',
      email: 'nationalparts@example.com',
      address: 'Merkato, Addis Ababa',
      city: 'Addis Ababa',
      country: 'Ethiopia',
      productsSupplied: 42,
      purchaseCount: 23,
      totalPurchaseValue: 186750,
      lastPurchase: '2026-08-17',
      createdAt: '2026-06-18',
      status: 'active',
      notes: 'Large supplier with wide product range.',
    },
    {
      id: '6',
      name: 'Blue Nile Auto',
      contactPerson: 'Yonas Worku',
      phone: '+251 955 890 123',
      email: 'bluenile@example.com',
      address: 'Kebele 03, Bahir Dar',
      city: 'Bahir Dar',
      country: 'Ethiopia',
      productsSupplied: 9,
      purchaseCount: 4,
      totalPurchaseValue: 28600,
      lastPurchase: '2026-07-20',
      createdAt: '2026-06-12',
      status: 'inactive',
      notes: '',
    },
  ]);

  // ============================================================
  // STATE
  // ============================================================

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [viewingSupplier, setViewingSupplier] = useState(null);
  const [supplierToDelete, setSupplierToDelete] = useState(null);

  const [openMenuId, setOpenMenuId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    country: 'Ethiopia',
    notes: '',
    status: 'active',
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const [notification, setNotification] = useState(null);

  // ============================================================
  // LOCATIONS
  // ============================================================

  const locations = useMemo(() => {
    const uniqueCities = [
      ...new Set(
        suppliers
          .map((supplier) => supplier.city)
          .filter(Boolean)
      ),
    ];

    return uniqueCities.sort();
  }, [suppliers]);

  // ============================================================
  // FILTER SUPPLIERS
  // ============================================================

  const filteredSuppliers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return suppliers.filter((supplier) => {
      const matchesSearch =
        !query ||
        supplier.name.toLowerCase().includes(query) ||
        supplier.contactPerson.toLowerCase().includes(query) ||
        supplier.phone.toLowerCase().includes(query) ||
        supplier.email.toLowerCase().includes(query) ||
        supplier.city.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === 'all' ||
        supplier.status === statusFilter;

      const matchesLocation =
        locationFilter === 'all' ||
        supplier.city === locationFilter;

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

  const totalSuppliers = suppliers.length;

  const activeSuppliers = suppliers.filter(
    (supplier) => supplier.status === 'active'
  ).length;

  const inactiveSuppliers = suppliers.filter(
    (supplier) => supplier.status === 'inactive'
  ).length;

  const totalPurchaseValue = suppliers.reduce(
    (total, supplier) =>
      total + Number(supplier.totalPurchaseValue || 0),
    0
  );

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
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      country: 'Ethiopia',
      notes: '',
      status: 'active',
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
      name: supplier.name,
      contactPerson: supplier.contactPerson,
      phone: supplier.phone,
      email: supplier.email,
      address: supplier.address,
      city: supplier.city,
      country: supplier.country,
      notes: supplier.notes || '',
      status: supplier.status,
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
  // VALIDATION
  // ============================================================

  const validateForm = () => {
    const newErrors = {};

    const name = formData.name.trim();
    const contactPerson = formData.contactPerson.trim();
    const phone = formData.phone.trim();
    const email = formData.email.trim();
    const city = formData.city.trim();

    if (!name) {
      newErrors.name = 'Supplier name is required.';
    } else if (name.length < 2) {
      newErrors.name =
        'Supplier name must contain at least 2 characters.';
    } else if (name.length > 100) {
      newErrors.name =
        'Supplier name cannot exceed 100 characters.';
    }

    if (!contactPerson) {
      newErrors.contactPerson =
        'Contact person is required.';
    }

    if (!phone) {
      newErrors.phone =
        'Phone number is required.';
    }

    if (email) {
      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        newErrors.email =
          'Please enter a valid email address.';
      }
    }

    if (!city) {
      newErrors.city = 'City is required.';
    }

    const duplicate = suppliers.some(
      (supplier) =>
        supplier.name.toLowerCase() === name.toLowerCase() &&
        supplier.id !== editingSupplier?.id
    );

    if (duplicate) {
      newErrors.name =
        'A supplier with this name already exists.';
    }

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

    // Temporary API simulation
    await new Promise((resolve) =>
      setTimeout(resolve, 500)
    );

    const cleanData = {
      name: formData.name.trim(),
      contactPerson:
        formData.contactPerson.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      address: formData.address.trim(),
      city: formData.city.trim(),
      country: formData.country.trim(),
      notes: formData.notes.trim(),
      status: formData.status,
    };

    if (editingSupplier) {
      setSuppliers((previous) =>
        previous.map((supplier) =>
          supplier.id === editingSupplier.id
            ? {
                ...supplier,
                ...cleanData,
              }
            : supplier
        )
      );

      showNotification(
        'success',
        'Supplier updated successfully.'
      );
    } else {
      const newSupplier = {
        id: Date.now().toString(),
        ...cleanData,
        productsSupplied: 0,
        purchaseCount: 0,
        totalPurchaseValue: 0,
        lastPurchase: null,
        createdAt:
          new Date().toISOString().split('T')[0],
      };

      setSuppliers((previous) => [
        ...previous,
        newSupplier,
      ]);

      showNotification(
        'success',
        'Supplier created successfully.'
      );
    }

    setIsSaving(false);
    handleCloseModal();
  };

  // ============================================================
  // VIEW DETAILS
  // ============================================================

  const handleViewDetails = (supplier) => {
    setViewingSupplier(supplier);
    setOpenMenuId(null);
  };

  // ============================================================
  // TOGGLE STATUS
  // ============================================================

  const handleToggleStatus = (supplier) => {
    const newStatus =
      supplier.status === 'active'
        ? 'inactive'
        : 'active';

    setSuppliers((previous) =>
      previous.map((item) =>
        item.id === supplier.id
          ? {
              ...item,
              status: newStatus,
            }
          : item
      )
    );

    setOpenMenuId(null);

    showNotification(
      'success',
      `${supplier.name} has been ${
        newStatus === 'active'
          ? 'activated'
          : 'deactivated'
      }.`
    );
  };

  // ============================================================
  // DELETE
  // ============================================================

  const handleDelete = (supplier) => {
    setSupplierToDelete(supplier);
    setOpenMenuId(null);
  };

  const confirmDelete = () => {
    if (!supplierToDelete) return;

    if (supplierToDelete.purchaseCount > 0) {
      showNotification(
        'error',
        'This supplier has purchase history and should not be deleted.'
      );

      setSupplierToDelete(null);
      return;
    }

    setSuppliers((previous) =>
      previous.filter(
        (supplier) =>
          supplier.id !== supplierToDelete.id
      )
    );

    showNotification(
      'success',
      `${supplierToDelete.name} deleted successfully.`
    );

    setSupplierToDelete(null);
  };

  // ============================================================
  // FORMAT CURRENCY
  // ============================================================

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETB',
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  // ============================================================
  // FORMAT DATE
  // ============================================================

  const formatDate = (date) => {
    if (!date) return 'No purchases yet';

    return new Date(date).toLocaleDateString(
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

  const StatusBadge = ({ status }) => {
    const isActive = status === 'active';

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

        {isActive ? 'Active' : 'Inactive'}
      </span>
    );
  };

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
              onClick={() => setNotification(null)}
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

      <div className="mx-auto max-w-7x1 px-4 py-6 sm:px-6 lg:px-8">

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Suppliers
            </h1>

            <p className="mt-1 text-sm text-slate-500 sm:text-base">
              Manage supplier relationships, contact information,
              and purchasing activity.
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
            STATISTICS
        ====================================================== */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* Total Suppliers */}
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
                  Currently supplying
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

          {/* Purchase Value */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">

              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-500">
                  Purchase Value
                </p>

                <p className="mt-2 truncate text-2xl font-bold text-slate-900">
                  {formatCurrency(totalPurchaseValue)}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Total supplier purchases
                </p>
              </div>

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <FiDollarSign size={23} />
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================
            MAIN CARD
        ====================================================== */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm m-0">

          {/* Toolbar */}
          <div className="border-b border-slate-200 p-14 sm:p-5">

            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Supplier Directory
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  View and manage your supplier relationships.
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
                      setSearchTerm(event.target.value)
                    }
                    placeholder="Search suppliers..."
                    className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />

                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      <FiX size={17} />
                    </button>
                  )}
                </div>

                {/* Status Filter */}
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(event.target.value)
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

                {/* Location Filter */}
                <div className="relative">
                  <select
                    value={locationFilter}
                    onChange={(event) =>
                      setLocationFilter(event.target.value)
                    }
                    className="w-full appearance-none rounded-xl border border-slate-300 bg-white py-2.5 pl-3 pr-9 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:w-40"
                  >
                    <option value="all">
                      All Locations
                    </option>

                    {locations.map((location) => (
                      <option
                        key={location}
                        value={location}
                      >
                        {location}
                      </option>
                    ))}
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

            <table className="w-full min-w-[1050px]">

              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Supplier
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Contact
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Location
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Products
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Purchase Value
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

                {filteredSuppliers.map((supplier) => {

                  return (
                    <tr
                      key={supplier.id}
                      className="transition hover:bg-slate-50"
                    >

                      {/* Supplier */}
                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-900">
                              {supplier.name}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-500">
                              {supplier.contactPerson}
                            </p>
                          </div>

                        </div>

                      </td>

                      {/* Contact */}
                      <td className="px-5 py-4">

                        <div className="space-y-1">

                          <p className="flex items-center gap-2 text-sm text-slate-700">
                            <FiPhone
                              size={13}
                              className="text-slate-400"
                            />
                            {supplier.phone}
                          </p>

                          <p className="flex max-w-[210px] items-center gap-2 truncate text-xs text-slate-500">
                            <FiMail
                              size={13}
                              className="shrink-0 text-slate-400"
                            />
                            <span className="truncate">
                              {supplier.email || 'No email'}
                            </span>
                          </p>

                        </div>

                      </td>

                      {/* Location */}
                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2">

                          <FiMapPin
                            size={15}
                            className="text-slate-400"
                          />

                          <div>
                            <p className="text-sm font-medium text-slate-700">
                              {supplier.city}
                            </p>

                            <p className="text-xs text-slate-400">
                              {supplier.country}
                            </p>
                          </div>

                        </div>

                      </td>

                      {/* Products */}
                      <td className="px-5 py-4">

                        <div className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-2.5 py-1.5">

                          <span className="text-sm font-semibold text-slate-700">
                            {supplier.productsSupplied}
                          </span>

                        </div>

                      </td>

                      {/* Purchase Value */}
                      <td className="px-5 py-4">

                        <p className="text-sm font-semibold text-slate-800">
                          {formatCurrency(
                            supplier.totalPurchaseValue
                          )}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400">
                          {supplier.purchaseCount} purchases
                        </p>

                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <StatusBadge
                          status={supplier.status}
                        />
                      </td>

                      {/* Actions */}
                      <td className="relative px-5 py-4">

                        <div className="flex justify-end">

                          <button
                            onClick={() =>
                              setOpenMenuId(
                                openMenuId === supplier.id
                                  ? null
                                  : supplier.id
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                            title="More actions"
                          >
                            <FiMoreVertical size={18} />
                          </button>

                          {openMenuId === supplier.id && (
                            <ActionMenu
                              supplier={supplier}
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
                  );
                })}

              </tbody>

            </table>
          </div>

          {/* ====================================================
              MOBILE CARDS
          ==================================================== */}

          <div className="divide-y divide-slate-100 md:hidden">

            {filteredSuppliers.map((supplier) => (

              <div
                key={supplier.id}
                className="p-4"
              >

                <div className="flex items-start justify-between gap-3">

                  <div className="flex min-w-0 items-center gap-3">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <FiBriefcase size={19} />
                    </div>

                    <div className="min-w-0">

                      <h3 className="truncate font-semibold text-slate-900">
                        {supplier.name}
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        {supplier.contactPerson}
                      </p>

                    </div>

                  </div>

                  <div className="relative">

                    <button
                      onClick={() =>
                        setOpenMenuId(
                          openMenuId === supplier.id
                            ? null
                            : supplier.id
                        )
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    >
                      <FiMoreVertical size={18} />
                    </button>

                    {openMenuId === supplier.id && (
                      <ActionMenu
                        supplier={supplier}
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

                <div className="mt-4 grid grid-cols-2 gap-3">

                  <div className="rounded-xl bg-slate-50 p-3">

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <FiPhone size={13} />
                      Contact
                    </div>

                    <p className="mt-1 truncate text-sm font-medium text-slate-700">
                      {supplier.phone}
                    </p>

                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <FiMapPin size={13} />
                      Location
                    </div>

                    <p className="mt-1 truncate text-sm font-medium text-slate-700">
                      {supplier.city}
                    </p>

                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <FiShoppingBag size={13} />
                      Products
                    </div>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {supplier.productsSupplied}
                    </p>

                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <FiDollarSign size={13} />
                      Purchases
                    </div>

                    <p className="mt-1 truncate text-sm font-semibold text-slate-700">
                      {formatCurrency(
                        supplier.totalPurchaseValue
                      )}
                    </p>

                  </div>

                </div>

                <div className="mt-4 flex items-center justify-between">

                  <StatusBadge
                    status={supplier.status}
                  />

                  <span className="text-xs text-slate-400">
                    Last purchase:{' '}
                    {formatDate(
                      supplier.lastPurchase
                    )}
                  </span>

                </div>

              </div>

            ))}

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
                  : 'Add your first supplier to start managing supplier relationships.'}
              </p>

              {!searchTerm &&
                statusFilter === 'all' &&
                locationFilter === 'all' && (
                  <button
                    onClick={handleOpenCreate}
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
                    ? 'Update supplier information and contact details.'
                    : 'Add a supplier to your SpareFlow supplier directory.'}
                </p>
              </div>

              <button
                onClick={handleCloseModal}
                disabled={isSaving}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
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
                  error={errors.name}
                  className="sm:col-span-2"
                >
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Auto Parts Ethiopia"
                    className={inputClass(
                      errors.name
                    )}
                  />
                </FormField>

                {/* Contact Person */}
                <FormField
                  label="Contact Person"
                  required
                  error={errors.contactPerson}
                >
                  <div className="relative">
                    <FiUser
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      size={16}
                    />

                    <input
                      name="contactPerson"
                      value={
                        formData.contactPerson
                      }
                      onChange={handleChange}
                      placeholder="e.g. Abebe Kebede"
                      className={`${inputClass(
                        errors.contactPerson
                      )} pl-10`}
                    />
                  </div>
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
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+251 9XX XXX XXX"
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
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="supplier@example.com"
                      className={`${inputClass(
                        errors.email
                      )} pl-10`}
                    />
                  </div>
                </FormField>

                {/* City */}
                <FormField
                  label="City"
                  required
                  error={errors.city}
                >
                  <div className="relative">
                    <FiMapPin
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      size={16}
                    />

                    <input
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. Addis Ababa"
                      className={`${inputClass(
                        errors.city
                      )} pl-10`}
                    />
                  </div>
                </FormField>

                {/* Country */}
                <FormField label="Country">
                  <input
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={inputClass()}
                  />
                </FormField>

                {/* Address */}
                <FormField
                  label="Address"
                  className="sm:col-span-2"
                >
                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Street, area, building..."
                    className={inputClass()}
                  />
                </FormField>

                {/* Status */}
                <FormField
                  label="Supplier Status"
                >
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
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

                {/* Notes */}
                <FormField
                  label="Notes"
                  className="sm:col-span-2"
                >
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Additional supplier notes..."
                    className={`${inputClass()} resize-none`}
                  />
                </FormField>

              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={handleCloseModal}
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
                    <FiBriefcase size={25} />
                  </div>

                  <div>

                    <div className="flex flex-wrap items-center gap-2">

                      <h2 className="text-xl font-bold text-slate-900">
                        {viewingSupplier.name}
                      </h2>

                      <StatusBadge
                        status={
                          viewingSupplier.status
                        }
                      />

                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                      {viewingSupplier.contactPerson}
                    </p>

                  </div>

                </div>

                <button
                  onClick={() =>
                    setViewingSupplier(null)
                  }
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <FiX size={20} />
                </button>

              </div>

            </div>

            {/* Details */}
            <div className="p-6">

              {/* Overview */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

                <DetailStat
                  icon={<FiShoppingBag />}
                  label="Products"
                  value={
                    viewingSupplier.productsSupplied
                  }
                />

                <DetailStat
                  icon={<FiTruck />}
                  label="Purchases"
                  value={
                    viewingSupplier.purchaseCount
                  }
                />

                <DetailStat
                  icon={<FiDollarSign />}
                  label="Purchase Value"
                  value={formatCurrency(
                    viewingSupplier.totalPurchaseValue
                  )}
                />

                <DetailStat
                  icon={<FiCalendar />}
                  label="Last Purchase"
                  value={formatDate(
                    viewingSupplier.lastPurchase
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
                      icon={<FiUser />}
                      label="Contact Person"
                      value={
                        viewingSupplier.contactPerson
                      }
                    />

                    <InfoRow
                      icon={<FiPhone />}
                      label="Phone"
                      value={
                        viewingSupplier.phone
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
                    Location
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
                      icon={<FiMapPin />}
                      label="City"
                      value={
                        viewingSupplier.city
                      }
                    />

                    <InfoRow
                      icon={<FiMapPin />}
                      label="Country"
                      value={
                        viewingSupplier.country
                      }
                    />

                  </div>

                </div>

              </div>

              {/* Notes */}
              {viewingSupplier.notes && (
                <div className="mt-6 rounded-2xl border border-slate-200 p-5">

                  <h3 className="font-semibold text-slate-900">
                    Notes
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {viewingSupplier.notes}
                  </p>

                </div>
              )}

              {/* Footer */}
              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-between">

                <p className="text-xs text-slate-400">
                  Supplier added{' '}
                  {formatDate(
                    viewingSupplier.createdAt
                  )}
                </p>

                <div className="flex gap-3">

                  <button
                    onClick={() => {
                      setViewingSupplier(null);
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
                    onClick={() =>
                      setViewingSupplier(null)
                    }
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
                {supplierToDelete.name}
              </span>
              ?

            </p>

            {supplierToDelete.purchaseCount > 0 && (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3">

                <p className="text-sm leading-5 text-amber-800">

                  This supplier has{' '}

                  <strong>
                    {supplierToDelete.purchaseCount}
                  </strong>{' '}

                  recorded purchases. For data integrity,
                  suppliers with purchase history should
                  normally be deactivated instead of deleted.

                </p>

              </div>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

              <button
                onClick={() =>
                  setSupplierToDelete(null)
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
        onClick={() => onView(supplier)}
        className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50"
      >
        <FiEye size={16} />
        View Details
      </button>

      <button
        onClick={() => onEdit(supplier)}
        className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50"
      >
        <FiEdit2 size={16} />
        Edit Supplier
      </button>

      <button
        onClick={() => onToggle(supplier)}
        className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50"
      >
        <FiPower size={16} />

        {supplier.status === 'active'
          ? 'Deactivate'
          : 'Activate'}
      </button>

      <div className="my-1 border-t border-slate-100" />

      <button
        onClick={() => onDelete(supplier)}
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

const inputClass = (hasError = false) => {
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

      <p className="mt-2 truncate text-base font-bold text-slate-900">
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

export default Suppliers;