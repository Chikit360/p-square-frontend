import { createSlice, } from '@reduxjs/toolkit';
import { createMedicine, getAllMedicines, deleteMedicineById, getMedicineById, updateMedicineById, searchMedicine } from './medicineApi';
import { GlobalErrorPayload } from '../../helpers/interfaces';

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
  error: boolean;
  message:string|null
}

const initialState: MedicineState = {
  medicines: [],
  searchResult:[],
  recentCreatedMedicineId:null,
  selectedMedicine: null,
  success: false,
  loading: false,
  error: false,
  message:null
};

const medicineSlice = createSlice({
  name: 'medicines',
  initialState,
  reducers: {
    clearMedicineMessage:(state)=>{
     
        state.success= false,
        state.error=false,
        state.message= null
      
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(searchMedicine.pending, (state) => {
      state.loading = true;
      state.error = false;
      state.success = false;
    })
    .addCase(searchMedicine.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.searchResult = action.payload.data;
    })
    .addCase(searchMedicine.rejected, (state) => {
      state.loading = false;
      state.success = false;
      state.error = true;
      // state.message = action.payload.message;
    })
      .addCase(getAllMedicines.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.success = false;
      })
      .addCase(getAllMedicines.fulfilled, (state, action) => {
        state.loading = false;
        state.medicines = action.payload.data;
        state.success = true;
        // state.message=action.payload.message
      })
      .addCase(getAllMedicines.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = true;
        const { message } = action.payload as GlobalErrorPayload;
          state.message = message;
      })
      .addCase(createMedicine.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = false;
      })
      .addCase(createMedicine.fulfilled, (state, action) => {
        state.medicines.push(action.payload.data);
        state.recentCreatedMedicineId = action.payload.data._id;
        state.success = true;
        state.loading = false;
        state.message = action.payload.message;
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
          state.message = action.payload.message;
          state.success = true;
          state.loading = false;
        }
      });
  },
});

export const {clearMedicineMessage}= medicineSlice.actions;

export default medicineSlice.reducer;
