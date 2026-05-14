import api from '../../services/axiosInstance';

export const loginUser = async ({ email, password }) => {
  const response = await api.post('/api/auth/login', { email, password });
  return response.data;
};

export const registerUser = async ({ name, email, password }) => {
  const response = await api.post('/api/auth/register', { name, email, password });
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/api/auth/me');
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post('/api/auth/logout');
  return response.data;
};
