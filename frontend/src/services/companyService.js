import api from './api';

const unwrapResponse = (response) => response?.data?.data ?? response?.data;

const companyService = {
  getProfile: async () => unwrapResponse(await api.get('/companies/profile')),
  updateProfile: async (data) => unwrapResponse(await api.put('/companies/profile', data)),

  // Optional multipart uploads. Backend must support these endpoints.
  uploadLogo: async (formData) => unwrapResponse(await api.post('/companies/profile/logo', formData, { headers: { 'Content-Type': 'multipart/form-data' } })),
  uploadOwnerAvatar: async (formData) => unwrapResponse(await api.post('/companies/profile/owner-avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } })),
};

export default companyService;