import React, { useEffect, useMemo, useRef, useState,useCallback} from 'react';
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
import categoryService from '../services/categoryService';

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

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const [notification, setNotification] = useState(null);
  const menuRef = useRef(null);

  // ============================================================
  // NORMALIZE CATEGORY
  // ============================================================

  const normalizeCategory = useCallback((category) => {
    return {
      ...category,

      id:
        category?._id ??
        category?.id ??
        '',

      name:
        category?.categoryName ??
        category?.name ??
        '',

      description:
        category?.description ??
        '',

      status:
        category?.isActive === false
          ? 'inactive'
          : category?.status === 'inactive'
          ? 'inactive'
          : 'active',

      productCount:
        Number(
          category?.productCount ??
          category?.productsCount ??
          0
        ),
    };
  }, []);

  // ============================================================
  // LOAD CATEGORIES
  // ============================================================

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
const response = await categoryService.getCategories();
      const normalized = Array.isArray(response.data)
        ? response.data.map(normalizeCategory)
        : [];

      setCategories(normalized);
    } catch (err) {
      console.error(
        'Failed to load categories:',
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to load categories.'
      );

      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [normalizeCategory]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // ============================================================
  // CLOSE MENU WHEN CLICKING OUTSIDE
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
  // FILTER
  // ============================================================

  const filteredCategories = useMemo(() => {
    const query = searchTerm
      .trim()
      .toLowerCase();

    return categories.filter((category) => {
      const name =
        category.name?.toLowerCase() || '';

      const description =
        category.description?.toLowerCase() || '';

      const matchesSearch =
        !query ||
        name.includes(query) ||
        description.includes(query);

      const matchesStatus =
        statusFilter === 'all' ||
        category.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    categories,
    searchTerm,
    statusFilter,
  ]);

  // ============================================================
  // STATISTICS
  // ============================================================

  const totalCategories =
    categories.length;

  const activeCategories =
    categories.filter(
      (category) =>
        category.status === 'active'
    ).length;

  const inactiveCategories =
    categories.filter(
      (category) =>
        category.status === 'inactive'
    ).length;

  const totalProducts =
    categories.reduce(
      (total, category) =>
        total +
        Number(category.productCount || 0),
      0
    );

  // ============================================================
  // FORM RESET
  // ============================================================

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
    });

    setErrors({});
  };

  // ============================================================
  // OPEN CREATE
  // ============================================================

  const handleOpenCreate = () => {
    setEditingCategory(null);
    resetForm();
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  // ============================================================
  // OPEN EDIT
  // ============================================================

  const handleOpenEdit = (category) => {
    setEditingCategory(category);

    setFormData({
      name: category.name || '',
      description:
        category.description || '',
    });

    setErrors({});
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  // ============================================================
  // VIEW
  // ============================================================

  const handleView = (category) => {
    setViewingCategory(category);
    setIsViewModalOpen(true);
    setOpenMenuId(null);
  };

  // ============================================================
  // VALIDATION
  // ============================================================

  const validateForm = () => {
    const newErrors = {};

    const name =
      formData.name.trim();

    const description =
      formData.description.trim();

    if (!name) {
      newErrors.name =
        'Category name is required.';
    } else if (name.length < 2) {
      newErrors.name =
        'Category name must contain at least 2 characters.';
    } else if (name.length > 100) {
      newErrors.name =
        'Category name cannot exceed 100 characters.';
    }

    if (description.length > 500) {
      newErrors.description =
        'Description cannot exceed 500 characters.';
    }

    const duplicate =
      categories.some((category) => {
        const sameName =
          category.name
            ?.trim()
            .toLowerCase() ===
          name.toLowerCase();

        const differentId =
          category.id !==
          editingCategory?.id;

        return (
          sameName &&
          differentId
        );
      });

    if (duplicate) {
      newErrors.name =
        'A category with this name already exists.';
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
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
      const payload = {
        categoryName:
          formData.name.trim(),

        description:
          formData.description.trim(),
      };

      if (editingCategory) {
        await categoryService.updateCategory(
          editingCategory.id,
          payload
        );

        showNotification(
          'success',
          'Category updated successfully.'
        );
      } else {
        await categoryService.createCategory(
          payload
        );

        showNotification(
          'success',
          'Category created successfully.'
        );
      }

      setIsModalOpen(false);
      setEditingCategory(null);
      resetForm();

      await loadCategories();
    } catch (err) {
      console.error(
        'Failed to save category:',
        err
      );

      showNotification(
        'error',
        err?.response?.data?.message ||
          err?.message ||
          'Failed to save category.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  // ============================================================
  // DELETE
  // ============================================================

  const handleDelete = (category) => {
    setCategoryToDelete(category);
    setOpenMenuId(null);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) {
      return;
    }

    setIsSaving(true);

    try {
      await categoryService.deleteCategory(
        categoryToDelete.id
      );

      showNotification(
        'success',
        `${categoryToDelete.name} deleted successfully.`
      );

      setCategoryToDelete(null);

      await loadCategories();
    } catch (err) {
      console.error(
        'Failed to delete category:',
        err
      );

      showNotification(
        'error',
        err?.response?.data?.message ||
          err?.message ||
          'Failed to delete category.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  // ============================================================
  // TOGGLE ACTIVE STATUS
  // ============================================================

  const handleToggleStatus = (category) => {
    setCategoryToToggle(category);
    setOpenMenuId(null);
  };

  const confirmToggleStatus = async () => {
    if (!categoryToToggle) {
      return;
    }

    const isCurrentlyActive =
      categoryToToggle.status === 'active';

    setIsSaving(true);

    try {
      await categoryService.updateCategory(
        categoryToToggle.id,
        {
          categoryName:
            categoryToToggle.name,

          description:
            categoryToToggle.description || '',

          isActive:
            !isCurrentlyActive,
        }
      );

      showNotification(
        'success',
        `${categoryToToggle.name} has been ${
          isCurrentlyActive
            ? 'deactivated'
            : 'activated'
        }.`
      );

      setCategoryToToggle(null);

      await loadCategories();
    } catch (err) {
      console.error(
        'Failed to update category status:',
        err
      );

      showNotification(
        'error',
        err?.response?.data?.message ||
          err?.message ||
          'Failed to update category status.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  // ============================================================
  // FORMAT DATE
  // ============================================================

  const formatDate = (date) => {
    if (!date) {
      return '-';
    }

    const parsed =
      new Date(date);

    if (
      Number.isNaN(parsed.getTime())
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

      {/* ======================================================
          NOTIFICATION
      ====================================================== */}

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

        {/* HEADER */}

        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Category Management
            </h1>

            <p className="mt-1 text-sm text-slate-500 sm:text-base">
              Organize and manage your spare parts categories.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={loadCategories}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
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
              onClick={handleOpenCreate}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              <FiPlus size={18} />
              Add Category
            </button>
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <FiAlertCircle className="mt-0.5" />

            <div className="flex-1">
              <p className="font-semibold">
                Could not load categories
              </p>

              <p className="mt-1 text-sm">
                {error}
              </p>
            </div>

            <button
              onClick={loadCategories}
              className="text-sm font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* STATISTICS */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Categories
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {totalCategories}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Active
            </p>

            <p className="mt-2 text-3xl font-bold text-emerald-600">
              {activeCategories}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Inactive
            </p>

            <p className="mt-2 text-3xl font-bold text-amber-600">
              {inactiveCategories}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Products
            </p>

            <p className="mt-2 text-3xl font-bold text-violet-600">
              {totalProducts}
            </p>
          </div>

        </div>

        {/* MAIN CARD */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* TOOLBAR */}

          <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="relative w-full sm:w-80">
              <FiSearch
                size={17}
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
                placeholder="Search categories..."
                className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium outline-none focus:border-blue-500"
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

          {/* LOADING */}

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="text-center">
                <FiRefreshCw
                  size={28}
                  className="mx-auto animate-spin text-blue-600"
                />

                <p className="mt-3 text-sm text-slate-500">
                  Loading categories...
                </p>
              </div>
            </div>
          ) : filteredCategories.length === 0 ? (

            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
              <FiFolder
                size={42}
                className="text-slate-300"
              />

              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                {categories.length === 0
                  ? 'No categories found'
                  : 'No matching categories'}
              </h3>

              <p className="mt-1 max-w-md text-sm text-slate-500">
                {categories.length === 0
                  ? 'Create your first category to make it available in the Product form.'
                  : 'Try changing your search or status filter.'}
              </p>

              {categories.length === 0 && (
                <button
                  onClick={handleOpenCreate}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <FiPlus size={17} />
                  Add Category
                </button>
              )}
            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[750px]">

                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                      Category
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                      Description
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                      Products
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                      Created
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase text-slate-500">
                      Actions
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">

                  {filteredCategories.map(
                    (category) => (
                      <tr
                        key={category.id}
                        className="hover:bg-slate-50"
                      >

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                              <FiFolder size={18} />
                            </div>

                            <div>
                              <p className="font-semibold text-slate-900">
                                {category.name}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="max-w-xs px-5 py-4">
                          <p className="truncate text-sm text-slate-600">
                            {category.description ||
                              'No description'}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-sm font-semibold text-slate-700">
                            {category.productCount}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          {category.status ===
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

                        <td className="px-5 py-4 text-sm text-slate-500">
                          {formatDate(
                            category.createdAt
                          )}
                        </td>

                        <td className="px-5 py-4 text-right">

                          <div
                            className="relative inline-block"
                            ref={
                              openMenuId ===
                              category.id
                                ? menuRef
                                : null
                            }
                          >

                            <button
                              onClick={() =>
                                setOpenMenuId(
                                  openMenuId ===
                                    category.id
                                    ? null
                                    : category.id
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-slate-100"
                            >
                              <FiMoreVertical />
                            </button>

                            {openMenuId ===
                              category.id && (
                              <div className="absolute right-0 top-10 z-30 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 text-left shadow-xl">

                                <button
                                  onClick={() =>
                                    handleView(
                                      category
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
                                      category
                                    )
                                  }
                                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm hover:bg-slate-50"
                                >
                                  <FiEdit2 />
                                  Edit Category
                                </button>

                                <button
                                  onClick={() =>
                                    handleToggleStatus(
                                      category
                                    )
                                  }
                                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm hover:bg-slate-50"
                                >
                                  <FiPower />

                                  {category.status ===
                                  'active'
                                    ? 'Deactivate'
                                    : 'Activate'}
                                </button>

                                <div className="my-1 border-t" />

                                <button
                                  onClick={() =>
                                    handleDelete(
                                      category
                                    )
                                  }
                                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                                >
                                  <FiTrash2 />
                                  Delete Category
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

          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingCategory
                    ? 'Edit Category'
                    : 'Add Category'}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {editingCategory
                    ? 'Update category information.'
                    : 'Create a new product category.'}
                </p>
              </div>

              <button
                onClick={() =>
                  !isSaving &&
                  setIsModalOpen(false)
                }
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <FiX size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-5"
            >

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Category Name
                </label>

                <input
                  name="name"
                  value={formData.name}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      name: event.target.value,
                    })
                  }
                  placeholder="e.g. Engine Parts"
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

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      description:
                        event.target.value,
                    })
                  }
                  rows={4}
                  placeholder="Describe this category..."
                  className={`w-full rounded-xl border px-4 py-3 outline-none ${
                    errors.description
                      ? 'border-red-400'
                      : 'border-slate-300'
                  }`}
                />

                {errors.description && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3 border-t pt-5">

                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() =>
                    setIsModalOpen(false)
                  }
                  className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700"
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
                      className="animate-spin"
                      size={16}
                    />
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
          VIEW MODAL
      ======================================================== */}

      {isViewModalOpen &&
        viewingCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">

            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

              <div className="flex items-center justify-between border-b p-5">

                <h2 className="text-lg font-bold">
                  Category Details
                </h2>

                <button
                  onClick={() =>
                    setIsViewModalOpen(false)
                  }
                  className="rounded-lg p-2 hover:bg-slate-100"
                >
                  <FiX />
                </button>

              </div>

              <div className="space-y-5 p-5">

                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">
                    Category
                  </p>

                  <p className="mt-1 text-lg font-bold text-slate-900">
                    {viewingCategory.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">
                    Description
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    {viewingCategory.description ||
                      'No description'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">

                  <div>
                    <p className="text-xs text-slate-400">
                      Products
                    </p>

                    <p className="mt-1 font-semibold">
                      {viewingCategory.productCount}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Status
                    </p>

                    <p className="mt-1 font-semibold">
                      {viewingCategory.status ===
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
          DELETE CONFIRMATION
      ======================================================== */}

      {categoryToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <FiTrash2 size={22} />
            </div>

            <h2 className="mt-4 text-lg font-bold">
              Delete Category?
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Are you sure you want to delete
              <strong className="mx-1">
                {categoryToDelete.name}
              </strong>
              ?
            </p>

            <p className="mt-2 text-xs text-slate-400">
              The backend will prevent deletion
              if products are still using this
              category.
            </p>

            <div className="mt-6 flex justify-end gap-3">

              <button
                disabled={isSaving}
                onClick={() =>
                  setCategoryToDelete(null)
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
          TOGGLE CONFIRMATION
      ======================================================== */}

      {categoryToToggle && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FiPower size={22} />
            </div>

            <h2 className="mt-4 text-lg font-bold">
              {categoryToToggle.status ===
              'active'
                ? 'Deactivate Category?'
                : 'Activate Category?'}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {categoryToToggle.status ===
              'active'
                ? 'This category will no longer be available for new products.'
                : 'This category will become available for products again.'}
            </p>

            <div className="mt-6 flex justify-end gap-3">

              <button
                disabled={isSaving}
                onClick={() =>
                  setCategoryToToggle(null)
                }
                className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold"
              >
                Cancel
              </button>

              <button
                disabled={isSaving}
                onClick={confirmToggleStatus}
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

export default Categories;