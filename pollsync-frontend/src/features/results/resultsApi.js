import api from '../../services/axiosInstance';

export const getPollResults = async (id) => {
  const response = await api.get(`/api/polls/${id}/results`);
  return response.data;
};

export default {
  getPollResults,
};
