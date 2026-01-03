import { apiSlice } from '../store/slices/apiSlice';

// -------------------------------Interfaces---------------------------------------

export interface IGodownData {
  id: number;
  name: string;
}

export interface IGodownRetrievePayload {
  limit?: number;
  offset?: number;
  search?: string;
}

export interface IGodownRetrieveResponse {
  code: number;
  status: string;
  message: string;
  data: IGodownData[];
  pagination?: {
    limit: number;
    offset: number;
    count?: number;
    total: number;
  };
}

export interface IGodownCreatePayload {
  name: string;
}

export interface IGodownCreateResponse {
  code: number;
  status: string;
  message: string;
  data: IGodownData;
}

export interface IGodownUpdatePayload {
  id: number;
  name?: string;
}

export interface IGodownUpdateResponse {
  code: number;
  status: string;
  message: string;
  data: IGodownData;
}

export interface IGodownDeletePayload {
  id: number;
}

export interface IGodownDeleteResponse {
  code: number;
  status: string;
  message: string;
}

// ------------------------------------Constants----------------------------------

const GODOWN_PATH = '/godown';

// ------------------------------------API Slice-----------------------------------

export const godownApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    godownRetrieve: builder.mutation<IGodownRetrieveResponse, IGodownRetrievePayload | void>({
      query: (body) => ({
        url: `${GODOWN_PATH}/retrieve`,
        method: 'POST',
        body: body || {},
      }),
    }),
    godownCreate: builder.mutation<IGodownCreateResponse, IGodownCreatePayload>({
      query: (body) => ({
        url: `${GODOWN_PATH}/create`,
        method: 'POST',
        body,
      }),
    }),
    godownUpdate: builder.mutation<IGodownUpdateResponse, IGodownUpdatePayload>({
      query: (body) => ({
        url: `${GODOWN_PATH}/update/${body.id}`,
        method: 'POST',
        body,
      }),
    }),
    godownDelete: builder.mutation<IGodownDeleteResponse, IGodownDeletePayload>({
      query: (body) => ({
        url: `${GODOWN_PATH}/delete/${body.id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

// ------------------------------------Exports-------------------------------------

export const {
  useGodownRetrieveMutation,
  useGodownCreateMutation,
  useGodownUpdateMutation,
  useGodownDeleteMutation,
} = godownApiSlice;
