// store/sell/sellSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSale, getAllSales } from './saleApi';

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
      // Create Sale
      .addCase(createSale.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSale.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        const { data, status, message, error } = action.payload;

        if (status !== 200) {
          state.error = error || message;
          return;
        }

        const monthYear = new Date(data.createdAt);
        const year = monthYear.getFullYear();
        const month = monthYear.getMonth() + 1;

        const existingMonth = state.sales.find((sale) => sale.year === year && sale.month === month);

        if (existingMonth) {
          existingMonth.sales.push(data);
          existingMonth.totalTransaction += data.totalAmount;
        } else {
          state.sales.push({
            year,
            month,
            totalTransaction: data.totalAmount,
            sales: [data],
          });
        }
      })
      .addCase(createSale.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload) || 'Failed to create sale';
      })
      // Get All Sales
      .addCase(getAllSales.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllSales.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        const { data, status, message, error } = action.payload;

        if (status !== 200) {
          state.error = error || message;
          return;
        }

        state.sales = data;
      })
      .addCase(getAllSales.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload) || 'Failed to fetch sales';
      });
  },
});

export const { clearSales } = sellSlice.actions;

export default sellSlice.reducer;
