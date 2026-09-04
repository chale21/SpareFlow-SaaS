import api from './api';

const salesService = {
  getSales: async () => {
    const response = await api.get('/sales');
    return response.data;
  },

  getSalesHistory: async () => {
    const response = await api.get('/sales/history');
    return response.data;
  },

  createSale: async (data) => {
    const response = await api.post('/sales', data);
    return response.data;
  },

  getInvoice: async (id) => {
    const response = await api.get(`/sales/${id}/invoice`);
    return response.data;
  },
};

export default salesService;