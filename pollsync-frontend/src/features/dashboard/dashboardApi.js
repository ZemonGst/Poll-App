import api from '../../services/axiosInstance';

export const dashboardApi = {
  getMyPolls: () => api.get('/api/polls/me'),
  deletePoll: (id) => api.delete(`/api/polls/${id}`),
  endPoll: (id) => api.patch(`/api/polls/${id}/end`),
};
