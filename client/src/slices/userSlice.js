import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Async thunks
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (params = {}, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${auth.token}` },
        params,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const fetchUser = createAsyncThunk(
  'users/fetchUser',
  async (id, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_URL}/users/${id}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
    }
  }
);

export const updateUserRole = createAsyncThunk(
  'users/updateUserRole',
  async ({ id, role }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.put(`${API_URL}/users/${id}/role`, { role }, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user role');
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  'users/updateUserStatus',
  async ({ id, isActive }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.put(`${API_URL}/users/${id}/status`, { isActive }, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user status');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      await axios.delete(`${API_URL}/users/${id}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
    }
  }
);

export const fetchUserStats = createAsyncThunk(
  'users/fetchUserStats',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_URL}/users/stats`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user stats');
    }
  }
);

const initialState = {
  users: [],
  user: null,
  stats: null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.data || action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateUserRole.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.users.findIndex(u => u._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        if (state.user && state.user._id === action.payload._id) {
          state.user = action.payload;
        }
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateUserStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.users.findIndex(u => u._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        if (state.user && state.user._id === action.payload._id) {
          state.user = action.payload;
        }
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = state.users.filter(u => u._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export const { clearUser, clearError } = userSlice.actions;
export default userSlice.reducer;