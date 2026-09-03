import api from './api';

const purchaseService = {
  // GET /purchases
  getPurchases: async (status = '') => {
    const response = await api.get('/purchases', {
      params: status ? { status } : {},
    });

    return response.data;
  },

  // GET /purchases/history
  getPurchaseHistory: async (status = '') => {
    const response = await api.get('/purchases/history', {
      params: status ? { status } : {},
    });

    return response.data;
  },

  // POST /purchases
  createPurchase: async (data) => {
    const response = await api.post('/purchases', data);

    return response.data;
  },

  // PUT /purchases/:id/receive
  receivePurchase: async (id) => {
    const response = await api.put(
      `/purchases/${id}/receive`
    );

    return response.data;
  },
};

export default purchaseService;