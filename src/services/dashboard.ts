import { apiSlice } from '../store/slices/apiSlice';

// -------------------------------Interfaces---------------------------------------

export interface IDashboardFilters {
  search: string;
  date_from: string;
  date_to: string;
  godown: string;
  grade: string;
  brand: string;
  specification: string;
  item: string;
  size: string;
  finish: string;
  filterButtons: boolean[];
}

export const defaultDashboardFilters: IDashboardFilters = {
  search: '',
  date_from: '',
  date_to: '',
  godown: '',
  grade: '',
  brand: '',
  specification: '',
  item: '',
  size: '',
  finish: '',
  filterButtons: [false, false, false, false, false],
};

export interface IDashboardRetrievePayload {
  limit: number;
  offset: number;
  search: string;
  date_from?: string;
  date_to?: string;
  godown: string;
  grade: string;
  brand: string;
  specification: string;
  item: string;
  size: string;
  finish: string;
}

export interface IFilterGetApiResponse {
  id: number;
  name: string;
}

export interface IDashboardData {
  sku: string;
  grade_no: string;
  item_name: string;
  product_size: string;
  product_brand: number;
  finish_type: string;
  specifications: string;
  id: number;
  godown_id: number;
  quantity: number;
  ctn: number;
  sent: number;
  batch_no: string;
  rack_no: string;
  invoice_no: string;
  invoice_date: string;
  tc_no: string;
  tc_date: string;
  tc_attachment: string | null;
  remarks: string;
  created_at: string;
  updated_at: string;
  tc_attachment_paths: [];
}

export interface IPaginationData {
  limit: number;
  offset: number;
  count?: number;
  total: number;
}

export interface IDashboardRetrieveResponse {
  code: number;
  status: string;
  message: string;
  data: IDashboardData[];
  pagination: IPaginationData;
}

export interface IDashboardCreatePayload {
  name: string;
  email: string;
  mobile?: string;
  role: string;
  username: string;
}

export interface IDashboardCreateResponse {
  code: number;
  status: string;
  message: string;
  data: IDashboardData;
}

export interface IDashboardUpdatePayload {
  id: number;
  name?: string;
  email?: string;
  mobile?: string;
  role?: string;
  username?: string;
}

export interface IDashboardUpdateResponse {
  code: number;
  status: string;
  message: string;
  data: IDashboardData;
}

export interface IDashboardDeletePayload {
  id: number;
}

export interface IDashboardDeleteResponse {
  code: number;
  status: string;
  message: string;
}

// ------------------------------------Constants----------------------------------

const MASTERS_PATH = '/masters';
const DASHBOARD_PATH = '/product_stock';

// ------------------------------------API Slice-----------------------------------

export const dashboardApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGrades: builder.query<IFilterGetApiResponse[], void>({
      query: () => ({
        url: `${MASTERS_PATH}/grades`,
        method: 'GET',
      }),
      transformResponse: (response: { data: IFilterGetApiResponse[] }) => response.data || [],
    }),
    getItems: builder.query<IFilterGetApiResponse[], void>({
      query: () => ({
        url: `${MASTERS_PATH}/items`,
        method: 'GET',
      }),
      transformResponse: (response: { data: IFilterGetApiResponse[] }) => response.data || [],
    }),
    getSizes: builder.query<IFilterGetApiResponse[], void>({
      query: () => ({
        url: `${MASTERS_PATH}/sizes`,
        method: 'GET',
      }),
      transformResponse: (response: { data: IFilterGetApiResponse[] }) => response.data || [],
    }),
    getRacks: builder.query<IFilterGetApiResponse[], void>({
      query: () => ({
        url: `${MASTERS_PATH}/racks`,
        method: 'GET',
      }),
      transformResponse: (response: { data: IFilterGetApiResponse[] }) => response.data || [],
    }),
    dashboardRetrieve: builder.mutation<IDashboardRetrieveResponse, IDashboardRetrievePayload>({
      query: (body) => ({
        url: `${DASHBOARD_PATH}/retrieve`,
        method: 'POST',
        body,
      }),
    }),
    dashboardCreate: builder.mutation<IDashboardCreateResponse, IDashboardCreatePayload>({
      query: (body) => ({
        url: `${DASHBOARD_PATH}/create`,
        method: 'POST',
        body,
      }),
    }),
    dashboardUpdate: builder.mutation<IDashboardUpdateResponse, IDashboardUpdatePayload>({
      query: (body) => ({
        url: `${DASHBOARD_PATH}/update/${body.id}`,
        method: 'POST',
        body,
      }),
    }),
    dashboardDelete: builder.mutation<IDashboardDeleteResponse, IDashboardDeletePayload>({
      query: (body) => ({
        url: `${DASHBOARD_PATH}/delete/${body.id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

// ------------------------------------Exports-------------------------------------

export const {
  useGetGradesQuery,
  useGetItemsQuery,
  useGetSizesQuery,
  useGetRacksQuery,
  useDashboardRetrieveMutation,
  useDashboardCreateMutation,
  useDashboardUpdateMutation,
  useDashboardDeleteMutation,
} = dashboardApiSlice;
