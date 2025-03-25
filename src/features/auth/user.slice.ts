import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {  loginUser } from './authApi';
import { SerializedError } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

interface UserData {
  username: string;
  email: string;
}

interface User {
  data: UserData;
  token: string | null;
}

interface AuthState {
  user: UserData | null;
  isAuthenticated:boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated:false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload.data;
      state.isAuthenticated=true
      if (action.payload.token) {
        Cookies.set('token', action.payload.token, { expires: 7 }); // Store token for 7 days
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated=false
      Cookies.remove('token'); // Remove token on logout
    },
  },
  extraReducers: (builder) => {
    builder
      // .addCase(fetchUser.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(fetchUser.fulfilled, (state, action: PayloadAction<UserData>) => {
      //   state.loading = false;
      //   state.user = action.payload;
      //   state.isAuthenticated=true
      // })
      // .addCase(fetchUser.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = String(action.payload) || 'Failed to fetch user';
      // })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload.data;
        if (action.payload.token) {
          Cookies.set('token', action.payload.token, { expires: 7 }); // Store token
          state.isAuthenticated=true
        }
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<unknown, string, any, SerializedError>) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to login';
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
