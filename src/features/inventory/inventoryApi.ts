import {  createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';


export const fetchInventoryDetails = createAsyncThunk(
    'inventory/fetchInventoryDetails',
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
export const addOrUpdateInventory = createAsyncThunk(
  'inventory/addOrUpdateInventory',
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

// Add inventory
export const addInventory = createAsyncThunk(
  'inventory/add',
  async (inventoryData: any, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/inventories/add', inventoryData);
      return response.data.data; // Assuming data is in the `data` key in the response
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update inventory by ID
export const updateInventory = createAsyncThunk(
  'inventory/update',
  async (updateData: { inventoryId: string; inventoryData: any }, thunkAPI) => {
    try {
      const { inventoryId, inventoryData } = updateData;
      const response = await axiosInstance.put(`/inventories/update/${inventoryId}`, inventoryData);
      return response.data.data; // Assuming data is in the `data` key in the response
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);