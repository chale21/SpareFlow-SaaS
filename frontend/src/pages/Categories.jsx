import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiX,
  FiFolder,
  FiPackage,
  FiMoreVertical,
  FiAlertCircle,
  FiCheckCircle,
  FiEye,
  FiPower,
  FiCalendar,
  FiRefreshCw,
  FiLayers,
} from 'react-icons/fi';

const Categories = () => {
  // ============================================================
  // TEMPORARY DATA
  // Replace later with categoryService.getCategories()
  // ============================================================

  const [categories, setCategories] = useState([
    {
      id: '1',
      name: 'Engine Parts',
      description: 'Engine components and replacement parts',
      productCount: 24,
      status: 'active',
      createdAt: '2026-08-01',
      updatedAt: '2026-08-10',
    },
    {
      id: '2',
      name: 'Brake System',
      description: 'Brake pads, discs, calipers and related parts',
      productCount: 18,
      status: 'active',
      createdAt: '2026-08-02',
      updatedAt: '2026-08-09',
    },
    {
      id: '3',
      name: 'Electrical',
      description: 'Electrical and electronic vehicle components',
      productCount: 16,
      status: 'active',
      createdAt: '2026-08-03',
      updatedAt: '2026-08-08',
    },
    {
      id: '4',
      name: 'Suspension',
      description: 'Suspension and steering components',
      productCount: 12,
      status: 'active',
      createdAt: '2026-08-04',
      updatedAt: '2026-08-07',
    },
    {
      id: '5',
      name: 'Filters',
      description: 'Oil, air, fuel and cabin filters',
      productCount: 9,
      status: 'inactive',
      createdAt: '2026-08-05',
      updatedAt: '2026-08-06',
    },
    {
      id: '6',
      name: 'Lubricants',
      description: 'Engine oils, transmission fluids and lubricants',
      productCount: 14,
      status: 'active',
      createdAt: '2026-08-06',
      updatedAt: '2026-08-06',
    },
  ]);

  // ============================================================
  // STATE
  // ============================================================

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [editingCategory, setEditingCategory] = useState(null);
  const [viewingCategory, setViewingCategory] = useState(null);

  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [categoryToToggle, setCategoryToToggle] = useState(null);

  const [openMenuId, setOpenMenuId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const [notification, setNotification] = useState(null);

  const menuRef = useRef(null);

  // ============================================================
  // CLOSE ACTION MENU WHEN CLICKING OUTSIDE
  // ============================================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
    };
  }, []);

  // ============================================================
  // SEARCH + FILTER
  // ============================================================

  const filteredCategories = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return categories.filter((category) => {
      const matchesSearch =
        !query ||
        category.name.toLowerCase().includes(query) ||
        category.description.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === 'all' ||
        category.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [categories, searchTerm, statusFilter]);

  // ============================================================
  // STATISTICS
  // ============================================================

  const totalCategories = categories.length;

  const activeCategories = categories.filter(
    (category) => category.status === 'active'
  ).length;

  const inactiveCategories = categories.filter(
    (category) => category.status === 'inactive'
  ).length;

  const totalProducts = categories.reduce(
    (total, category) => total + category.productCount,
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
    }, 3500);
  };

  // ============================================================
  // CREATE
  // ============================================================

  const handleOpenCreate = () => {
    setEditingCategory(null);

    setFormData({
      name: '',
      description: '',
    });

    setErrors({});
    setOpenMenuId(null);
    setIsModalOpen(true);
  };

  // ============================================================
  // EDIT
  // ============================================================

  const handleOpenEdit = (category) => {
    setEditingCategory(category);

    setFormData({
      name: category.name,
      description: category.description,
    });

    setErrors({});
    setOpenMenuId(null);
    setIsModalOpen(true);
  };

  // ============================================================
  // VIEW
  // ============================================================

  const handleView = (category) => {
    setViewingCategory(category);
    setOpenMenuId(null);
    setIsViewModalOpen(true);
  };

  // ============================================================
  // CLOSE CREATE / EDIT MODAL
  // ============================================================

  const handleCloseModal = () => {
    if (isSaving) return;

    setIsModalOpen(false);
    setEditingCategory(null);

    setFormData({
      name: '',
      description: '',
    });

    setErrors({});
  };

  // ============================================================
  // FORM INPUT
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

    const categoryName = formData.name.trim();

    if (!categoryName) {
      newErrors.name = 'Category name is required.';
    } else if (categoryName.length < 2) {
      newErrors.name =
        'Category name must contain at least 2 characters.';
    } else if (categoryName.length > 100) {
      newErrors.name =
        'Category name cannot exceed 100 characters.';
    }

    const duplicate = categories.some(
      (category) =>
        category.name.toLowerCase() ===
          categoryName.toLowerCase() &&
        category.id !== editingCategory?.id
    );

    if (duplicate) {
      newErrors.name =
        'A category with this name already exists.';
    }

    if (formData.description.length > 500) {
      newErrors.description =
        'Description cannot exceed 500 characters.';
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
      setTimeout(resolve, 600)
    );

    const cleanName = formData.name.trim();
    const cleanDescription = formData.description.trim();

    if (editingCategory) {
      setCategories((previous) =>
        previous.map((category) =>
          category.id === editingCategory.id
            ? {
                ...category,
                name: cleanName,
                description: cleanDescription,
                updatedAt: new Date()
                  .toISOString()
                  .split('T')[0],
              }
            : category
        )
      );

      showNotification(
        'success',
        'Category updated successfully.'
      );
    } else {
      const newCategory = {
        id: Date.now().toString(),
        name: cleanName,
        description: cleanDescription,
        productCount: 0,
        status: 'active',
        createdAt: new Date()
          .toISOString()
          .split('T')[0],
        updatedAt: new Date()
          .toISOString()
          .split('T')[0],
      };

      setCategories((previous) => [
        ...previous,
        newCategory,
      ]);

      showNotification(
        'success',
        'Category created successfully.'
      );
    }

    setIsSaving(false);
    handleCloseModal();
  };

  // ============================================================
  // DELETE
  // ============================================================

  const handleDelete = (category) => {
    setCategoryToDelete(category);
    setOpenMenuId(null);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    /*
      IMPORTANT:
      The real backend should prevent deletion if products
      still belong to this category.
    */

    if (categoryToDelete.productCount > 0) {
      showNotification(
        'error',
        'This category cannot be deleted while products are assigned to it.'
      );

      setCategoryToDelete(null);
      return;
    }

    setCategories((previous) =>
      previous.filter(
        (category) =>
          category.id !== categoryToDelete.id
      )
    );

    showNotification(
      'success',
      `${categoryToDelete.name} deleted successfully.`
    );

    setCategoryToDelete(null);
  };

  // ============================================================
  // ACTIVATE / DEACTIVATE
  // ============================================================

  const handleToggleStatus = (category) => {
    setCategoryToToggle(category);
    setOpenMenuId(null);
  };

  const confirmToggleStatus = async () => {
    if (!categoryToToggle) return;

    const newStatus =
      categoryToToggle.status === 'active'
        ? 'inactive'
        : 'active';

    setCategories((previous) =>
      previous.map((category) =>
        category.id === categoryToToggle.id
          ? {
              ...category,
              status: newStatus,
              updatedAt: new Date()
                .toISOString()
                .split('T')[0],
            }
          : category
      )
    );

    showNotification(
      'success',
      `${categoryToToggle.name} has been ${
        newStatus === 'active'
          ? 'activated'
          : 'deactivated'
      }.`
    );

    setCategoryToToggle(null);
  };

  // ============================================================
  // DATE FORMAT
  // ============================================================

  const formatDate = (date) => {
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
  // RESET FILTERS
  // ============================================================

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ========================================================
          NOTIFICATION
      ======================================================== */}

      {notification && (
        <div className="fixed right-4 top-4 z-[100] max-w-sm">
          <div
            className={`flex items-start gap-3 rounded-xl border bg-white px-4 py-3 shadow-xl ${
              notification.type === 'success'
                ? 'border-emerald-200'
                : 'border-red-200'
            }`}
          >
            {notification.type === 'success' ? (
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

            <span
              className={`text-sm font-medium ${
                notification.type === 'success'
                  ? 'text-emerald-700'
                  : 'text-red-700'
              }`}
            >
              {notification.message}
            </span>

            <button
              onClick={() => setNotification(null)}
              className="ml-auto text-slate-400 hover:text-slate-700"
            >
              <FiX size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          PAGE
      ======================================================== */}

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
           
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Category Management
            </h1>

            <p className="mt-1 text-sm text-slate-500 sm:text-base">
              Organize and manage your spare parts categories.
            </p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <FiPlus size={18} />
            Add Category
          </button>
        </div>

        {/* ======================================================
            STATISTICS
        ====================================================== */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* Total */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Categories
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {totalCategories}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  All categories
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FiFolder size={21} />
              </div>
            </div>
          </div>

          {/* Active */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Active
                </p>

                <p className="mt-2 text-3xl font-bold text-emerald-600">
                  {activeCategories}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Available categories
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <FiCheckCircle size={21} />
              </div>
            </div>
          </div>

          {/* Inactive */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Inactive
                </p>

                <p className="mt-2 text-3xl font-bold text-amber-600">
                  {inactiveCategories}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Disabled categories
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <FiPower size={21} />
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Products
                </p>

                <p className="mt-2 text-3xl font-bold text-violet-600">
                  {totalProducts}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Categorized products
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <FiPackage size={21} />
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================
            MAIN CARD
        ====================================================== */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* ====================================================
              TOOLBAR
          ==================================================== */}

          <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">

           

            <div className="flex flex-col gap-3 sm:flex-row">

              {/* Search */}
              <div className="relative w-full sm:w-72">
                <FiSearch
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                  placeholder="Search categories..."
                  className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />

                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    <FiX size={16} />
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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
            </div>
          </div>

          {/* ====================================================
              DESKTOP TABLE
          ==================================================== */}

          <div className="hidden overflow-x-auto md:block">

            <table className="w-full min-w-[850px]">

              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Category
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Description
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Products
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Created
                  </th>

                  <th className="w-16 px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">

                {filteredCategories.map((category) => (
                  <tr
                    key={category.id}
                    className="group transition hover:bg-slate-50/80"
                  >

                    {/* Category */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">

                       

                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900">
                            {category.name}
                          </p>

                          
                        </div>

                      </div>
                    </td>

                    {/* Description */}
                    <td className="max-w-xs px-5 py-4">
                      <p className="truncate text-sm text-slate-600">
                        {category.description ||
                          'No description'}
                      </p>
                    </td>

                    {/* Products */}
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-sm font-semibold text-slate-700">
                        {category.productCount}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      {category.status === 'active' ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                          Inactive
                        </span>
                      )}
                    </td>

                    {/* Created */}
                    <td className="px-5 py-4 text-sm text-slate-500">
                      {formatDate(category.createdAt)}
                    </td>

                    {/* Three Dot Menu */}
                    <td className="px-5 py-4 text-right">

                      <div
                        className="relative inline-block"
                        ref={
                          openMenuId === category.id
                            ? menuRef
                            : null
                        }
                      >

                        <button
                          onClick={() =>
                            setOpenMenuId(
                              openMenuId === category.id
                                ? null
                                : category.id
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                          title="More actions"
                        >
                          <FiMoreVertical size={18} />
                        </button>

                        {openMenuId === category.id && (
                          <div className="absolute right-0 top-11 z-30 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 text-left shadow-xl">

                            <button
                              onClick={() =>
                                handleView(category)
                              }
                              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                            >
                              <FiEye size={16} />
                              View Details
                            </button>

                            <button
                              onClick={() =>
                                handleOpenEdit(category)
                              }
                              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                            >
                              <FiEdit2 size={16} />
                              Edit Category
                            </button>

                            <button
                              onClick={() =>
                                handleToggleStatus(category)
                              }
                              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                            >
                              <FiPower size={16} />

                              {category.status ===
                              'active'
                                ? 'Deactivate'
                                : 'Activate'}
                            </button>

                            <div className="my-1 border-t border-slate-100" />

                            <button
                              onClick={() =>
                                handleDelete(category)
                              }
                              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                            >
                              <FiTrash2 size={16} />
                              Delete Category
                            </button>

                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>

          {/* ====================================================
              MOBILE CARDS
          ==================================================== */}

          <div className="divide-y divide-slate-100 md:hidden">

            {filteredCategories.map((category) => (
              <div
                key={category.id}
                className="p-4"
              >

                <div className="flex items-start justify-between gap-3">

                  <div className="flex min-w-0 items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <FiFolder size={18} />
                    </div>

                    <div className="min-w-0">

                      <h3 className="truncate font-semibold text-slate-900">
                        {category.name}
                      </h3>

                      <p className="mt-1 truncate text-xs text-slate-500">
                        {category.description ||
                          'No description'}
                      </p>

                    </div>
                  </div>

                  {/* Mobile Three Dot */}
                  <div
                    className="relative shrink-0"
                    ref={
                      openMenuId === category.id
                        ? menuRef
                        : null
                    }
                  >

                    <button
                      onClick={() =>
                        setOpenMenuId(
                          openMenuId === category.id
                            ? null
                            : category.id
                        )
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                    >
                      <FiMoreVertical size={18} />
                    </button>

                    {openMenuId === category.id && (
                      <div className="absolute right-0 top-10 z-30 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl">

                        <button
                          onClick={() =>
                            handleView(category)
                          }
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <FiEye size={16} />
                          View Details
                        </button>

                        <button
                          onClick={() =>
                            handleOpenEdit(category)
                          }
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <FiEdit2 size={16} />
                          Edit Category
                        </button>

                        <button
                          onClick={() =>
                            handleToggleStatus(category)
                          }
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <FiPower size={16} />

                          {category.status === 'active'
                            ? 'Deactivate'
                            : 'Activate'}
                        </button>

                        <div className="my-1 border-t border-slate-100" />

                        <button
                          onClick={() =>
                            handleDelete(category)
                          }
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                        >
                          <FiTrash2 size={16} />
                          Delete Category
                        </button>

                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3">

                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                    <FiPackage size={13} />
                    {category.productCount} products
                  </span>

                  {category.status === 'active' ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                      Inactive
                    </span>
                  )}

                  <span className="text-xs text-slate-400">
                    {formatDate(category.createdAt)}
                  </span>

                </div>
              </div>
            ))}
          </div>

          {/* ====================================================
              EMPTY STATE
          ==================================================== */}

          {filteredCategories.length === 0 && (
            <div className="px-6 py-16 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <FiFolder size={25} />
              </div>

              <h3 className="mt-4 text-base font-semibold text-slate-900">
                No categories found
              </h3>

              <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try changing your search or filter.'
                  : 'Create your first category to organize your products.'}
              </p>

              {(searchTerm ||
                statusFilter !== 'all') && (
                <button
                  onClick={resetFilters}
                  className="mt-5 inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <FiRefreshCw size={16} />
                  Reset Filters
                </button>
              )}

              {!searchTerm &&
                statusFilter === 'all' && (
                  <button
                    onClick={handleOpenCreate}
                    className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    <FiPlus size={17} />
                    Add Category
                  </button>
                )}
            </div>
          )}

          {/* ====================================================
              FOOTER
          ==================================================== */}

          {filteredCategories.length > 0 && (
            <div className="border-t border-slate-200 bg-slate-50 px-5 py-4">
              <p className="text-sm text-slate-500">
                Showing{' '}
                <span className="font-semibold text-slate-700">
                  {filteredCategories.length}
                </span>{' '}
                of{' '}
                <span className="font-semibold text-slate-700">
                  {categories.length}
                </span>{' '}
                categories
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================
          CREATE / EDIT MODAL
      ======================================================== */}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">

          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingCategory
                    ? 'Edit Category'
                    : 'Add Category'}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {editingCategory
                    ? 'Update the category information.'
                    : 'Create a category for your spare parts.'}
                </p>
              </div>

              <button
                onClick={handleCloseModal}
                disabled={isSaving}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
              >
                <FiX size={20} />
              </button>

            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >

              {/* Name */}
              <div>

                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Category Name
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Engine Parts"
                  className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                    errors.name
                      ? 'border-red-400 focus:ring-2 focus:ring-red-100'
                      : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                  }`}
                />

                {errors.name && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-red-600">
                    <FiAlertCircle size={14} />
                    {errors.name}
                  </div>
                )}

              </div>

              {/* Description */}
              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label
                    htmlFor="description"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Description
                  </label>

                  <span className="text-xs text-slate-400">
                    {formData.description.length}/500
                  </span>

                </div>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe the products in this category..."
                  className={`w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition ${
                    errors.description
                      ? 'border-red-400 focus:ring-2 focus:ring-red-100'
                      : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                  }`}
                />

                {errors.description && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-red-600">
                    <FiAlertCircle size={14} />
                    {errors.description}
                  </div>
                )}

              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isSaving}
                  className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {isSaving && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  )}

                  {editingCategory
                    ? 'Update Category'
                    : 'Create Category'}

                </button>

              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          VIEW CATEGORY MODAL
      ======================================================== */}

      {isViewModalOpen && viewingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">

          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FiFolder size={21} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    {viewingCategory.name}
                  </h2>

                  <p className="text-xs text-slate-400">
                    Category Details
                  </p>
                </div>

              </div>

              <button
                onClick={() =>
                  setIsViewModalOpen(false)
                }
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <FiX size={20} />
              </button>

            </div>

            {/* Details */}
            <div className="space-y-5 p-6">

              {/* Status */}
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">

                <div>
                  <p className="text-xs font-medium text-slate-400">
                    Status
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {viewingCategory.status ===
                    'active'
                      ? 'Active'
                      : 'Inactive'}
                  </p>
                </div>

                {viewingCategory.status ===
                'active' ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
                    Inactive
                  </span>
                )}

              </div>

              {/* Description */}
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Description
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {viewingCategory.description ||
                    'No description provided.'}
                </p>
              </div>

              {/* Product Count */}
              <div className="grid grid-cols-2 gap-3">

                <div className="rounded-xl border border-slate-200 p-4">

                  <div className="flex items-center gap-2 text-slate-400">
                    <FiPackage size={16} />
                    <span className="text-xs font-medium">
                      Products
                    </span>
                  </div>

                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {viewingCategory.productCount}
                  </p>

                </div>

                <div className="rounded-xl border border-slate-200 p-4">

                  <div className="flex items-center gap-2 text-slate-400">
                    <FiCalendar size={16} />
                    <span className="text-xs font-medium">
                      Created
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {formatDate(
                      viewingCategory.createdAt
                    )}
                  </p>

                </div>

              </div>

              {/* Metadata */}
              <div className="border-t border-slate-100 pt-4">

                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">
                    Category ID
                  </span>

                  <span className="font-medium text-slate-700">
                    {viewingCategory.id}
                  </span>
                </div>

                <div className="mt-3 flex justify-between text-sm">
                  <span className="text-slate-400">
                    Last Updated
                  </span>

                  <span className="font-medium text-slate-700">
                    {formatDate(
                      viewingCategory.updatedAt
                    )}
                  </span>
                </div>

              </div>

              {/* Close */}
              <div className="flex justify-end border-t border-slate-100 pt-5">

                <button
                  onClick={() =>
                    setIsViewModalOpen(false)
                  }
                  className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Close
                </button>

              </div>

            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          DELETE CONFIRMATION
      ======================================================== */}

      {categoryToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              <FiTrash2 size={21} />
            </div>

            <h2 className="mt-4 text-lg font-bold text-slate-900">
              Delete Category?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">

              Are you sure you want to delete{' '}

              <span className="font-semibold text-slate-700">
                {categoryToDelete.name}
              </span>
              ?

            </p>

            {categoryToDelete.productCount > 0 && (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3">

                <div className="flex gap-2">

                  <FiAlertCircle
                    className="mt-0.5 shrink-0 text-amber-600"
                    size={17}
                  />

                  <p className="text-sm leading-5 text-amber-800">

                    This category contains{' '}

                    <strong>
                      {categoryToDelete.productCount}
                    </strong>{' '}

                    products. In the real system, the backend
                    should prevent deletion until those products
                    are reassigned.

                  </p>

                </div>

              </div>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

              <button
                onClick={() =>
                  setCategoryToDelete(null)
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
                Delete Category
              </button>

            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          ACTIVATE / DEACTIVATE CONFIRMATION
      ======================================================== */}

      {categoryToToggle && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <FiPower size={21} />
            </div>

            <h2 className="mt-4 text-lg font-bold text-slate-900">

              {categoryToToggle.status === 'active'
                ? 'Deactivate Category?'
                : 'Activate Category?'}

            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">

              Are you sure you want to{' '}

              {categoryToToggle.status === 'active'
                ? 'deactivate'
                : 'activate'}{' '}

              <span className="font-semibold text-slate-700">
                {categoryToToggle.name}
              </span>
              ?

            </p>

            {categoryToToggle.status ===
              'active' && (
              <div className="mt-4 rounded-xl bg-amber-50 p-3 text-sm leading-5 text-amber-800">

                Deactivated categories should no longer be
                available when creating or assigning new
                products.

              </div>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

              <button
                onClick={() =>
                  setCategoryToToggle(null)
                }
                className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={confirmToggleStatus}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <FiPower size={16} />

                {categoryToToggle.status === 'active'
                  ? 'Deactivate'
                  : 'Activate'}

              </button>

            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;