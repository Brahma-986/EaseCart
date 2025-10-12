import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Async thunks
export const fetchAnnouncements = createAsyncThunk(
  'announcements/fetchAnnouncements',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_URL}/announcements`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch announcements');
    }
  }
);

export const fetchAnnouncement = createAsyncThunk(
  'announcements/fetchAnnouncement',
  async (id, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_URL}/announcements/${id}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch announcement');
    }
  }
);

export const createAnnouncement = createAsyncThunk(
  'announcements/createAnnouncement',
  async (announcementData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.post(`${API_URL}/announcements`, announcementData, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create announcement');
    }
  }
);

export const updateAnnouncement = createAsyncThunk(
  'announcements/updateAnnouncement',
  async ({ id, announcementData }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.put(`${API_URL}/announcements/${id}`, announcementData, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update announcement');
    }
  }
);

export const deleteAnnouncement = createAsyncThunk(
  'announcements/deleteAnnouncement',
  async (id, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      await axios.delete(`${API_URL}/announcements/${id}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete announcement');
    }
  }
);

export const markAnnouncementAsRead = createAsyncThunk(
  'announcements/markAnnouncementAsRead',
  async (id, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.put(`${API_URL}/announcements/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark announcement as read');
    }
  }
);

const initialState = {
  announcements: [],
  announcement: null,
  isLoading: false,
  error: null,
};

const announcementSlice = createSlice({
  name: 'announcements',
  initialState,
  reducers: {
    clearAnnouncement: (state) => {
      state.announcement = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnnouncements.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAnnouncements.fulfilled, (state, action) => {
        state.isLoading = false;
        state.announcements = action.payload.data || action.payload;
      })
      .addCase(fetchAnnouncements.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchAnnouncement.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAnnouncement.fulfilled, (state, action) => {
        state.isLoading = false;
        state.announcement = action.payload;
      })
      .addCase(fetchAnnouncement.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createAnnouncement.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createAnnouncement.fulfilled, (state, action) => {
        state.isLoading = false;
        const newAnnouncement = action.payload.data || action.payload;
        if (Array.isArray(state.announcements)) {
          state.announcements.unshift(newAnnouncement);
        } else {
          state.announcements = [newAnnouncement];
        }
      })
      .addCase(createAnnouncement.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateAnnouncement.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateAnnouncement.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.announcements.findIndex(a => a._id === action.payload._id);
        if (index !== -1) {
          state.announcements[index] = action.payload;
        }
      })
      .addCase(updateAnnouncement.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteAnnouncement.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteAnnouncement.fulfilled, (state, action) => {
        state.isLoading = false;
        state.announcements = state.announcements.filter(a => a._id !== action.payload);
      })
      .addCase(deleteAnnouncement.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(markAnnouncementAsRead.fulfilled, (state, action) => {
        const announcement = state.announcements.find(a => a._id === action.payload._id);
        if (announcement) {
          announcement.readBy = action.payload.readBy;
        }
      });
  },
});

export const { clearAnnouncement, clearError } = announcementSlice.actions;
export default announcementSlice.reducer;