import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const submitContact = createAsyncThunk(
  'contact/submit',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/contact`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const contactSlice = createSlice({
  name: 'contact',
  initialState: { submitted: false, error: null },
  reducers: { reset: (state) => { state.submitted = false; state.error = null; } },
  extraReducers: (b) => {
    b
      .addCase(submitContact.fulfilled, (state) => { state.submitted = true; state.error = null; })
      .addCase(submitContact.rejected, (state, a) => { state.error = a.payload; });
  }
});

export const { reset } = contactSlice.actions;
export default contactSlice.reducer;
