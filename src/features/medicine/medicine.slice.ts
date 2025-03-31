import { createSlice } from '@reduxjs/toolkit';
import { createMedicine, getAllMedicines, deleteMedicineById, getMedicineById, updateMedicineById, searchMedicine } from './medicineApi';

interface Medicine {
  _id:string,
  medicineId: string;
  medicineCode:string,
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
  totalQuantity: number;
}

interface MedicineState {
  medicines: Medicine[];
  searchResult:Medicine[],
  recentCreatedMedicineId: string | null;
  selectedMedicine: Medicine | null;
  success:boolean,
  loading: boolean;
  error: string | null;
}

const initialState: MedicineState = {
  medicines: [],
  searchResult:[],
  recentCreatedMedicineId:null,
  selectedMedicine: null,
  success: false,
  loading: false,
  error: null,
};

const medicineSlice = createSlice({
  name: 'medicines',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(searchMedicine.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(searchMedicine.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.searchResult = action.payload.data;
    })
    .addCase(searchMedicine.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch medicines';
    })
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
      .addCase(createMedicine.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(createMedicine.fulfilled, (state, action) => {
        state.medicines.push(action.payload.data);
        state.recentCreatedMedicineId = action.payload.data._id;
        state.success = true;
        state.loading = false;
      })
      .addCase(deleteMedicineById.fulfilled, (state, action) => {
        state.medicines = state.medicines.filter((medicine) => medicine.medicineId !== action.payload);
      })
      .addCase(getMedicineById.fulfilled, (state, action) => {
        state.selectedMedicine = action.payload;
      })
      .addCase(updateMedicineById.fulfilled, (state, action) => {
        console.log(action.payload.data._id)
        const index = state.medicines.findIndex((medicine) =>String(medicine._id) === String(action.payload.data._id));
        if (index !== -1) {
          state.medicines[index] = {...action.payload.data}; // correct in future
        }
      });
  },
});

export default medicineSlice.reducer;
