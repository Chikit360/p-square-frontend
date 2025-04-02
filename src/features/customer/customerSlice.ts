import { createSlice,  } from '@reduxjs/toolkit';

import { fetchAllCustomers, fetchCustomerPurchaseHistory } from './customerApi';

// Interface for the Medicine
interface Medicine {
  name: string;
  sellingPrice: number;
}

// Interface for a single Item in an Invoice
interface InvoiceItem {
  medicineId: Medicine; // The medicine details
  quantity: number;   // Quantity of the medicine
  price:number;
  total:number;
}

// Interface for a single Invoice
interface Invoice {
  invoiceId: string;   // Unique invoice ID
  items: InvoiceItem[]; // Array of items in the invoice
  totalAmount: number;  // Total amount of the invoice
}

// Interface for the purchaseHistory response
interface PurchaseHistoryResponse {
  customer: {
    name: string;
    mobile: string;
    email?: string;
    dateOfBirth?: string;
    address?: string;
  };
  invoices: Invoice[]; // Array of invoices
}

// Define the customer slice
const customerSlice = createSlice({
  name: 'customers',
  initialState: {
    customers: [],  // array of customers
    purchaseHistory: null as PurchaseHistoryResponse |null,  // initialize purchaseHistory as an empty array of type PurchaseHistoryResponse
    loading: false,  // loading state
    error: null as string | null,  // error state for error messages
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCustomers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;  // set customers list from API response
      })
      .addCase(fetchAllCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch customers'; // handle error and set message
      })

      .addCase(fetchCustomerPurchaseHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCustomerPurchaseHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.purchaseHistory = action.payload; // set purchase history from API response
      })
      .addCase(fetchCustomerPurchaseHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch purchase history'; // handle error and set message
      });
  },
});

export default customerSlice.reducer;
