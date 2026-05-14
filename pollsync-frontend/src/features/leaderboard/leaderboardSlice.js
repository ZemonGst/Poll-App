import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getPollLeaderboard } from './leaderboardApi';

export const fetchLeaderboard = createAsyncThunk(
  'leaderboard/fetchLeaderboard',
  async (pollId, { rejectWithValue }) => {
    try {
      const res = await getPollLeaderboard(pollId);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch leaderboard');
    }
  }
);

const initialState = {
  data: null,
  isLoading: false,
  error: null,
};

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    updateLeaderboardData: (state, action) => {
      state.data = action.payload;
    },
    clearLeaderboard: (state) => {
      state.data = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { updateLeaderboardData, clearLeaderboard } = leaderboardSlice.actions;
export default leaderboardSlice.reducer;
