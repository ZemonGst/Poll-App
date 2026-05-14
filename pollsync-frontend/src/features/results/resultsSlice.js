import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getPollResults } from './resultsApi';

export const fetchResults = createAsyncThunk(
  'results/fetchResults',
  async (pollId, { rejectWithValue }) => {
    try {
      const res = await getPollResults(pollId);
      return res.data; 
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch results');
    }
  }
);

const initialState = {
  data: null,
  isLoading: false,
  error: null,
};

const resultsSlice = createSlice({
  name: 'results',
  initialState,
  reducers: {
    updateResultsData: (state, action) => {

      if (state.data) {

        state.data = {
          ...state.data,
          ...action.payload,
        };
      }
    },
    clearResults: (state) => {
      state.data = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResults.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchResults.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchResults.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { updateResultsData, clearResults } = resultsSlice.actions;
export default resultsSlice.reducer;
