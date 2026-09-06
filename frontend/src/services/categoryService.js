import api from './api';

const categoryService = {
  getCategories: async () => (await api.get('/categories')).data,
  createCategory: async (data) => (await api.post('/categories', data)).data,
  updateCategory: async (id, data) => (await api.put(`/categories/${id}`, data)).data,
  deleteCategory: async (id) => (await api.delete(`/categories/${id}`)).data,
};

export default categoryService;