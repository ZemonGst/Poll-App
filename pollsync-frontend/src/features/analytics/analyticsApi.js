import api from '../../services/axiosInstance';

export const getPollAnalytics = async (id) => {
  const response = await api.get(`/api/polls/${id}/analytics`);
  return response.data;
};

export default {
  getPollAnalytics,
};
