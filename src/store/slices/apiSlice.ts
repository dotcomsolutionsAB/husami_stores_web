import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { handleApiError } from 'src/utils/error-handler';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: async (args, api, extraOptions) => {
    // Check offline status before making request
    if (!navigator.onLine) {
      handleApiError({ status: 'FETCH_ERROR' });
      return {
        error: {
          status: 'FETCH_ERROR',
          error: 'You are offline. Please check your internet connection.',
        },
      };
    }

    const baseQuery = fetchBaseQuery({
      baseUrl: API_URL,
      prepareHeaders: (headers) => {
        const user = localStorage.getItem('user');
        if (user) {
          const { token } = JSON.parse(user);
          if (token) {
            headers.set('Authorization', `Bearer ${token}`);
          }
        }
        return headers;
      },
    });

    const result = await baseQuery(args, api, extraOptions);

    // Handle errors globally
    if (result.error) {
      handleApiError(result.error);
    }

    return result;
  },
  tagTypes: [],
  endpoints: () => ({}),
});
