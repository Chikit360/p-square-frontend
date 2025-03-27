// store/sell/sellApi.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';
// Create Sale
export const createSale = createAsyncThunk(
    'sell/createSale',
    async (saleData: any, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.post('/stocks', saleData);
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to create sale');
      }
    }
  );
  
  // Get All Sales
  export const getAllSales = createAsyncThunk(
    'sell/getAllSales',
    async (_, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get('/stocks',);
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch sales');
      }
    }
  );