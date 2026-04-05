import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchReports = createAsyncThunk(
  'analytics/fetchReports',
  async (params, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const res = await axios.get(`${API_URL}/analytics/reports`, {
        headers: { Authorization: `Bearer ${auth.token}` },
        params: params || {}
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: { data: null, isLoading: false, error: null },
  extraReducers: (b) => {
    b
      .addCase(fetchReports.pending, (s) => { s.isLoading = true; s.error = null; })
      .addCase(fetchReports.fulfilled, (s, a) => { s.isLoading = false; s.data = a.payload.data; })
      .addCase(fetchReports.rejected, (s, a) => { s.isLoading = false; s.error = a.payload; });
  }
});

export default analyticsSlice.reducer;
