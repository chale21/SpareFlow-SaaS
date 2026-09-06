import api from './api';

const companyService = {
  getProfile: async () => (await api.get('/companies/profile')).data,
  updateProfile: async (data) => (await api.put('/companies/profile', data)).data,
};

export default companyService;