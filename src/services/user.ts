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
  }),
});

// ------------------------------------Exports-------------------------------------

export const { useUserRetrieveMutation } = userApiSlice;
