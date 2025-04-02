import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loginUser } from './authApi';
import { SerializedError } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

interface UserData {
  username: string;
  email: string;
  role:string;
}

interface User {
  data: UserData;
  token: string | null;
}

interface AuthState {
  user: UserData | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const token = Cookies.get('token');
const storedUser = token ? JSON.parse(localStorage.getItem('user') || 'null') : null;

const initialState: AuthState = {
  user: storedUser,
  isAuthenticated: !!token,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload.data;
      state.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(action.payload.data));
      if (action.payload.token) {
        Cookies.set('token', action.payload.token, { expires: 7 });
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      Cookies.remove('token');
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload.data;
        state.isAuthenticated = true;
        Cookies.set('token', action.payload.token!, { expires: 7 });
        localStorage.setItem('user', JSON.stringify(action.payload.data));
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<unknown, string, any, SerializedError>) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to login';
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export const getUserRole = (state: { auth: AuthState }) => state.auth.user?.role;
export default authSlice.reducer;
