export interface IWorkspace {
  id?: number;
  logo: string;
  name: string;
  email: string;
  password: string;
  address: string;
  status: string;
  mobile: number | undefined;
  company?: number;
  dob?: string;
  department?: number;
  profilePicture?: string;
  joiningDate?: string;
  role: string;
  workspaceName?: string;
  departmentName?: string;
  message?: string;
}
