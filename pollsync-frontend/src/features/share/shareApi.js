import api from '../../services/axiosInstance';

export const getPollByShareCode = async (shareCode) => {
  const response = await api.get(`/api/share/${shareCode}`);
  return response.data;
};
