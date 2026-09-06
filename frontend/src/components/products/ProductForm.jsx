
import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  FiAlertCircle,
  FiSave,
  FiX,
} from 'react-icons/fi';

import Input from '../common/Input';
import Button from '../common/Button';

// ============================================================
// EMPTY PRODUCT
// ============================================================

const emptyProduct = {
  productName: '',
  categoryId: '',
  productCode: '',
  quantity: 0,
  purchasePrice: '',
  sellingPrice: '',
  minimumStock: 0,
  maximumStock: '',
  supplierId: '',
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

const getId = (item) => {
  if (!item) {
    return '';
  }

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

const getCategoryName = (item) => {
  if (!item) {
    return '';
  }

  if (typeof item === 'string') {
    return item;
  }

  return (
    item.categoryName ||
    item.name ||
    item.title ||
    ''
  );
};

const getSupplierName = (item) => {
  if (!item) {
    return '';
  }

  if (typeof item === 'string') {
    return item;
  }

  return (
    item.supplierName ||
    item.name ||
    item.title ||
    ''
  );
};

// ============================================================
// ACTIVE CHECK
// ============================================================
//
// IMPORTANT:
//
// isActive === true   -> ACTIVE
// isActive === false  -> INACTIVE
//
// We use strict true here because the Add Product dropdown
// must contain ONLY records explicitly marked as active.
//
// If your existing records don't have isActive yet, they
// won't appear until they are marked active.
//
// ============================================================

const isActive = (item) => {
  if (!item || typeof item === 'string') {
    return false;
  }

  return item.isActive !== false;
};

// ============================================================
// PRODUCT FORM
// ============================================================

const ProductForm = ({
  initialValues,
  categories = [],
  suppliers = [],
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [form, setForm] = useState(
    emptyProduct
  );

  const [errors, setErrors] = useState({});

  // ==========================================================
  // INITIAL VALUES
  // ==========================================================

  useEffect(() => {
    setForm({
      ...emptyProduct,
      ...(initialValues || {}),
    });

    setErrors({});
  }, [initialValues]);

  // ==========================================================
  // ACTIVE CATEGORIES
  // ==========================================================
  //
  // THIS IS THE IMPORTANT PART.
  //
  // We DO NOT modify the original categories array.
  //
  // Categories.jsx still receives all categories.
  //
  // Only the ProductForm dropdown receives active categories.
  // ==========================================================

  const activeCategories = useMemo(() => {
    if (!Array.isArray(categories)) {
      return [];
    }

    return categories.filter(
      (category) => isActive(category)
    );
  }, [categories]);

  // ==========================================================
  // ACTIVE SUPPLIERS
  // ==========================================================

  const activeSuppliers = useMemo(() => {
    if (!Array.isArray(suppliers)) {
      return [];
    }

    return suppliers.filter(
      (supplier) => isActive(supplier)
    );
  }, [suppliers]);

  // ==========================================================
  // CATEGORY OPTIONS
  // ==========================================================

  const categoryOptions = useMemo(() => {
    return activeCategories
      .map((category) => ({
        id: getId(category),
        name: getCategoryName(category),
      }))
      .filter(
        (item) =>
          item.id &&
          item.name
      );
  }, [activeCategories]);

  // ==========================================================
  // SUPPLIER OPTIONS
  // ==========================================================

  const supplierOptions = useMemo(() => {
    return activeSuppliers
      .map((supplier) => ({
        id: getId(supplier),
        name: getSupplierName(supplier),
      }))
      .filter(
        (item) =>
          item.id &&
          item.name
      );
  }, [activeSuppliers]);

  // ==========================================================
  // CLEAR INVALID CATEGORY
  // ==========================================================
  //
  // If editing a product and its category has been made
  // inactive, don't allow that inactive category to be
  // submitted.
  //
  // IMPORTANT:
  // This affects ONLY the ProductForm.
  //
  // It does NOT delete or hide the category from
  // Categories.jsx.
  // ==========================================================

  useEffect(() => {
    if (!form.categoryId) {
      return;
    }

    const categoryStillActive =
      categoryOptions.some(
        (item) =>
          String(item.id) ===
          String(form.categoryId)
      );

    if (!categoryStillActive) {
      setForm((current) => ({
        ...current,
        categoryId: '',
      }));
    }
  }, [
    categoryOptions,
    form.categoryId,
  ]);

  // ==========================================================
  // CLEAR INVALID SUPPLIER
  // ==========================================================

  useEffect(() => {
    if (!form.supplierId) {
      return;
    }

    const supplierStillActive =
      supplierOptions.some(
        (item) =>
          String(item.id) ===
          String(form.supplierId)
      );

    if (!supplierStillActive) {
      setForm((current) => ({
        ...current,
        supplierId: '',
      }));
    }
  }, [
    supplierOptions,
    form.supplierId,
  ]);

  // ==========================================================
  // CHANGE
  // ==========================================================

  const change = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: '',
    }));
  };

  // ==========================================================
  // VALIDATION
  // ==========================================================

  const validate = () => {
    const next = {};

    // --------------------------------------------------------
    // PRODUCT NAME
    // --------------------------------------------------------

    if (
      !String(
        form.productName || ''
      ).trim()
    ) {
      next.productName =
        'Product name is required.';
    }

    // --------------------------------------------------------
    // CATEGORY
    // --------------------------------------------------------

    if (!form.categoryId) {
      next.categoryId =
        'Category is required.';
    } else {
      const activeCategory =
        categoryOptions.some(
          (item) =>
            String(item.id) ===
            String(form.categoryId)
        );

      if (!activeCategory) {
        next.categoryId =
          'Please select an active category.';
      }
    }

    // --------------------------------------------------------
    // PRODUCT CODE
    // --------------------------------------------------------

    if (
      !String(
        form.productCode || ''
      ).trim()
    ) {
      next.productCode =
        'Product code is required.';
    }

    // --------------------------------------------------------
    // QUANTITY
    // --------------------------------------------------------

    if (
      Number(form.quantity) < 0
    ) {
      next.quantity =
        'Quantity cannot be negative.';
    }

    // --------------------------------------------------------
    // PURCHASE PRICE
    // --------------------------------------------------------

    if (
      form.purchasePrice === '' ||
      form.purchasePrice === null ||
      Number(form.purchasePrice) < 0
    ) {
      next.purchasePrice =
        'Purchase price is required.';
    }

    // --------------------------------------------------------
    // SELLING PRICE
    // --------------------------------------------------------

    if (
      form.sellingPrice === '' ||
      form.sellingPrice === null ||
      Number(form.sellingPrice) < 0
    ) {
      next.sellingPrice =
        'Selling price is required.';
    }

    // --------------------------------------------------------
    // MINIMUM STOCK
    // --------------------------------------------------------

    if (
      Number(form.minimumStock) < 0
    ) {
      next.minimumStock =
        'Minimum stock cannot be negative.';
    }

    // --------------------------------------------------------
    // MAXIMUM STOCK
    // --------------------------------------------------------

    if (
      form.maximumStock !== '' &&
      form.maximumStock !== null &&
      Number(form.maximumStock) < 0
    ) {
      next.maximumStock =
        'Maximum stock cannot be negative.';
    }

    // --------------------------------------------------------
    // SUPPLIER
    // --------------------------------------------------------

    if (!form.supplierId) {
      next.supplierId =
        'Supplier is required.';
    } else {
      const activeSupplier =
        supplierOptions.some(
          (item) =>
            String(item.id) ===
            String(form.supplierId)
        );

      if (!activeSupplier) {
        next.supplierId =
          'Please select an active supplier.';
      }
    }

    setErrors(next);

    return (
      Object.keys(next).length === 0
    );
  };

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const submit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const payload = {
      productName:
        String(
          form.productName
        ).trim(),

      categoryId:
        form.categoryId,

      productCode:
        String(
          form.productCode
        )
          .trim()
          .toUpperCase(),

      quantity:
        Number(form.quantity),

      purchasePrice:
        Number(
          form.purchasePrice
        ),

      sellingPrice:
        Number(
          form.sellingPrice
        ),

      minimumStock:
        Number(
          form.minimumStock
        ),

      supplierId:
        form.supplierId,
    };

    // --------------------------------------------------------
    // OPTIONAL MAXIMUM STOCK
    // --------------------------------------------------------

    if (
      form.maximumStock !== '' &&
      form.maximumStock !== null &&
      form.maximumStock !== undefined
    ) {
      payload.maximumStock =
        Number(
          form.maximumStock
        );
    }

    await onSubmit(payload);
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <form
      onSubmit={submit}
      className="space-y-6"
    >

      {/* ======================================================
          CATEGORY STATUS
      ======================================================= */}

      {categoryOptions.length === 0 && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3">

          <FiAlertCircle className="mt-0.5 shrink-0 text-amber-600" />

          <div>
            <p className="text-sm font-semibold text-amber-800">
              No active categories available
            </p>

            <p className="mt-0.5 text-xs text-amber-700">
              Activate a category or create a new
              category before adding a product.
            </p>
          </div>
        </div>
      )}

      {/* ======================================================
          SUPPLIER STATUS
      ======================================================= */}

      {supplierOptions.length === 0 && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3">

          <FiAlertCircle className="mt-0.5 shrink-0 text-amber-600" />

          <div>
            <p className="text-sm font-semibold text-amber-800">
              No active suppliers available
            </p>

            <p className="mt-0.5 text-xs text-amber-700">
              Activate a supplier or create a new
              supplier before adding a product.
            </p>
          </div>
        </div>
      )}

      {/* ======================================================
          PRODUCT FIELDS
      ======================================================= */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* PRODUCT NAME */}
        <Input
          label="Product Name"
          name="productName"
          value={form.productName}
          onChange={change}
          placeholder="e.g. Toyota Brake Pad"
          error={errors.productName}
          required
        />

        {/* PRODUCT CODE */}
        <Input
          label="Product Code / SKU"
          name="productCode"
          value={form.productCode}
          onChange={change}
          placeholder="e.g. BP-001"
          error={errors.productCode}
          required
        />

        {/* ==================================================
            CATEGORY
        =================================================== */}

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Category{' '}
            <span className="text-red-500">
              *
            </span>
          </label>

          <select
            name="categoryId"
            value={form.categoryId}
            onChange={change}
            disabled={
              isLoading ||
              categoryOptions.length === 0
            }
            className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg outline-none focus:ring-2 focus:ring-blue-100 ${
              errors.categoryId
                ? 'border-red-300'
                : 'border-slate-300'
            } ${
              isLoading ||
              categoryOptions.length === 0
                ? 'bg-slate-50 cursor-not-allowed'
                : ''
            }`}
          >
            <option value="">
              {categoryOptions.length === 0
                ? 'No active categories available'
                : 'Select category'}
            </option>

            {categoryOptions.map(
              (item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.name}
                </option>
              )
            )}
          </select>

          {errors.categoryId && (
            <p className="mt-1.5 text-xs text-red-600">
              {errors.categoryId}
            </p>
          )}

          {categoryOptions.length > 0 && (
            <p className="mt-1 text-xs text-slate-400">
              {categoryOptions.length}{' '}
              {categoryOptions.length === 1
                ? 'active category'
                : 'active categories'}{' '}
              available
            </p>
          )}
        </div>

        {/* ==================================================
            SUPPLIER
        =================================================== */}

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Supplier{' '}
            <span className="text-red-500">
              *
            </span>
          </label>

          <select
            name="supplierId"
            value={form.supplierId}
            onChange={change}
            disabled={
              isLoading ||
              supplierOptions.length === 0
            }
            className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg outline-none focus:ring-2 focus:ring-blue-100 ${
              errors.supplierId
                ? 'border-red-300'
                : 'border-slate-300'
            } ${
              isLoading ||
              supplierOptions.length === 0
                ? 'bg-slate-50 cursor-not-allowed'
                : ''
            }`}
          >
            <option value="">
              {supplierOptions.length === 0
                ? 'No active suppliers available'
                : 'Select supplier'}
            </option>

            {supplierOptions.map(
              (item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.name}
                </option>
              )
            )}
          </select>

          {errors.supplierId && (
            <p className="mt-1.5 text-xs text-red-600">
              {errors.supplierId}
            </p>
          )}

          {supplierOptions.length > 0 && (
            <p className="mt-1 text-xs text-slate-400">
              {supplierOptions.length}{' '}
              {supplierOptions.length === 1
                ? 'active supplier'
                : 'active suppliers'}{' '}
              available
            </p>
          )}
        </div>

        {/* QUANTITY */}
        <Input
          label="Quantity"
          type="number"
          min="0"
          name="quantity"
          value={form.quantity}
          onChange={change}
          error={errors.quantity}
          required
        />

        {/* MINIMUM STOCK */}
        <Input
          label="Minimum Stock"
          type="number"
          min="0"
          name="minimumStock"
          value={form.minimumStock}
          onChange={change}
          error={errors.minimumStock}
          helperText="At or below this quantity, the product becomes Low Stock."
          required
        />

        {/* MAXIMUM STOCK */}
        <Input
          label="Maximum Stock"
          type="number"
          min="0"
          name="maximumStock"
          value={form.maximumStock}
          onChange={change}
          error={errors.maximumStock}
          placeholder="Optional"
        />

        {/* PURCHASE PRICE */}
        <Input
          label="Purchase Price"
          type="number"
          min="0"
          step="0.01"
          name="purchasePrice"
          value={form.purchasePrice}
          onChange={change}
          error={errors.purchasePrice}
          required
        />

        {/* SELLING PRICE */}
        <Input
          label="Selling Price"
          type="number"
          min="0"
          step="0.01"
          name="sellingPrice"
          value={form.sellingPrice}
          onChange={change}
          error={errors.sellingPrice}
          required
        />
      </div>

      {/* ======================================================
          ACTIONS
      ======================================================= */}

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2 border-t border-slate-200">

        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          <FiX className="mr-2" />
          Cancel
        </Button>

        <Button
          type="submit"
          isLoading={isLoading}
          disabled={
            isLoading ||
            categoryOptions.length === 0 ||
            supplierOptions.length === 0
          }
        >
          <FiSave className="mr-2" />

          {initialValues
            ? 'Update Product'
            : 'Create Product'}
        </Button>

      </div>
    </form>
  );
};

export default ProductForm;

