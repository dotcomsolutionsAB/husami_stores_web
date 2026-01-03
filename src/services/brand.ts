import { apiSlice } from '../store/slices/apiSlice';

// -------------------------------Interfaces---------------------------------------

export interface IBrandLogoRef {
  id: number;
  file_name: string;
  file_path: string;
  file_ext: string;
  file_size: number;
  created_at: string;
  updated_at: string;
}

export interface IBrandData {
  id: number;
  name: string;
  order_by: number;
  hex_code: string;
  logo: number | null;
  logo_ref: IBrandLogoRef | null;
}

export interface IBrandRetrievePayload {
  limit?: number;
  offset?: number;
  search?: string;
}

export interface IBrandRetrieveResponse {
  code: number;
  status: string;
  message: string;
  data: IBrandData[];
  pagination?: {
    limit: number;
    offset: number;
    count?: number;
    total: number;
  };
}

export interface IBrandCreatePayload {
  name: string;
  order_by?: number;
  hex_code?: string;
}

export interface IBrandCreateResponse {
  code: number;
  status: string;
  message: string;
  data: IBrandData;
}

export interface IBrandUpdatePayload {
  id: number;
  name?: string;
  order_by?: number;
  hex_code?: string;
}

export interface IBrandUpdateResponse {
  code: number;
  status: string;
  message: string;
  data: IBrandData;
}

export interface IBrandDeletePayload {
  id: number;
}

export interface IBrandDeleteResponse {
  code: number;
  status: string;
  message: string;
}

// ------------------------------------Constants----------------------------------

const BRAND_PATH = '/brand';

// ------------------------------------API Slice-----------------------------------

export const brandApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    brandRetrieve: builder.mutation<IBrandRetrieveResponse, IBrandRetrievePayload | void>({
      query: (body) => ({
        url: `${BRAND_PATH}/retrieve`,
        method: 'POST',
        body: body || {},
      }),
    }),
    brandCreate: builder.mutation<IBrandCreateResponse, IBrandCreatePayload>({
      query: (body) => ({
        url: `${BRAND_PATH}/create`,
        method: 'POST',
        body,
      }),
    }),
    brandUpdate: builder.mutation<IBrandUpdateResponse, IBrandUpdatePayload>({
      query: (body) => ({
        url: `${BRAND_PATH}/update/${body.id}`,
        method: 'POST',
        body,
      }),
    }),
    brandDelete: builder.mutation<IBrandDeleteResponse, IBrandDeletePayload>({
      query: (body) => ({
        url: `${BRAND_PATH}/delete/${body.id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

// ------------------------------------Exports-------------------------------------

export const {
  useBrandRetrieveMutation,
  useBrandCreateMutation,
  useBrandUpdateMutation,
  useBrandDeleteMutation,
} = brandApiSlice;
