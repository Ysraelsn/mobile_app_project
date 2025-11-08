import { createSlice } from "@reduxjs/toolkit";
import { loginUser } from "./thunks";

interface AuthState {
  isLoggedIn: boolean;
  userId: string | null;
  status: "idle" | "loading" | "checking" | "succeeded" | "failed";
  errorMessage?: string;
}

const initialState: AuthState = {
  isLoggedIn: false,
  userId: null,
  status: "idle",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: { payload: { userId: string } }) => {
      state.isLoggedIn = true;
      state.userId = action.payload.userId;
      state.status = "succeeded";
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userId = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isLoggedIn = true;
        state.userId = action.payload.userId;
        state.errorMessage = undefined;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.isLoggedIn = false;
        state.userId = null;
        state.errorMessage = action.payload;
      });
  },
});

export const { setAuth, logout } = authSlice.actions;

export default authSlice.reducer;
