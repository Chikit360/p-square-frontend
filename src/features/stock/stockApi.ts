import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';


export const fetchStockDetails = createAsyncThunk(
    'stock/fetchStockDetails',
    async () => {
      const response = await axiosInstance.get("/inventories");
    return response.data;
    }
  );


  // Add or update stock
// Define Type for Inventory Data
interface InventoryData {
  medicineId: string;
  batchNumber?: string;
  manufactureDate?: string;
  expiryDate?: string;
  mrp?: number;
  purchasePrice?: number;
  sellingPrice?: number;
  quantityInStock?: number;
  minimumStockLevel?: number;
  shelfLocation?: string;
}


// Add or Update Stock Thunk
export const addOrUpdateStock = createAsyncThunk(
  'stock/addOrUpdateStock',
  async (stockData: InventoryData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/inventories', stockData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error adding or updating stock');
    }
  }
);

// Thunk to Fetch Inventory Details by Medicine ID
export const fetchInventoryDetailsByMedicineId = createAsyncThunk<
  InventoryData[],
  string,
  { rejectValue: string }
>(
  'inventory/fetchInventoryDetailsByMedicineId',
  async (medicineId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/inventories/medicine-id/${medicineId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error fetching inventory details');
    }
  }
);
