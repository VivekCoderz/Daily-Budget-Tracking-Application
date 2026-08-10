import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import Cookies from 'js-cookie';

// Async Thunks
export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/auth/me');
    return res.data.user;
  } catch (err) {
    return rejectWithValue(err.customMessage || 'Session expired');
  }
});

export const loginUser = createAsyncThunk('auth/loginUser', async ({ email, password }, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.token) {
      Cookies.set('token', res.data.token, { expires: 7 });
      localStorage.setItem('bt_token', res.data.token);
    }
    return res.data.user;
  } catch (err) {
    return rejectWithValue(err.customMessage || 'Login failed');
  }
});

export const registerUser = createAsyncThunk('auth/registerUser', async ({ name, email, password }, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/register', { name, email, password });
    if (res.data.token) {
      Cookies.set('token', res.data.token, { expires: 7 });
      localStorage.setItem('bt_token', res.data.token);
    }
    return res.data.user;
  } catch (err) {
    return rejectWithValue(err.customMessage || 'Registration failed');
  }
});

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  try {
    await api.post('/auth/logout');
  } catch (e) {
    // Ignore logout errors
  } finally {
    Cookies.remove('token');
    localStorage.removeItem('bt_token');
    localStorage.removeItem('bt_user');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('bt_user') || 'null'),
    isAuthenticated: !!(Cookies.get('token') || localStorage.getItem('bt_token')),
    loading: true,
    error: null
  },
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
        localStorage.setItem('bt_user', JSON.stringify(action.payload));
      })
      .addCase(checkAuth.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
        localStorage.setItem('bt_user', JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
        localStorage.setItem('bt_user', JSON.stringify(action.payload));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      });
  }
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
