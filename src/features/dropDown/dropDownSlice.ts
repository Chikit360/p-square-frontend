import { createSlice } from "@reduxjs/toolkit";
import { DropdownOption } from "../../helpers/interfaces";
import { addDropdownOption, deleteDropdownOption, fetchDropdownOptions, updateDropdownOption } from "./dropDownApi";

interface DropdownState {
    dropdowns: {
      [key: string]: DropdownOption[]; // Stores different dropdown types dynamically
    };
    loading: boolean;
    error: boolean;
    message: string | null;
    success: boolean;
  }
  
  const initialState: DropdownState = {
    dropdowns: {}, // Each dropdown type will be stored dynamically
    loading: false,
    error: false,
    message: null,
    success: false,
  };

  const dropdownSlice = createSlice({
    name: "dropdown",
    initialState,
    reducers: {
      clearDDMessage: (state) => {
        state.success = false;
        state.error = false;
        state.message = null;
      }
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchDropdownOptions.pending, (state) => { state.loading = true; })
        .addCase(fetchDropdownOptions.fulfilled, (state, action) => {
          state.loading = false;
          state.dropdowns[action.payload.dropdownType] = action.payload.data;
        })
        .addCase(addDropdownOption.fulfilled, (state, action) => {
          console.log(action.payload.data)
          console.log(action.payload.data.inputFieldName)
          state.dropdowns[action.payload.data.inputFieldName]?.push(action.payload.data);
          state.message=action.payload.message;
          state.success=action.payload.success;
          state.loading=false;
        })
        .addCase(updateDropdownOption.fulfilled, (state, action) => {
          console.log(action.payload.data)
          
          state.dropdowns[action.payload.data.inputFieldName] = state.dropdowns[action.payload.data.inputFieldName].map(
            (opt) => (opt._id === action.payload.data._id ? action.payload.data : opt)
          );
          state.message=action.payload.message;
          state.success=action.payload.success;
        })
        .addCase(deleteDropdownOption.fulfilled, (state, action) => {
          state.dropdowns[action.payload.inputFieldName] = state.dropdowns[action.payload.inputFieldName].filter(
            (opt) => opt._id !== action.payload._id
          );
          state.message="Deleted successfully";
          state.success=true;
        
        });
    },
  });
  
  export const {clearDDMessage}=dropdownSlice.actions;
  export default dropdownSlice.reducer;
  
  