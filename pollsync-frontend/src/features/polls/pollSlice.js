import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import pollApi from './pollApi';

export const createPollThunk = createAsyncThunk(
  'poll/createPoll',
  async (dto, { rejectWithValue }) => {
    try {
      const response = await pollApi.createPoll(dto);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create poll');
    }
  }
);

export const getPollThunk = createAsyncThunk(
  'poll/getPoll',
  async (id, { rejectWithValue }) => {
    try {
      const response = await pollApi.getPollById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch poll');
    }
  }
);

export const updatePollThunk = createAsyncThunk(
  'poll/updatePoll',
  async ({ id, dto }, { rejectWithValue }) => {
    try {
      const response = await pollApi.updatePoll(id, dto);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update poll');
    }
  }
);

export const deletePollThunk = createAsyncThunk(
  'poll/deletePoll',
  async (id, { rejectWithValue }) => {
    try {
      await pollApi.deletePoll(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete poll');
    }
  }
);

export const endPollThunk = createAsyncThunk(
  'poll/endPoll',
  async (id, { rejectWithValue }) => {
    try {
      const response = await pollApi.endPoll(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to end poll');
    }
  }
);

export const submitVoteThunk = createAsyncThunk(
  'poll/submitVote',
  async ({ id, dto }, { rejectWithValue }) => {
    try {
      const response = await pollApi.submitVote(id, dto);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit vote');
    }
  }
);

const initialState = {
  currentPoll: null,
  isLoading: false,
  error: null,
};

const pollSlice = createSlice({
  name: 'poll',
  initialState,
  reducers: {
    clearCurrentPoll: (state) => {
      state.currentPoll = null;
      state.error = null;
    },
    clearPollError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPollThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPollThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPoll = action.payload?.data || action.payload; 
      })
      .addCase(createPollThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getPollThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPollThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPoll = action.payload?.data || action.payload;
      })
      .addCase(getPollThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updatePollThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePollThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPoll = action.payload?.data || action.payload;
      })
      .addCase(updatePollThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deletePollThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deletePollThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.currentPoll = null;
      })
      .addCase(deletePollThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(endPollThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(endPollThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPoll = action.payload?.data || action.payload;
      })
      .addCase(endPollThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(submitVoteThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitVoteThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPoll = action.payload?.data || action.payload;
      })
      .addCase(submitVoteThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentPoll, clearPollError } = pollSlice.actions;
export default pollSlice.reducer;
