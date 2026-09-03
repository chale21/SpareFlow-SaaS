import api from './api';

const productService = {
  // Get all products for the authenticated company
  getProducts: async () => {
    const response = await api.get('/products');
    return response.data;
  },

  // Get one product
  getProductById: async (productId) => {
    const response = await api.get(`/products/${productId}`);
    return response.data;
  },

  // Search products
  searchProducts: async (query) => {
    const response = await api.get('/products/search', {
      params: { search: query },
    });

    return response.data;
  },
};

export default productService;