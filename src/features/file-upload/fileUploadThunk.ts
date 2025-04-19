import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const bulkUploadInventory = createAsyncThunk<
  void,
  FormData,
  { rejectValue: string }
>(
  'fileUpload/bulkUploadInventory',
  async (formData:FormData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
       `${import.meta.env.VITE_API_URL}/bulk-upload/medicine`,
        formData,
        {
          responseType: 'blob',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'bulk-upload-result.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Upload failed');
    }
  }
);