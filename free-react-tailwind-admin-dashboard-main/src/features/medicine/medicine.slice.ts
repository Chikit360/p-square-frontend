import { createSlice } from '@reduxjs/toolkit';
import { createMedicine, getAllMedicines, deleteMedicineById, getMedicineById, updateMedicineById } from './medicineApi';

interface Medicine {
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
  medicines: Medicine[];
  selectedMedicine: Medicine | null;
  loading: boolean;
  error: string | null;
}

const initialState: MedicineState = {
  medicines: [],
  selectedMedicine: null,
  loading: false,
  error: null,
};

const medicineSlice = createSlice({
  name: 'medicines',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllMedicines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllMedicines.fulfilled, (state, action) => {
        state.loading = false;
        state.medicines = action.payload.data;
      })
      .addCase(getAllMedicines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch medicines';
      })
      .addCase(createMedicine.fulfilled, (state, action) => {
        state.medicines.push(action.payload);
      })
      .addCase(deleteMedicineById.fulfilled, (state, action) => {
        state.medicines = state.medicines.filter((medicine) => medicine.medicineId !== action.payload);
      })
      .addCase(getMedicineById.fulfilled, (state, action) => {
        state.selectedMedicine = action.payload;
      })
      .addCase(updateMedicineById.fulfilled, (state, action) => {
        const index = state.medicines.findIndex((medicine) => medicine.medicineId === action.payload.medicineId);
        if (index !== -1) {
          state.medicines[index] = action.payload;
        }
      });
  },
});

export default medicineSlice.reducer;
