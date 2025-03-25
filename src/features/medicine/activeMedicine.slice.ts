import { createSlice } from '@reduxjs/toolkit';
import {activeMedicines } from './medicineApi';

interface Medicine {
  _id:string,
  medicineId: string;
  name: string;
  genericName: string;
  manufacturer: string;
  category: string;
  form: string;
  strength: string;
  unit: string;
  batchNumber: string;
  manufactureDate: string;
  expiryDate: string;
  mrp: number;
  purchasePrice: number;
  sellingPrice: number;
  quantityInStock: number;
  minimumStockLevel: number;
  shelfLocation: string;
  prescriptionRequired: boolean;
  notes?: string;
  status: string;
}

interface MedicineState {
  activeMedicineList: Medicine[];
  loading: boolean;
  error: string | null;
}

const initialState: MedicineState = {
  activeMedicineList: [],
  
  loading: false,
  error: null,
};

const activeMedicineSlice = createSlice({
  name: 'active medicines',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(activeMedicines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(activeMedicines.fulfilled, (state, action) => {
        state.loading = false;
        state.activeMedicineList = action.payload.data;
      })
      .addCase(activeMedicines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch medicines';
      });
  },
});

export default activeMedicineSlice.reducer;
