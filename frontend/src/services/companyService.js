import api from './api';

const companyService = {
  getProfile: async () => (await api.get('/companies/profile')).data,
  updateProfile: async (data) => (await api.put('/companies/profile', data)).data,

  // Optional multipart uploads. Backend must support these endpoints.
  uploadLogo: async (formData) => (await api.post('/companies/profile/logo', formData, { headers: { 'Content-Type': 'multipart/form-data' } })).data,
  uploadOwnerAvatar: async (formData) => (await api.post('/companies/profile/owner-avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } })).data,
};

export default companyService;