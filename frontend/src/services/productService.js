
import api from './api';

// ============================================================
// RESPONSE HELPERS
// ============================================================

const unwrap = (response) => {
  return response?.data?.data ?? response?.data ?? null;
};

const unwrapList = (response) => {
  const data = unwrap(response);

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.items)) {
    return data.items;
  }

  if (Array.isArray(data?.categories)) {
    return data.categories;
  }

  if (Array.isArray(data?.suppliers)) {
    return data.suppliers;
  }

  if (Array.isArray(data?.products)) {
    return data.products;
  }

  if (Array.isArray(data?.results)) {
    return data.results;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  return [];
};

// ============================================================
// PRODUCT SERVICE
// ============================================================

export const productService = {

  // ----------------------------------------------------------
  // GET ALL PRODUCTS
  // ----------------------------------------------------------

  async getProducts(params = {}) {
    const response = await api.get('/products', {
      params,
    });

    return unwrapList(response);
  },

  // ----------------------------------------------------------
  // SEARCH PRODUCTS
  // ----------------------------------------------------------

  async searchProducts(params = {}) {
    const response = await api.get('/products/search', {
      params,
    });

    return unwrapList(response);
  },

  // ----------------------------------------------------------
  // LOW STOCK PRODUCTS
  // ----------------------------------------------------------

  async getLowStock() {
    const response = await api.get('/products/low-stock');

    return unwrapList(response);
  },

  // ----------------------------------------------------------
  // OUT OF STOCK PRODUCTS
  // ----------------------------------------------------------

  async getOutOfStock() {
    const response = await api.get('/products/out-of-stock');

    return unwrapList(response);
  },

  // ----------------------------------------------------------
  // GET SINGLE PRODUCT
  // ----------------------------------------------------------

  async getProduct(id) {
    if (!id) {
      throw new Error('Product ID is required.');
    }

    const response = await api.get(
      `/products/${id}`
    );

    return unwrap(response);
  },

  // ----------------------------------------------------------
  // CREATE PRODUCT
  // ----------------------------------------------------------

  async createProduct(product) {
    const response = await api.post(
      '/products',
      product
    );

    return unwrap(response);
  },

  // ----------------------------------------------------------
  // UPDATE PRODUCT
  // ----------------------------------------------------------

  async updateProduct(id, product) {
    if (!id) {
      throw new Error('Product ID is required.');
    }

    const response = await api.put(
      `/products/${id}`,
      product
    );

    return unwrap(response);
  },

  // ----------------------------------------------------------
  // DELETE PRODUCT
  // ----------------------------------------------------------

  async deleteProduct(id) {
    if (!id) {
      throw new Error('Product ID is required.');
    }

    const response = await api.delete(
      `/products/${id}`
    );

    return unwrap(response);
  },

  // ----------------------------------------------------------
  // STOCK MOVEMENTS
  // ----------------------------------------------------------

  async getStockMovements(productId = null) {
    const response = productId
      ? await api.get(
          `/stock-movements/${productId}`
        )
      : await api.get(
          '/stock-movements'
        );

    return unwrapList(response);
  },
};

// ============================================================
// CATEGORY SERVICE
// ============================================================

export const categoryService = {

  // ----------------------------------------------------------
  // GET ALL CATEGORIES
  // ----------------------------------------------------------
  //
  // IMPORTANT:
  // DO NOT FILTER isActive HERE.
  //
  // Categories.jsx needs both active and inactive
  // categories so the user can manage/reactivate them.
  //
  // ProductForm.jsx will do the filtering specifically
  // for the Add Product dropdown.
  // ----------------------------------------------------------

  async list() {
    const response = await api.get(
      '/categories'
    );

    return unwrapList(response);
  },

  // ----------------------------------------------------------
  // CREATE CATEGORY
  // ----------------------------------------------------------

  async create(category) {
    const payload = {
      categoryName:
        category?.categoryName ??
        category?.name ??
        '',

      description:
        category?.description ??
        '',
    };

    const response = await api.post(
      '/categories',
      payload
    );

    return unwrap(response);
  },

  // ----------------------------------------------------------
  // UPDATE CATEGORY
  // ----------------------------------------------------------

  async update(id, category) {
    if (!id) {
      throw new Error(
        'Category ID is required.'
      );
    }

    const payload = {
      categoryName:
        category?.categoryName ??
        category?.name ??
        '',

      description:
        category?.description ??
        '',
    };

    // Allow activate/deactivate
    if (
      category?.isActive !== undefined
    ) {
      payload.isActive =
        Boolean(category.isActive);
    }

    const response = await api.put(
      `/categories/${id}`,
      payload
    );

    return unwrap(response);
  },

  // ----------------------------------------------------------
  // DELETE CATEGORY
  // ----------------------------------------------------------

  async remove(id) {
    if (!id) {
      throw new Error(
        'Category ID is required.'
      );
    }

    const response = await api.delete(
      `/categories/${id}`
    );

    return unwrap(response);
  },
};

// ============================================================
// SUPPLIER SERVICE
// ============================================================

export const supplierService = {

  // ----------------------------------------------------------
  // GET ALL SUPPLIERS
  // ----------------------------------------------------------
  //
  // IMPORTANT:
  // DO NOT FILTER isActive HERE.
  //
  // Suppliers.jsx needs both active and inactive
  // suppliers for management.
  //
  // ProductForm.jsx will filter them only for the
  // Add Product dropdown.
  // ----------------------------------------------------------

  async list() {
    const response = await api.get(
      '/suppliers'
    );

    return unwrapList(response);
  },

  // ----------------------------------------------------------
  // CREATE SUPPLIER
  // ----------------------------------------------------------

  async create(supplier) {
    const payload = {
      supplierName:
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
    };

    const response = await api.post(
      '/suppliers',
      payload
    );

    return unwrap(response);
  },

  // ----------------------------------------------------------
  // UPDATE SUPPLIER
  // ----------------------------------------------------------

  async update(id, supplier) {
    if (!id) {
      throw new Error(
        'Supplier ID is required.'
      );
    }

    const payload = {
      supplierName:
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
    };

    // Allow activate/deactivate
    if (
      supplier?.isActive !== undefined
    ) {
      payload.isActive =
        Boolean(supplier.isActive);
    }

    const response = await api.put(
      `/suppliers/${id}`,
      payload
    );

    return unwrap(response);
  },

  // ----------------------------------------------------------
  // DELETE SUPPLIER
  // ----------------------------------------------------------

  async remove(id) {
    if (!id) {
      throw new Error(
        'Supplier ID is required.'
      );
    }

    const response = await api.delete(
      `/suppliers/${id}`
    );

    return unwrap(response);
  },

  // ----------------------------------------------------------
  // SUPPLIER PURCHASE HISTORY
  // ----------------------------------------------------------

  async getPurchases(id) {
    if (!id) {
      throw new Error(
        'Supplier ID is required.'
      );
    }

    const response = await api.get(
      `/suppliers/${id}/purchases`
    );

    return unwrapList(response);
  },
};

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default productService;

