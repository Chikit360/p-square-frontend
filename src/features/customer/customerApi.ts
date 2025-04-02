import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

// Define the async thunk for fetching all customers
export const fetchAllCustomers = createAsyncThunk(
    'customers/fetchAll',
    async (_,{rejectWithValue}) => {
      try {
        const response = await axiosInstance.get('/customers');
        return response.data.data; // Assuming API returns the data in a `data` field
      } catch (error:any) {
        return rejectWithValue(error.response?.data?.message || 'Error adding or updating stock');
      }
    }
  );

  export const fetchCustomerPurchaseHistory = createAsyncThunk(
    'customer/fetchPurchaseHistory',
    async (customerId:string) => {
      const response = await axiosInstance.get(`/customers/${customerId}/purchase-history`);
      return response.data.data; // Assuming the response contains data field
    }
  );