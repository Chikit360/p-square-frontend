// store/sell/sellSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSale, getAllSales } from './inventoryApi';

interface Sale {
  invoiceId: string;
  customerName: string;
  customerContact: string;
  totalAmount: number;
  createdAt: string;
}

interface MonthlySale {
  year: number;
  month: number;
  totalTransaction: number;
  sales: Sale[];
}

interface SalesState {
  sales: MonthlySale[];
  loading: boolean;
  error: string | null;
}

const initialState: SalesState = {
  sales: [],
  loading: false,
  error: null,
};

const sellSlice = createSlice({
  name: 'sale',
  initialState,
  reducers: {
    clearSales: (state) => {
      state.sales = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSale.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSale.fulfilled, (state, action: PayloadAction<Sale>) => {
        state.loading = false;
        const monthYear = new Date(action.payload.createdAt);
        const year = monthYear.getFullYear();
        const month = monthYear.getMonth() + 1;

        const existingMonth = state.sales.find((sale) => sale.year === year && sale.month === month);

        if (existingMonth) {
          existingMonth.sales.push(action.payload);
          existingMonth.totalTransaction += action.payload.totalAmount;
        } else {
          state.sales.push({
            year,
            month,
            totalTransaction: action.payload.totalAmount,
            sales: [action.payload],
          });
        }
      })
      .addCase(createSale.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload) || 'Failed to create sale';
      })
      .addCase(getAllSales.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllSales.fulfilled, (state, action: PayloadAction<MonthlySale[]>) => {
        state.loading = false;
        state.sales = action.payload;
      })
      .addCase(getAllSales.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload) || 'Failed to fetch sales';
      });
  },
});

export const { clearSales } = sellSlice.actions;

export default sellSlice.reducer;
