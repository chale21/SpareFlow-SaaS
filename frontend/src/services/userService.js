import api from './api';

const userService = {
  getUsers: async () => (await api.get('/users')).data,
  createUser: async (data) => (await api.post('/users', data)).data,
  updateUser: async (id, data) => (await api.put(`/users/${id}`, data)).data,
  deleteUser: async (id) => (await api.delete(`/users/${id}`)).data,
};

export default userService;