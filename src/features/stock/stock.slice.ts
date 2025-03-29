import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { addOrUpdateStock, fetchInventoryDetailsByMedicineId } from './stockApi';

// Define Interfaces
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

interface InventoryState {
  inventoryData: InventoryData[];
  loading: boolean;
  error: string | null;
}

// Initial State
const initialState: InventoryState = {
  inventoryData: [],
  loading: false,
  error: null,
};

// Stock Slice
const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Inventory Details
    builder
      .addCase(fetchInventoryDetailsByMedicineId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventoryDetailsByMedicineId.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.inventoryData = action.payload.data; // Corrected
      })
      .addCase(fetchInventoryDetailsByMedicineId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to fetch inventory details';
      });

    // Add or Update Stock
    builder
      .addCase(addOrUpdateStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addOrUpdateStock.fulfilled, (state, action: PayloadAction<any>) => {
        const updatedStock = action.payload.data;
      
        // Check if the inventory with the same medicineId and expiryDate exists
        const existingInventoryIndex = state.inventoryData?.findIndex(
          (stock) => stock.medicineId === updatedStock.medicineId &&
                     stock.expiryDate === updatedStock.expiryDate
        );
      
        if (existingInventoryIndex !== -1) {
          // Update existing inventory by adding quantity
          state.inventoryData[existingInventoryIndex]=updatedStock;
        } else {
          // Check if any inventory exists for the given medicineId
          const existingMedicineIndex = state.inventoryData?.findIndex(
            (stock) => stock.medicineId === updatedStock.medicineId
          );
      
          if (existingMedicineIndex === -1) {
            // No inventory exists, add as new inventory
            state.inventoryData?.push(updatedStock);
          } else {
            // Create a new inventory entry if expiryDate is different
            const existingMedicine = state.inventoryData?.[existingMedicineIndex];
      
            const newInventory = {
              ...updatedStock,
              batchNumber: updatedStock.batchNumber || existingMedicine?.batchNumber || '',
              mrp: updatedStock.mrp ?? existingMedicine?.mrp ?? 0,
              purchasePrice: updatedStock.purchasePrice ?? existingMedicine?.purchasePrice ?? 0,
              sellingPrice: updatedStock.sellingPrice ?? existingMedicine?.sellingPrice ?? 0,
              manufactureDate: updatedStock.manufactureDate || existingMedicine?.manufactureDate,
              minimumStockLevel: updatedStock.minimumStockLevel ?? existingMedicine?.minimumStockLevel ?? 0,
              shelfLocation: updatedStock.shelfLocation || existingMedicine?.shelfLocation || '',
            };
      
            state.inventoryData?.push(newInventory);
          }
        }
        
        state.loading = false;
      })
      
      
      .addCase(addOrUpdateStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to update stock data';
      });
  },
});

export default stockSlice.reducer;
