import api from '../../services/axiosInstance';

/**
 * Resolve a share code to a pollId.
 * GET /api/share/:shareCode
 * Response: { success, data: { id, ... } }
 */
export const getPollByShareCode = async (shareCode) => {
  const response = await api.get(`/api/share/${shareCode}`);
  return response.data;
};
