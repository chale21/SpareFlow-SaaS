import api from './api';

const salesService = {
  getSales: async () => {
    const response = await api.get('/sales');
    return response.data;
  },
};

export default salesService;