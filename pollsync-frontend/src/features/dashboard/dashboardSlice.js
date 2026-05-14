import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dashboardApi } from './dashboardApi';

export const fetchMyPolls = createAsyncThunk(
  'dashboard/fetchMyPolls',
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardApi.getMyPolls();
      // Assuming response.data.data contains the polls array
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch polls');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    polls: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    updatePollVotes: (state, action) => {
      const updatedPoll = action.payload?.poll || action.payload;
      const pollId = updatedPoll?.pollId || updatedPoll?.id || updatedPoll?._id;
      const options = updatedPoll?.options || [];
      const poll = state.polls.find((p) => (p.id || p._id) === pollId);

      if (poll) {
        poll.totalVotes = updatedPoll.totalVotes ?? options.reduce((sum, opt) => sum + (opt.voteCount || opt.votes || 0), 0);
        poll.options = options.length > 0 ? options : poll.options;
        poll.status = updatedPoll.status || poll.status;
      }
    },
    updatePollAnalytics: (state, action) => {
      const data = action.payload;
      const pollId = data?.pollId || data?.id || data?._id;
      const poll = state.polls.find((p) => (p.id || p._id) === pollId);

      if (poll && data) {
        poll.totalVotes = data.totalVotes ?? poll.totalVotes;
        poll.uniqueParticipants = data.uniqueParticipants ?? poll.uniqueParticipants;
        poll.authenticatedVotes = data.authenticatedVotes ?? poll.authenticatedVotes;
        poll.anonymousVotes = data.anonymousVotes ?? poll.anonymousVotes;
      }
    },
    removePoll: (state, action) => {
      state.polls = state.polls.filter((p) => (p.id || p._id) !== action.payload);
    },
    markPollEnded: (state, action) => {
      const endedPoll = action.payload?.poll || action.payload;
      const pollId = typeof endedPoll === 'string' ? endedPoll : (endedPoll?.pollId || endedPoll?.id || endedPoll?._id);
      const poll = state.polls.find((p) => (p.id || p._id) === pollId);

      if (poll) {
        poll.status = endedPoll?.status || 'ended';
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyPolls.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyPolls.fulfilled, (state, action) => {
        state.isLoading = false;
        state.polls = action.payload;
      })
      .addCase(fetchMyPolls.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { updatePollVotes, updatePollAnalytics, removePoll, markPollEnded } = dashboardSlice.actions;

export default dashboardSlice.reducer;
