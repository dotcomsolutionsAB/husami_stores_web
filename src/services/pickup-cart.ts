import { apiSlice } from '../store/slices/apiSlice';

// -------------------------------Interfaces---------------------------------------

export interface PickupCartRetrievePayload {
  limit: number;
  offset: number;
  search: string;
}

export interface PickupCartData {
  id: number;
  user_id: number;
  user_name: string;
  ctn: number;
  sku: string;
  product_stock_id: number;
  quantity: number;
  created_at: string;
  updated_at: string;
  // Product stock details (to be included in API response)
  grade_no?: string;
  item_name?: string;
  product_size?: string;
  brand_name?: string;
  godown_name?: string;
  total_qty?: number;
  cart_no?: string;
  rack_no?: string;
}

export interface PaginationData {
  limit: number;
  offset: number;
  count?: number;
  total: number;
}

export interface PickupCartRetrieveResponse {
  code: number;
  status: string;
  message: string;
  data: PickupCartData[];
  pagination: PaginationData;
}

export interface PickupCartCreatePayload {
  product_stock_id: number;
  sku: string;
  quantity: number;
}

export interface PickupCartCreateResponse {
  code: number;
  status: string;
  message: string;
  data: PickupCartData;
}

export interface PickupCartDeletePayload {
  id: number;
}

export interface PickupCartDeleteResponse {
  code: number;
  status: string;
  message: string;
}

// ------------------------------------Constants----------------------------------

const PICKUP_CART_PATH = '/pick_up_cart';

// ------------------------------------API Slice-----------------------------------

export const pickupCartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    pickupCartRetrieve: builder.mutation<PickupCartRetrieveResponse, PickupCartRetrievePayload>({
      query: (body) => ({
        url: `${PICKUP_CART_PATH}/retrieve`,
        method: 'POST',
        body,
      }),
    }),
    pickupCartCreate: builder.mutation<PickupCartCreateResponse, PickupCartCreatePayload>({
      query: (body) => ({
        url: `${PICKUP_CART_PATH}/create`,
        method: 'POST',
        body,
      }),
    }),
    pickupCartDelete: builder.mutation<PickupCartDeleteResponse, PickupCartDeletePayload>({
      query: (body) => ({
        url: `${PICKUP_CART_PATH}/delete/${body.id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

// ------------------------------------Exports-------------------------------------

export const {
  usePickupCartRetrieveMutation,
  usePickupCartCreateMutation,
  usePickupCartDeleteMutation,
} = pickupCartApiSlice;
