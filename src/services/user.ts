import { apiSlice } from '../store/slices/apiSlice';

// -------------------------------Interfaces---------------------------------------

export interface UserRetrievePayload {
  limit: number;
  offset: number;
  search: string;
}

export interface UserData {
  id: number;
  name: string;
  email: string;
  mobile?: string;
  role: string;
  username: string;
  created_at: string;
}

export interface PaginationData {
  limit: number;
  offset: number;
  count?: number;
  total: number;
}

export interface UserRetrieveResponse {
  code: number;
  status: string;
  message: string;
  data: UserData[];
  pagination: PaginationData;
}

export interface UserCreatePayload {
  name: string;
  email: string;
  mobile?: string;
  role: string;
  username: string;
}

export interface UserCreateResponse {
  code: number;
  status: string;
  message: string;
  data: UserData;
}

export interface UserUpdatePayload {
  id: number;
  name?: string;
  email?: string;
  mobile?: string;
  role?: string;
  username?: string;
}

export interface UserUpdateResponse {
  code: number;
  status: string;
  message: string;
  data: UserData;
}

export interface UserDeletePayload {
  id: number;
}

export interface UserDeleteResponse {
  code: number;
  status: string;
  message: string;
}

// ------------------------------------Constants----------------------------------

const USER_PATH = '/users';

// ------------------------------------API Slice-----------------------------------

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    userRetrieve: builder.mutation<UserRetrieveResponse, UserRetrievePayload>({
      query: (body) => ({
        url: `${USER_PATH}/retrieve`,
        method: 'POST',
        body,
      }),
    }),
    userCreate: builder.mutation<UserCreateResponse, UserCreatePayload>({
      query: (body) => ({
        url: `${USER_PATH}/create`,
        method: 'POST',
        body,
      }),
    }),
    userUpdate: builder.mutation<UserUpdateResponse, UserUpdatePayload>({
      query: (body) => ({
        url: `${USER_PATH}/update/${body.id}`,
        method: 'POST',
        body,
      }),
    }),
    userDelete: builder.mutation<UserDeleteResponse, UserDeletePayload>({
      query: (body) => ({
        url: `${USER_PATH}/delete/${body.id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

// ------------------------------------Exports-------------------------------------

export const {
  useUserRetrieveMutation,
  useUserCreateMutation,
  useUserUpdateMutation,
  useUserDeleteMutation,
} = userApiSlice;
