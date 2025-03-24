import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';


// Create Medicine
export const createMedicine = createAsyncThunk(
  'medicine/createMedicine',
  async (medicineData:any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/medicines", medicineData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'An error occurred');
    }
  }
);

// Get All Medicines
export const getAllMedicines = createAsyncThunk(
  'medicine/getAllMedicines',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/medicines");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'An error occurred');
    }
  }
);

// Get Medicine By ID
export const getMedicineById = createAsyncThunk(
  'medicine/getMedicineById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/medicines/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'An error occurred');
    }
  }
);

// Update Medicine By ID
export const updateMedicineById = createAsyncThunk(
  'medicine/updateMedicineById',
  async ({ id, medicineData }: { id: string; medicineData: any }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/medicines/${id}`, medicineData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'An error occurred');
    }
  }
);

// Delete Medicine By ID
export const deleteMedicineById = createAsyncThunk(
  'medicine/deleteMedicineById',
  async (id: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/medicines/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'An error occurred');
    }
  }
);

// Delete Medicine By ID
export const activeMedicines = createAsyncThunk(
  'medicine/active list',
  async (_, { rejectWithValue }) => {
    try {
      const response=await axiosInstance.get(`/medicines/active`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'An error occurred');
    }
  }
);
