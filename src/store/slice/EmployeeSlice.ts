import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface Employee {
  name: string;
  email: string;
  password: string;
  companyId?: number;
  dob: string;
  department: string;
  mobile: number;
  joiningDate: string;
  id: number;
}

const initialState: Employee = {
  name: "",
  email: "",
  password: "",
  dob: "",
  department: "",
  joiningDate: "",
  mobile: 0,
  id: 0,
};

export const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    setEmployeeData: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.password = action.payload.password;
      state.companyId = action.payload.companyId;
      state.mobile = action.payload.mobile;
      state.dob = action.payload.dob;
      state.department = action.payload.department;
      state.joiningDate = action.payload.joiningDate;
      state.id = action.payload.id;
    },
  },
});

export const { setEmployeeData } = employeeSlice.actions;
export const getEmployeeDetails = (state: RootState) => state.employee;

export default employeeSlice.reducer;
