// src/features/admin/adminSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { fetchDashboardAnalytics } from './adminApi';

export interface ChartSeries {
    name: string;
    data: number[];
  }
  
  export interface ChartData {
    series: ChartSeries[];
    xaxis: {
      type: string;
      categories: string[];
    };
  }
  
  export interface DashboardAnalyticsData {
    totalMedicines: number;
    totalInventory: number;
    totalCustomers: number;
    totalTodaySales: number;
    totalProfitToday: number;
    chart: ChartData;
  }

interface AdminState {
  dashboardData: DashboardAnalyticsData | null;
  loading: boolean;
  error: boolean;
  message: string | null;
  success: boolean;
}

// Initial State
const initialState: AdminState = {
  dashboardData: null,
  loading: false,
  error: false,
  message: null,
  success: false,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardAnalytics.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.success = false;
        state.message = null;
      })
      .addCase(fetchDashboardAnalytics.fulfilled, (state, action) => {
        console.log(action.payload)
        state.dashboardData = action.payload;
        state.loading = false;
        state.success = true;
        state.message = 'Dashboard analytics fetched successfully';
      })
      .addCase(fetchDashboardAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.success = false;
        state.message = action.payload as string;
      });
  },
});

export default adminSlice.reducer;
