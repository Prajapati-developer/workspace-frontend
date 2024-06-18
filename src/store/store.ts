import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { api } from "./api/api";
import authReducer from "./slice/AuthSlice";
import userReducer from "./slice/UserSlice";
import workspaceReducer from "./slice/WorkspaceSlice";
import employeeReducer from "./slice/EmployeeSlice";

const saveState = (state: any) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("root", serializedState);
  } catch (err) {
    console.error("error:", err);
  }
};

const loadState = () => {
  try {
    const serializedState = localStorage.getItem("root");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("error:", err);
    return undefined;
  }
};
const preloadedState = loadState();

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  authentication: authReducer,
  user: userReducer,
  workspace: workspaceReducer,
  employee: employeeReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
  preloadedState,
});

store.subscribe(() => {
  saveState({
    authentication: store.getState().authentication,
  });
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
