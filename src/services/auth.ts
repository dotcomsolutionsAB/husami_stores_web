import { apiSlice } from '../store/slices/apiSlice';

export interface SignInPayload {
  username: string;
  password: string;
}

export interface SignInResponse {
  data: {
    email: string;
    name: string;
    role: string;
    token: string;
    user_id: string;
    username: string;
  };
}

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signIn: builder.mutation<SignInResponse, SignInPayload>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
    }),
  }),
});

export const { useSignInMutation, useLogoutMutation } = authApiSlice;
