import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getPollAnalytics } from './analyticsApi';

const normalizeAnalytics = (payload) => ({
  ...payload,
  ...(payload?.analytics || {}),
});

export const fetchAnalytics = createAsyncThunk(
  'analytics/fetchAnalytics',
  async (pollId, { rejectWithValue }) => {
    try {
      const res = await getPollAnalytics(pollId);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch analytics');
    }
  }
);

const initialState = {
  data: null,
  isLoading: false,
  error: null,
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    updateAnalyticsData: (state, action) => {
      const payload = normalizeAnalytics(action.payload);

      if (state.data) {
        state.data = {
          ...state.data,
          ...payload,
        };
      } else {
        state.data = payload;
      }
    },
    clearAnalytics: (state) => {
      state.data = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = normalizeAnalytics(action.payload);
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { updateAnalyticsData, clearAnalytics } = analyticsSlice.actions;
export default analyticsSlice.reducer;
