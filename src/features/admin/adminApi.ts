// src/features/admin/adminThunk.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

export const fetchDashboardAnalytics = createAsyncThunk(
  'admin/fetchDashboardAnalytics',
  async (range:string, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/dashboard/analytics?range=${range}`);
      return response.data.data; // Assuming the API wraps data inside { data: {...} }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);
