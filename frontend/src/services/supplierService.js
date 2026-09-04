import api from './api';

const supplierService = {
  // Get all suppliers for the authenticated company
  getSuppliers: async () => {
    const response = await api.get('/suppliers');
    return response.data;
  },

  // Get one supplier's purchase history
  getSupplierPurchases: async (supplierId) => {
    const response = await api.get(
      `/suppliers/${supplierId}/purchases`
    );
    return response.data;
  },

  // Create supplier
  createSupplier: async (data) => {
    const response = await api.post('/suppliers', data);
    return response.data;
  },

  // Update supplier
  updateSupplier: async (supplierId, data) => {
    const response = await api.put(
      `/suppliers/${supplierId}`,
      data
    );
    return response.data;
  },

  // Delete supplier
  deleteSupplier: async (supplierId) => {
    const response = await api.delete(
      `/suppliers/${supplierId}`
    );
    return response.data;
  },
};

export default supplierService;