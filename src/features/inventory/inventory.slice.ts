import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { addInventory, addOrUpdateInventory, fetchInventoryDetailsByMedicineId, updateInventory } from './inventoryApi';

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
  error: boolean ;
  message: string | null;
  success: boolean;
}

// Initial State
const initialState: InventoryState = {
  inventoryData: [],
  loading: false,
  error: false,
  message: null,
  success: false,
};

// Stock Slice
const stockSlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    clearInventoryMessage: (state) => {
      state.success = false;
      state.error = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Inventory Details
    builder
      .addCase(fetchInventoryDetailsByMedicineId.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchInventoryDetailsByMedicineId.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.inventoryData = action.payload.data; // Corrected
        state.success = true;
        // state.message = action.payload.message;
      })
      .addCase(fetchInventoryDetailsByMedicineId.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.message = action.error?.message || 'Failed to fetch inventory details';
      })
      .addCase(addOrUpdateInventory.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(addOrUpdateInventory.fulfilled, (state, action: PayloadAction<any>) => {
        const updatedStock = action.payload.data;
      
        if (!updatedStock.batchNumber) {
          console.error('Batch number is required');
          return;
        }
      
        // Check for existing inventory with the same batchNumber and expiryDate
        const existingInventoryIndex = state.inventoryData?.findIndex(
          (stock) => stock.batchNumber === updatedStock.batchNumber &&
                     stock.expiryDate === updatedStock.expiryDate
        );
      
        if (existingInventoryIndex !== -1) {
          // Update existing inventory
          state.inventoryData[existingInventoryIndex] = updatedStock;
        } else {
          // Check if any inventory exists with the same batchNumber
          const existingInventoryItemIndex = state.inventoryData?.findIndex(
            (stock) => stock.batchNumber === updatedStock.batchNumber
          );
      
          if (existingInventoryItemIndex === -1) {
            // No inventory exists, add as new inventory
            state.inventoryData?.push(updatedStock);
          } else {
            // Create a new inventory entry if expiryDate is different
            const existingInventoryItem = state.inventoryData[existingInventoryItemIndex];
      
            const newInventory = {
              ...updatedStock,
              batchNumber: updatedStock.batchNumber || existingInventoryItem.batchNumber,
              mrp: updatedStock.mrp ?? existingInventoryItem.mrp,
              purchasePrice: updatedStock.purchasePrice ?? existingInventoryItem.purchasePrice,
              sellingPrice: updatedStock.sellingPrice ?? existingInventoryItem.sellingPrice,
              manufactureDate: updatedStock.manufactureDate || existingInventoryItem.manufactureDate,
              minimumStockLevel: updatedStock.minimumStockLevel ?? existingInventoryItem.minimumStockLevel,
              shelfLocation: updatedStock.shelfLocation || existingInventoryItem.shelfLocation,
            };
      
            state.inventoryData?.push(newInventory);
          }
        }
      
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      
      
      
      .addCase(addOrUpdateInventory.rejected, (state,) => {
        state.loading = false;
        state.error = false;
      }).addCase(addInventory.pending, (state) => {
        state.loading = true;
      })
      .addCase(addInventory.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.inventoryData.push(action.payload);
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(addInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = false;
      state.message = action.error?.message || 'Failed to add inventory';
      }).addCase(updateInventory.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateInventory.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.inventoryData = action.payload;
        state.success = true;
        state.message = action.payload.message;

      })
      .addCase(updateInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = false;
        state.message = action.error?.message || 'Failed to update inventory';
      });
  },
});

export const { clearInventoryMessage } = stockSlice.actions;
export default stockSlice.reducer;
