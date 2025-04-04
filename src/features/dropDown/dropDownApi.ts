import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";
import { DropdownOption } from "../../helpers/interfaces";

export const fetchDropdownOptions = createAsyncThunk(
    "dropdown/fetchOptions",
    async (dropdownType: string) => {
      const response = await axiosInstance.get(`/dropdowns?inputFieldName=${dropdownType}`);
      return { dropdownType, ...response.data };
    }
  );

  export const addDropdownOption = createAsyncThunk(
    "dropdown/addOption",
    async ( option : DropdownOption ) => {
      const response = await axiosInstance.post("/dropdowns", option);
      return response.data;
    }
  );

  export const updateDropdownOption = createAsyncThunk(
    "dropdown/updateOption",
    async ( option: DropdownOption ) => {
      
      const response = await axiosInstance.put(`/dropdowns/${option._id}`, option);
      return  response.data;
    }
  );
  
  export const deleteDropdownOption = createAsyncThunk(
    "dropdown/deleteOption",
    async (option: DropdownOption) => {
      console.log(option)
      await axiosInstance.delete(`/dropdowns/${option._id}`);
      return  option;
    }
  );
  