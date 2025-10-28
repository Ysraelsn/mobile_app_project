import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  userId: string | null;
  name: string | null;
  email: string | null;
  role: "user" | "admin" | null;
  photoURL?: string | null;
}

const initialState: UserState = {
  userId: null,
  name: null,
  email: null,
  photoURL: null,
  role: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{
        userId: string;
        name: string;
        email: string;
        role: "user" | "admin";
        photoURL?: string | null;
      }>,
    ) => {
      state.userId = action.payload.userId;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.photoURL = action.payload.photoURL;
    },
    clearUser: (state) => {
      state.userId = null;
      state.name = null;
      state.email = null;
      state.role = null;
      state.photoURL = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
