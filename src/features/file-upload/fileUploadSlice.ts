import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { bulkUploadInventory } from './fileUploadThunk';


// Initial state
export interface FileUploadState {
  loading: boolean;
  error: string | null;
}

const initialState: FileUploadState = {
  loading: false,
  error: null,
};

// Slice
const fileUploadSlice = createSlice({
  name: 'fileUpload',
  initialState,
  reducers: {
    resetUploadState(state) {
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bulkUploadInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkUploadInventory.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(bulkUploadInventory.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });
  },
});

// Exports
export const { resetUploadState } = fileUploadSlice.actions;
export default fileUploadSlice.reducer;
