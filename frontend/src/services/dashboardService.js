import api from './api';

const dashboardService = {
  // Get dashboard statistics
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  // Get recent activities
  getRecentActivities: async () => {
    const response = await api.get('/dashboard/recent-activities');
    return response.data;
  },

  getDailySales: async () => {
    const response = await api.get('/sales/analytics/daily');
    return response.data;
  },

  getMonthlySales: async () => {
    const response = await api.get('/sales/analytics/monthly');
    return response.data;
  },

  getTopProducts: async () => {
    const response = await api.get('/sales/analytics/top-products');
    return response.data;
  },
};

export default dashboardService;