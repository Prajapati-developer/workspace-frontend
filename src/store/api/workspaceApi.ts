import { IWorkspace } from "../../model/workspaceModel";
import { api } from "./api";

export const workspaceApi = api.injectEndpoints({
  endpoints: (build) => ({
    getWorkspace: build.query<IWorkspace[], void>({
      query: () => "/workspace",
      providesTags: ["Workspace"],
    }),
    updateWorkspaceStatus: build.mutation<
      IWorkspace,
      { status: string; id: number }
    >({
      query: (data) => ({
        url: "/updateWorkspaceStatus",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Workspace"],
    }),
    deleteWorkspace: build.mutation<IWorkspace, number>({
      query: (id) => ({
        url: "/workspace/delete",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: ["Workspace"],
    }),
    updateWorkspaceData: build.mutation<IWorkspace, IWorkspace>({
      query: (data) => ({
        url: "/workspace/edit",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Workspace"],
    }),
    createWorkspace: build.mutation<IWorkspace, Omit<IWorkspace, "id">>({
      query: (data) => ({
        url: "/workspace/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Workspace"],
    }),
    getWorkspaceDataById: build.query<IWorkspace, number>({
      query: (id) => ({
        url: `/workspace/getWorkspaceById/${id}`,
        method: "GET",
      }),
      invalidatesTags: ["Workspace"],
    }),
  }),
});

export const {
  useGetWorkspaceQuery,
  useUpdateWorkspaceStatusMutation,
  useDeleteWorkspaceMutation,
  useUpdateWorkspaceDataMutation,
  useLazyGetWorkspaceDataByIdQuery,
  useCreateWorkspaceMutation,
} = workspaceApi;
