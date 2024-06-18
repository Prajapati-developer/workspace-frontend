import { IWorkspace } from "./workspaceModel";

export interface IUser {
  name: string;
  email: string;
  password: string;
  company?: number;
  dob: string;
  department?: number;
  mobile: number | undefined;
  profilePicture: string;
  joiningDate: string;
  id?: number;
  role: string;
  status: string;
  workspaceName?: string;
  departmentName?: string;
}
export interface IUserLoginRes extends IUser {
  workspace: IWorkspace;
}

export interface IUserProfileRes extends IUser {
  workspaceName?: string;
  departmentName?: string;
}
export interface IDepartment {
  id: number;
  departmentName: string;
}
