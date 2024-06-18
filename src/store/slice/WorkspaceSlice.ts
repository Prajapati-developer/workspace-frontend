import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { IWorkspace } from "../../model/workspaceModel";

const initialState: IWorkspace = {
  logo: "",
  name: "",
  email: "",
  password: "",
  address: "",
  status: "A",
  id: undefined,
  mobile: undefined,
  role: "",
};

export const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setWorkSpaceData: (state, action) => {
      state.email = action.payload.email;
      state.logo = action.payload.logo;
      state.name = action.payload.name;
      state.password = action.payload.password;
      state.address = action.payload.address;
      state.status = action.payload.status;
      state.id = action.payload.id;
      state.mobile = action.payload.mobile;
    },
  },
});

export const { setWorkSpaceData } = workspaceSlice.actions;
export const getWorkspaceDetails = (state: RootState) => state.workspace;

export default workspaceSlice.reducer;
