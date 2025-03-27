import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { addOrUpdateStock, fetchStockDetails } from './stockApi';

interface StockDetail {
  expiryDate: string;
  quantityInStock: number;
}

interface StockItem {
  medicineId: string;
  medicineName: string;
  totalQuantity: number;
  inventoryDetails: StockDetail[];
}

interface StockState {
  stocks: StockItem[];
  loading: boolean;
  error: string | null;
}

const initialState: StockState = {
  stocks: [],
  loading: false,
  error: null,
};

const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Stock Details
    builder
      .addCase(fetchStockDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStockDetails.fulfilled, (state, action: PayloadAction<any>) => {
        state.stocks = action.payload?.data || [];
        state.loading = false;
      })
      .addCase(fetchStockDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch stock data';
      });

    // Add or Update Stock
    builder
      .addCase(addOrUpdateStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addOrUpdateStock.fulfilled, (state, action: PayloadAction<any>) => {
        const updatedStock = action.payload?.data;

        // Update state with the new stock details
        state.stocks = state.stocks.map((stock) =>
          stock.medicineId === updatedStock.medicineId ? updatedStock : stock
        );

        const isNewMedicine = !state.stocks.some(stock => stock.medicineId === updatedStock.medicineId);
        if (isNewMedicine) {
          state.stocks.push(updatedStock);
        }

        state.loading = false;
      })
      .addCase(addOrUpdateStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update stock data';
      });
  },
});

export default stockSlice.reducer;
