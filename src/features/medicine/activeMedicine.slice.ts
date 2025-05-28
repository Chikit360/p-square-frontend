import { createSlice } from '@reduxjs/toolkit';
import { activeMedicines } from './medicineApi';

interface Medicine {
  _id: string,
  name: string,
  totalStock: number,
  sellingPrice?: number,
  mrp: number,
  purchasePrice: number
}

interface MedicineState {
  activeMedicineList: Medicine[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: MedicineState = {
  activeMedicineList: [],
  totalPages: 0,
  currentPage: 0,
  totalCount: 0,
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
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(activeMedicines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch medicines';
      });
  },
});

export default activeMedicineSlice.reducer;
