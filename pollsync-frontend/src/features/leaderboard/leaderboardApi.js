import api from '../../services/axiosInstance';

export const getPollLeaderboard = async (id) => {
  const response = await api.get(`/api/polls/${id}/leaderboard`);
  return response.data;
};

export default {
  getPollLeaderboard,
};
