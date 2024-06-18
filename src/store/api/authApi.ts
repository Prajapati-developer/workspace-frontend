import { api } from "./api";

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    signIn: build.mutation({
      query: (credential) => ({
        url: "/login",
        method: "POST",
        body: credential,
      }),
    }),
  }),
});

export const { useSignInMutation } = authApi;
