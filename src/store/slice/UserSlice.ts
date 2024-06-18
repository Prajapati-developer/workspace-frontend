import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { IUser } from "../../model/userModel";

export interface UserState {
  name: string;
  email: string;
  password: string;
  companyId?: number;
  dob: string;
  department: string;
  mobile: number;
  joiningDate: string;
  id: number;
  role: string;
}

const initialState: IUser = {
  name: "",
  email: "",
  password: "",
  dob: "",
  department: undefined,
  joiningDate: "",
  mobile: undefined,
  role: "",
  status: "",
  profilePicture: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserProfile: (state, action: PayloadAction<IUser>) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.password = action.payload.password;
      state.company = action.payload.company;
      state.mobile = action.payload.mobile;
      state.dob = action.payload.dob;
      state.department = action.payload.department;
      state.joiningDate = action.payload.joiningDate;
      state.id = action.payload.id;
      state.role = action.payload.role;
      state.status = action.payload.status;
      state.profilePicture = action.payload.profilePicture;
    },
  },
});

export const { setUserProfile } = userSlice.actions;
export const getUserProfile = (state: RootState) => state.user;

export default userSlice.reducer;
