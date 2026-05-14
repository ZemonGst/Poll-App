import api from '../../services/axiosInstance';

export const createPoll = async (dto) => {
  const response = await api.post('/api/polls', dto);
  return response.data;
};

export const getPollById = async (id) => {
  const response = await api.get(`/api/polls/${id}`);
  return response.data;
};

export const updatePoll = async (id, dto) => {
  const response = await api.patch(`/api/polls/${id}`, dto);
  return response.data;
};

export const deletePoll = async (id) => {
  const response = await api.delete(`/api/polls/${id}`);
  return response.data;
};

export const endPoll = async (id) => {
  const response = await api.patch(`/api/polls/${id}/end`);
  return response.data;
};

export const submitVote = async (id, dto) => {
  const response = await api.post(`/api/polls/${id}/vote`, dto);
  return response.data;
};

export default {
  createPoll,
  getPollById,
  updatePoll,
  deletePoll,
  endPoll,
  submitVote,
};
