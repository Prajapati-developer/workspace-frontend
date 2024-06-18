import { api } from "./api";

export const userApi = api.injectEndpoints({
  endpoints: (build) => ({
    updateUserProfile: build.mutation({
      query: (updatedData) => ({
        url: "/updateUser",
        method: "POST",
        body: updatedData,
      }),
    }),
  }),
});

export const { useUpdateUserProfileMutation } = userApi;
