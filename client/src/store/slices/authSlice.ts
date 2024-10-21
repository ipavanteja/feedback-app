import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  user: any;
  error: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  loading: true,
  user: null,
  error: null,
};

export const loadUser = createAsyncThunk(
  "auth/loadUser",
  async (_, { getState }) => {
    const { auth } = getState() as { auth: AuthState };
    const config = {
      headers: {
        "x-auth-token": auth.token,
      },
    };
    const res = await axios.get("http://localhost:5000/api/auth/user", config);
    return res.data;
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (
    formData: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      );
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data.msg);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (
    formData: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data.msg);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loadUser.rejected, (state) => {
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.user = null;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(register.rejected, (state, action) => {
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
