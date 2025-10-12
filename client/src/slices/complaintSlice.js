import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Async thunks
export const fetchComplaints = createAsyncThunk(
  'complaints/fetchComplaints',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_URL}/complaints`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch complaints');
    }
  }
);

export const fetchComplaint = createAsyncThunk(
  'complaints/fetchComplaint',
  async (id, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_URL}/complaints/${id}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch complaint');
    }
  }
);

export const createComplaint = createAsyncThunk(
  'complaints/createComplaint',
  async (complaintData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.post(`${API_URL}/complaints`, complaintData, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create complaint');
    }
  }
);

export const respondToComplaint = createAsyncThunk(
  'complaints/respondToComplaint',
  async ({ id, responseData }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.put(`${API_URL}/complaints/${id}/respond`, responseData, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to respond to complaint');
    }
  }
);

export const updateComplaintStatus = createAsyncThunk(
  'complaints/updateComplaintStatus',
  async ({ id, status }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.put(`${API_URL}/complaints/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update complaint status');
    }
  }
);

export const fetchComplaintStats = createAsyncThunk(
  'complaints/fetchComplaintStats',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_URL}/complaints/stats`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch complaint stats');
    }
  }
);

const initialState = {
  complaints: [],
  complaint: null,
  stats: null,
  isLoading: false,
  error: null,
};

const complaintSlice = createSlice({
  name: 'complaints',
  initialState,
  reducers: {
    clearComplaint: (state) => {
      state.complaint = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComplaints.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchComplaints.fulfilled, (state, action) => {
        state.isLoading = false;
        state.complaints = action.payload.data || action.payload;
      })
      .addCase(fetchComplaints.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchComplaint.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchComplaint.fulfilled, (state, action) => {
        state.isLoading = false;
        state.complaint = action.payload;
      })
      .addCase(fetchComplaint.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createComplaint.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createComplaint.fulfilled, (state, action) => {
        state.isLoading = false;
        const newComplaint = action.payload.data || action.payload;
        if (Array.isArray(state.complaints)) {
          state.complaints.unshift(newComplaint);
        } else {
          state.complaints = [newComplaint];
        }
      })
      .addCase(createComplaint.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(respondToComplaint.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(respondToComplaint.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.complaints.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.complaints[index] = action.payload;
        }
        if (state.complaint && state.complaint._id === action.payload._id) {
          state.complaint = action.payload;
        }
      })
      .addCase(respondToComplaint.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateComplaintStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateComplaintStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.complaints.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.complaints[index] = action.payload;
        }
        if (state.complaint && state.complaint._id === action.payload._id) {
          state.complaint = action.payload;
        }
      })
      .addCase(updateComplaintStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchComplaintStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export const { clearComplaint, clearError } = complaintSlice.actions;
export default complaintSlice.reducer;