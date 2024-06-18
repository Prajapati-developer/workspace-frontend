import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { authApi } from "../api/authApi";
import { IUser } from "../../model/userModel";

export interface AuthState {
  isAuthenticated: boolean;
  role: string;
  email: string;
  userId: number | undefined;
  workspaceId?: number;
  impersonateUserId?: number;
  impersonateUserRole?: string;
  departmentId?: number;
}

const initialState: AuthState = {
  isAuthenticated: true,
  role: "super_admin",
  email: "",
  userId: undefined,
};

export const authSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    signOut: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.signIn.matchFulfilled,
      (state, action: PayloadAction<IUser>) => {
        state.isAuthenticated = true;
        state.email = action.payload.email;
        state.role = action.payload.role;
        state.userId = action.payload.id;
        state.workspaceId = action.payload?.company;
        state.departmentId = action.payload?.department;
      }
    );
  },
});

export const { signOut } = authSlice.actions;
export const getAuthDetails = (state: RootState) => state.authentication;

export default authSlice.reducer;
