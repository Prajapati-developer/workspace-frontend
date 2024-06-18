import { IDepartment, IUser } from "../../model/userModel";
import { api } from "./api";

export const employeeApi = api.injectEndpoints({
  endpoints: (build) => ({
    getEmployees: build.query({
      query: () => "/employee",
      providesTags: ["Employee"],
    }),
    registerEmployee: build.mutation({
      query: (data) => ({
        url: "/employee",
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["Employee"],
    }),
    getEmployeeByWorkspaceId: build.query({
      query: (data) =>
        data.page
          ? data.limit
            ? `workspace/employee/${data.workspaceId}?page=${data.page}&limit=${data.limit}`
            : `workspace/employee/${data.workspaceId}?page=${data.page}`
          : `workspace/employee/${data.workspaceId}`,
      providesTags: ["WorkspaceEmployees"],
    }),
    deleteEmployee: build.mutation({
      query: (data) => ({
        url: `/employee/delete`,
        method: "Delete",
        body: data,
      }),
      invalidatesTags: ["WorkspaceEmployees"],
    }),
    editEmployee: build.mutation({
      query: (data) => ({
        url: `/employee/edit/${data.id}`,
        method: "Put",
        body: data,
      }),
      invalidatesTags: ["WorkspaceEmployees"],
    }),

    getEmployeeById: build.query({
      query: (id) => ({
        url: `/employee/${id}`,
        method: "GET",
      }),
    }),
    addEmployee: build.mutation({
      query: (data) => ({
        url: `/employee/add`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["WorkspaceEmployees"],
    }),
    getDepartment: build.query<IDepartment[], void>({
      query: () => "/department",
    }),
    filterByDepartment: build.query({
      query: (id) => ({
        url: `/employee/${id}`,
        method: "GET",
      }),
    }),
    updateEmployeeStatus: build.mutation<IUser, { status: string; id: number }>(
      {
        query: (data) => ({
          url: "/updateEmployeeStatus",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["WorkspaceEmployees"],
      }
    ),
  }),
});

export const {
  useRegisterEmployeeMutation,
  useGetEmployeesQuery,
  // useGetEmployeeByWorkspaceIdQuery,
  useLazyGetEmployeeByWorkspaceIdQuery,
  useDeleteEmployeeMutation,
  useLazyGetEmployeeByIdQuery,
  useAddEmployeeMutation,
  useGetDepartmentQuery,
  useLazyFilterByDepartmentQuery,
  useUpdateEmployeeStatusMutation,
} = employeeApi;
