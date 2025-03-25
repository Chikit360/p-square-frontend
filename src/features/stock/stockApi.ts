import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

export const getStockDetails = async () => {
  
  const response = await axiosInstance.get("/stock");
  return response.data;
};

  export const fetchStockDetails = createAsyncThunk(
    'stock/fetchStockDetails',
    async () => {
      return await getStockDetails();
    }
  );


  // Add or update stock
export const addOrUpdateStock = createAsyncThunk(
    'stock/addOrUpdateStock',
    async (stockData: { medicineId: string; quantity: number; expiryDate: string }, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.post('/stock', stockData);
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Error adding or updating stock');
      }
    }
  );