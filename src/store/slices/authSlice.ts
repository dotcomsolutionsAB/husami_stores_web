import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

export interface AuthState {
  user: Record<string, any> | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: (() => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  })(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Record<string, any>>) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearAuth: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('user');
    },
  },
});

export const { setUser, setLoading, setError, clearAuth } = authSlice.actions;
export const authReducer = authSlice.reducer;
