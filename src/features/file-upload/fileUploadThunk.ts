import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface UploadResponse {
  resultTable: any[];
  resultFile: string;
}

export const bulkUploadInventory = createAsyncThunk<
  UploadResponse,
  FormData,
  { rejectValue: string }
>(
  'fileUpload/bulkUploadInventory',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/bulk-upload/medicine`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data.data as UploadResponse;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Upload failed');
    }
  }
);
