import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api";
import { getUserFromToken } from "../../auth/authService";

interface AuthState {
  token: string | null;
  user: any | null;
  loading: boolean;
  error: string | null;
}

const tokenFromStorage = localStorage.getItem("token");

const initialState: AuthState = {
  token: tokenFromStorage,
  user: tokenFromStorage ? getUserFromToken() : null,
  loading: false,
  error: null
};

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (data: { username: string; password: string }, thunkAPI) => {
    try {
      const res = await api.post("/auth/login", data);
      return res.data.token;
    } catch (err: any) {
      return thunkAPI.rejectWithValue("Invalid username or password");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
    },
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;

        localStorage.setItem("token", action.payload);
        state.user = getUserFromToken();
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;