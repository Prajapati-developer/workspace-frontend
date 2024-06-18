import { lazy } from "react";
import { ROLE } from "../common/constants";

const NotFound = lazy(() => import("../common/components/router/NotFound"));
const Workspace = lazy(() => import("../pages/Workspace"));
const Login = lazy(() => import("../pages/Login"));
const CreateWorkspace = lazy(
  () => import("../features/workspace/CreateWorkspace")
);
const EmployeeList = lazy(() => import("../features/employee/EmployeeList"));
const AddEmployee = lazy(() => import("../features/employee/AddEmployee"));
const Dashboard = lazy(() => import("../pages/Dashboard"));

const Profile = lazy(() => import("../pages/Profile"));
export const PUBLIC_ROUTES = [
  {
    path: "/",
    component: Login,
    title: "Login | ",
  },
  {
    path: "*",
    component: NotFound,
    title: "Page Not Found | ",
  },
];

export const PRIVATE_ROUTES = [
  {
    path: "/dashboard",
    component: Dashboard,
    title: "Home | ",
  },
  {
    path: "/workspace",
    component: Workspace,
    title: "Workspace | ",
    role: [ROLE.SUPER_ADMIN],
  },
  {
    path: "/workspace/edit/:id",
    component: CreateWorkspace,
    title: "Workspace | ",
    role: [ROLE.SUPER_ADMIN],
  },
  {
    path: "/workspace/create",
    component: CreateWorkspace,
    title: "Workspace | ",
    role: [ROLE.SUPER_ADMIN],
  },
  {
    path: "workspace/:workspaceId/employees",
    component: EmployeeList,
    title: "Workspace | ",
    role: [ROLE.ADMIN],
  },
  {
    path: "employee/edit/:id",
    component: AddEmployee,
    title: "Workspace | ",
    role: [ROLE.ADMIN],
  },
  {
    path: "employee/add",
    component: AddEmployee,
    title: "Workspace | ",
    role: [ROLE.ADMIN],
  },
  {
    path: "profile",
    component: Profile,
    title: "Workspace | ",
  },
];
