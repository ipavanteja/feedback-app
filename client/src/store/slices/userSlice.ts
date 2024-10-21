import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "..";

interface User {
  _id: string;
  username: string;
}

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

export const getUsers = createAsyncThunk(
  "users/getUsers",
  async (_, { getState }) => {
    const { auth } = getState() as RootState;
    const config = {
      headers: {
        "x-auth-token": auth.token,
      },
    };
    const res = await axios.get("http://localhost:5000/api/users", config);
    return res.data;
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = false;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      });
  },
});

export default userSlice.reducer;
